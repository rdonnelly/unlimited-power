import { FlashList } from '@shopify/flash-list';
import { useCallback, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@components/Button';
import { CardListItem } from '@components/CardListItem';
import { Error } from '@components/Error';
import { QueryNotice } from '@components/QueryNotice';
import { useCards } from '@data/hooks/useCards';
import { useFilters } from '@hooks/useFilters';
import { useTheme } from '@hooks/useTheme';
import { useIsOnline } from '@hooks/useIsOnline';

type CardListProps = {
  bottomInset?: number;
  onPressItem: (
    id: number,
    index: number,
    title: string,
    caption?: string,
  ) => void;
};

export function CardList({
  onPressItem: handlePressItem,
  bottomInset = 0,
}: CardListProps) {
  const { theme, themeStyles } = useTheme();
  const isOnline = useIsOnline();

  const {
    data,
    isLoading,
    isFetching,
    isError,
    isFetchingNextPage,
    isFetchNextPageError,
    isPaused,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useCards();

  const cards = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const cardCount = useMemo(() => {
    return cards.length;
  }, [cards.length]);

  const loadNextPage = useCallback(() => {
    if (hasNextPage && !isFetching && !isPaused && !isError) {
      void fetchNextPage({ cancelRefetch: false });
    }
  }, [hasNextPage, isFetching, isPaused, isError, fetchNextPage]);

  const { numFiltersApplied, reset: resetFilters } = useFilters();

  const insets = useSafeAreaInsets();

  const retry = () => {
    if (isFetchNextPageError) void fetchNextPage({ cancelRefetch: false });
    else void refetch({ cancelRefetch: false });
  };

  if (isError && !data) {
    return (
      <Error
        labelPrimary="Retry"
        onPrimary={() => refetch()}
        labelSecondary="Reset Filters"
        onSecondary={() => resetFilters()}
      />
    );
  }

  if (isPaused && !data) {
    return (
      <Error
        message="Make sure you have a network connection and try again."
        labelPrimary="Retry"
        onPrimary={() => refetch()}
      />
    );
  }

  if (data === undefined) {
    return (
      <View style={[styles.container, themeStyles.background0]}>
        <View style={styles.activity}>
          <ActivityIndicator color={theme.tintSubdued} />
        </View>
      </View>
    );
  }

  if (!cards.length) {
    return (
      <Error
        heading="Karabast!"
        message={
          !isOnline || isPaused
            ? 'Offline. No loaded cards match these filters. Connect or reset filters to try again.'
            : isError
              ? 'Cached results are empty and could not be updated. Try again or reset filters.'
              : 'No cards found matching search and filter criteria.'
        }
        labelPrimary="Retry"
        onPrimary={() => refetch()}
        labelSecondary="Reset Filters"
        onSecondary={() => resetFilters()}
      />
    );
  }

  return (
    <View style={styles.container}>
      {!isOnline || isPaused || isError ? (
        <QueryNotice
          message={
            !isOnline || isPaused
              ? 'Offline. Showing loaded cards.'
              : 'Cards could not be updated. Showing loaded results.'
          }
          onRetry={retry}
          busy={isFetching}
        />
      ) : null}
      {numFiltersApplied ? (
        <View style={[styles.filterBanner, themeStyles.background200]}>
          <Text style={[styles.filterText, themeStyles.colorSubdued]}>
            {`${numFiltersApplied} Filter${numFiltersApplied !== 1 ? 's' : ''} Applied`}
          </Text>
          <Button size="tiny" onPress={resetFilters}>
            Clear Filters
          </Button>
        </View>
      ) : null}
      <View style={[styles.listContainer, themeStyles.background0]}>
        <FlashList
          data={cards}
          keyExtractor={(card) => String(card.id)}
          refreshing={isFetching && !isFetchingNextPage && !isLoading}
          onRefresh={() => {
            void refetch({ cancelRefetch: false });
          }}
          keyboardDismissMode="on-drag"
          contentContainerStyle={{
            paddingBottom: bottomInset + Math.max(16, insets.bottom),
          }}
          scrollIndicatorInsets={{ bottom: bottomInset + insets.bottom }}
          renderItem={({ item: card, index }) => (
            <CardListItem card={card} index={index} onPress={handlePressItem} />
          )}
          onEndReached={loadNextPage}
          onEndReachedThreshold={1.5}
          ListFooterComponent={
            <View style={[styles.listFooter, themeStyles.background0]}>
              {isFetching ? (
                <ActivityIndicator color={theme.tintSubdued} />
              ) : hasNextPage ? (
                <Button
                  onPress={() => {
                    void fetchNextPage({ cancelRefetch: false });
                  }}
                  size="small"
                >
                  Load more cards
                </Button>
              ) : (
                <Text style={[styles.listFooterText, themeStyles.colorSubdued]}>
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

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
  },
  activity: {
    position: 'absolute',
    top: 96,
  },
  filterBanner: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
  },
  filterText: {
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  listFooter: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
  },
  listFooterText: {
    fontWeight: '700',
  },
});
