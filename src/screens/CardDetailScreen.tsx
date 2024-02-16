import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CardDetailImages } from '@components/CardDetailImages';
import { useCard } from '@data/hooks/useCard';
import { useTheme } from '@hooks/useTheme';
import type { CardDetailScreenProps } from '@navigation/types';
import { DARK_THEME, LIGHT_THEME } from '@styles/colors';

export function CardDetailScreen({ navigation, route }: CardDetailScreenProps) {
  const { theme } = useTheme();
  const { data, error, isError } = useCard(route.params.id);

  if (data) {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <CardDetailImages cardAttributes={data.attributes} />
        </View>
      </ScrollView>
    );
  }

  if (isError) {
    if (error instanceof Error) {
      return <Text>Error: {error.message}</Text>;
    }

    return <Text>An unknown error occured</Text>;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={
          theme.scheme === 'light'
            ? LIGHT_THEME.tintSubdued
            : DARK_THEME.tintSubdued
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 16,
  },
});
