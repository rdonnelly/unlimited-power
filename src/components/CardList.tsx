import { FlashList } from '@shopify/flash-list';
import { useCallback, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { CardListItem, ITEM_HEIGHT } from '@components/CardListItem';
import { Error } from '@components/Error';
import { useCards } from '@data/hooks/useCards';
import { useFilters } from '@hooks/useFilters';
import { useTheme } from '@hooks/useTheme';

import { Button } from './Button';

type CardListProps = {
  onPressItem: (
    id: number,
    index: number,
    title: string,
    caption?: string,
  ) => void;
  collapseBottomSheet: () => void;
};

export function CardList({
  onPressItem: handlePressItem,
  collapseBottomSheet,
}: CardListProps) {
  const { theme, themeStyles } = useTheme();

  const {
    data,
    isLoading,
    isFetching,
    isError,
    isFetched,
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
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  const handleScrollBeginDrag = useCallback(() => {
    collapseBottomSheet();
  }, [collapseBottomSheet]);

  const { numFiltersApplied, reset: resetFilters } = useFilters();

  if (isError) {
    return (
      <Error
        labelPrimary="Retry"
        onPrimary={() => refetch()}
        labelSecondary="Reset Filters"
        onSecondary={() => resetFilters()}
      />
    );
  }

  if (isPaused) {
    return (
      <Error
        message="Make sure you have a network connection and try again."
        labelPrimary="Retry"
        onPrimary={() => refetch()}
      />
    );
  }

  if (isLoading || (isFetching && !isFetched) || data === undefined) {
    return (
      <View style={[styles.container, themeStyles.background0]}>
        <View style={styles.activity}>
          <ActivityIndicator color={theme.tintSubdued} />
        </View>
      </View>
    );
  }

  if (isPaused) {
    return (
      <Error
        message="Make sure you have a network connection and try again."
        labelPrimary="Retry"
        onPrimary={() => refetch()}
      />
    );
  }

  if (!cards.length) {
    return (
      <Error
        heading="Karabast!"
        message="No cards found matching search and filter criteria."
        labelPrimary="Retry"
        onPrimary={() => refetch()}
        labelSecondary="Reset Filters"
        onSecondary={() => resetFilters()}
      />
    );
  }

  return (
    <View style={styles.container}>
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
          renderItem={({ item: card, index }) => (
            <CardListItem card={card} index={index} onPress={handlePressItem} />
          )}
          estimatedItemSize={ITEM_HEIGHT}
          onEndReached={loadNextPage}
          onEndReachedThreshold={1.5}
          onScrollBeginDrag={handleScrollBeginDrag}
          ListFooterComponent={
            <View style={[styles.listFooter, themeStyles.background0]}>
              {isLoading || isFetching || hasNextPage || cardCount == null ? (
                <ActivityIndicator color={theme.tintSubdued} />
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
  error: {
    maxWidth: 240,
    paddingTop: 96,
  },
  errorInfo: {
    marginBottom: 64,
  },
  errorInfoHeading: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorInfoText: {
    fontSize: 16,
    textAlign: 'center',
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
  clearFilters: {
    fontSize: 16,
    fontWeight: '700',
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
