import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { CardList } from '@components/CardList';
import { useCards } from '@data/hooks/useCards';

export function CardListScreen() {
  const { data, error, isFetching, isError, hasNextPage, fetchNextPage } =
    useCards();

  if (data) {
    const cards = data.pages.flatMap((page) => page.data);
    return (
      <View style={styles.container}>
        <>
          <CardList
            cards={cards}
            hasNextPage={!!hasNextPage}
            fetchNextPage={fetchNextPage}
          />
          {isFetching ? <ActivityIndicator /> : null}
        </>
      </View>
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
