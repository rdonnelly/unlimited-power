import type { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { parseLinkPath } from '@data/linkParams';
import type { StackParamList } from '@navigation/types';

// Paths and validation live in @data/linkParams. The list stays underneath a
// linked card so Back returns to it.
export const linking: LinkingOptions<StackParamList> = {
  prefixes: [Linking.createURL('/')],
  getStateFromPath(path) {
    const target = parseLinkPath(path);
    if (target.screen === 'card') {
      return {
        routes: [
          { name: 'StackCardListScreen' },
          {
            name: 'StackCardDetailScreen',
            params: { id: target.id, index: 0, standalone: true },
          },
        ],
      };
    }
    return {
      routes: [
        {
          name: 'StackCardListScreen',
          params: target.filters ? { filters: target.filters } : undefined,
        },
      ],
    };
  },
};
