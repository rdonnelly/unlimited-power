import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { CardFilters } from '@data/CardFilters';

export type StackParamList = {
  // Filters to apply on arrival (deep links, App Intents); cleared once applied
  StackCardListScreen: { filters?: Partial<CardFilters> } | undefined;
  StackCardDetailScreen: {
    id: number;
    // Missing for deep links; filled in once the card loads
    title?: string;
    caption?: string;
    index: number;
    // Show only this card instead of paging through the card list results
    standalone?: boolean;
  };
  StackInfoScreen: undefined;
};

export type CardListScreenProps = NativeStackScreenProps<
  StackParamList,
  'StackCardListScreen'
>;

export type CardDetailScreenProps = NativeStackScreenProps<
  StackParamList,
  'StackCardDetailScreen'
>;

export type InfoScreenProps = NativeStackScreenProps<
  StackParamList,
  'StackInfoScreen'
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends StackParamList {}
  }
}
