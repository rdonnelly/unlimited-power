import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CardList } from '@components/CardList';
import { useCards } from '@data/hooks/useCards';
import type { CardListScreenProps } from '@navigation/types';

export function CardListScreen({ navigation }: CardListScreenProps) {
  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) => {
        return (
          <Pressable
            onPress={() => {
              navigation.push('StackInfoScreen');
            }}
          >
            {({ pressed }) => (
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={tintColor}
                style={{ opacity: pressed ? 0.5 : 1 }}
              />
            )}
          </Pressable>
        );
      },
    });
  }, [navigation]);

  const handlePressItem = useCallback(
    (id: number) => {
      if (navigation) {
        navigation.push('StackCardDetailScreen', {
          id,
        });
      }
    },
    [navigation],
  );

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
            handlePressItem={handlePressItem}
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
    flex: 1,
    justifyContent: 'center',
  },
});
