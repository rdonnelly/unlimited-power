import { FlashList } from '@shopify/flash-list';
import { useCallback, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Button } from '@components/Button';
import { CardListItem, ITEM_HEIGHT } from '@components/CardListItem';
import { useCards } from '@data/hooks/useCards';
import { useTheme } from '@hooks/useTheme';
import { DARK_THEME, LIGHT_THEME } from '@styles/theme';

type CardListProps = {
  onPressItem: (
    id: number,
    index: number,
    title: string,
    caption?: string,
  ) => void;
};

export function CardList({ onPressItem: handlePressItem }: CardListProps) {
  const { theme, themeStyles } = useTheme();

  const {
    data,
    isFetching,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useCards();

  const cards = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? undefined;
  }, [data]);

  const cardCount = useMemo(() => {
    return data?.pages[0]?.meta.pagination.total;
  }, [data]);

  const loadNextPage = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  if (cards && !isLoading) {
    if (!cards.length) {
      return (
        <View style={styles.container}>
          <View style={styles.error}>
            <Text
              style={[styles.errorHeaderText, themeStyles.themedColorSubdued]}
            >
              Karabast!
            </Text>
            <Text style={[styles.errorText, themeStyles.themedColorSubdued]}>
              No cards found matching search and filter criteria.
            </Text>
          </View>

          <Button variant="bold" onPress={() => refetch()}>
            Retry
          </Button>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={[styles.listContainer, themeStyles.themedbackground0]}>
          <FlashList
            data={cards}
            renderItem={({ item: card, index }) => (
              <CardListItem
                card={card}
                index={index}
                onPress={handlePressItem}
              />
            )}
            estimatedItemSize={ITEM_HEIGHT}
            onEndReached={loadNextPage}
            onEndReachedThreshold={1.5}
            ListFooterComponent={
              <View style={[styles.listFooter, themeStyles.themedbackground0]}>
                {isLoading || isFetching || cardCount == null ? (
                  <ActivityIndicator
                    color={
                      theme.scheme === 'light'
                        ? LIGHT_THEME.tintSubdued
                        : DARK_THEME.tintSubdued
                    }
                  />
                ) : (
                  <Text style={styles.listFooterText}>
                    {cardCount} Cards Found
                  </Text>
                )}
              </View>
            }
          />
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <View style={styles.error}>
          <Text
            style={[styles.errorHeaderText, themeStyles.themedColorSubdued]}
          >
            Bantha Poodoo!
          </Text>
          <Text style={[styles.errorText, themeStyles.themedColorSubdued]}>
            An unknown error occured while fetching card data.
          </Text>
        </View>

        <Button variant="bold" onPress={() => refetch()}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.activity}>
        <ActivityIndicator
          color={
            theme.scheme === 'light'
              ? LIGHT_THEME.tintSubdued
              : DARK_THEME.tintSubdued
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  activity: {
    position: 'absolute',
    top: 96,
  },
  error: {
    marginBottom: 64,
    maxWidth: 240,
  },
  errorHeaderText: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  listFooter: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 128,
  },
  listFooterText: {
    fontWeight: '700',
  },
});
