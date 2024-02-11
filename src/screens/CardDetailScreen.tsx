import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useCard } from '@data/hooks/useCard';
import type { CardDetailScreenProps } from '@navigation/types';

export function CardDetailScreen({ navigation, route }: CardDetailScreenProps) {
  const { data, error, isFetching, isError } = useCard(route.params.id);

  useEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: data?.data.attributes.title ?? '',
    });
  }, [navigation, data]);

  if (data) {
    return (
      <>
        <View style={styles.container}>
          <Text>{data.data.attributes.title}</Text>
        </View>
      </>
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
      <ActivityIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
  },
});
