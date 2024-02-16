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
import { useTheme } from '@hooks/useTheme';
import type { CardListScreenProps } from '@navigation/types';
import { DARK_THEME, LIGHT_THEME } from '@styles/colors';

export function CardListScreen({ navigation }: CardListScreenProps) {
  const { theme, themeStyles } = useTheme();

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
    (id: number, title: string, caption?: string) => {
      if (navigation) {
        navigation.push('StackCardDetailScreen', {
          id,
          title,
          caption,
        });
      }
    },
    [navigation],
  );

  const { data, isFetching, isError, hasNextPage, fetchNextPage, refetch } =
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
          {isFetching ? (
            <ActivityIndicator
              size="large"
              color={
                theme.scheme === 'light'
                  ? LIGHT_THEME.tintSubdued
                  : DARK_THEME.tintSubdued
              }
            />
          ) : null}
        </>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <View style={styles.error}>
          <Text style={[styles.errorText, themeStyles.themedColorSubdued]}>
            An unknown error occured while fetching card data.
          </Text>
        </View>
        <Pressable onPress={() => refetch()}>
          {({ pressed }) => (
            <View
              style={[
                styles.retryButton,
                pressed ? styles.retryButtonPressed : undefined,
                themeStyles.themedBackgroundButtonSubdued,
              ]}
            >
              <Text
                style={[
                  styles.retryButtonText,
                  themeStyles.themedColorButtonSubdued,
                ]}
              >
                Retry
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    );
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
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  error: {
    marginBottom: 32,
    maxWidth: 240,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  retryButtonPressed: {
    opacity: 0.5,
  },
  retryButtonText: {
    fontSize: 18,
    fontWeight: '500',
  },
});
