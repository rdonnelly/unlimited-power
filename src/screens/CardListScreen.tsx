import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { CardList } from '@components/CardList';
import { useCards } from '@data/hooks/useCards';

export function CardListScreen() {
  const { data, error, isFetching, isError } = useCards();

  if (data) {
    return (
      <View style={styles.container}>
        <>
          <CardList cards={data.data} />
          <Text>{isFetching ? 'Fetching...' : ' '}</Text>
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
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
