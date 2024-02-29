import { FlashList } from '@shopify/flash-list';
import { useCallback, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { CardListItem, ITEM_HEIGHT } from '@components/CardListItem';
import { Error } from '@components/Error';
import { useCards } from '@data/hooks/useCards';
import { useTheme } from '@hooks/useTheme';

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

  if (isLoading || (isFetching && !cards.length) || data == null) {
    return (
      <View style={[styles.container, themeStyles.themedbackground0]}>
        <View style={styles.activity}>
          <ActivityIndicator color={theme.tintSubdued} />
        </View>
      </View>
    );
  }

  if (isError) {
    return <Error onRetry={() => refetch()} />;
  }

  if (!cards.length) {
    return (
      <Error
        heading="Karabast!"
        message="No cards found matching search and filter criteria."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.listContainer, themeStyles.themedbackground0]}>
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
            <View style={[styles.listFooter, themeStyles.themedbackground0]}>
              {isLoading || isFetching || hasNextPage || cardCount == null ? (
                <ActivityIndicator color={theme.tintSubdued} />
              ) : (
                <Text
                  style={[
                    styles.listFooterText,
                    themeStyles.themedColorSubdued,
                  ]}
                >
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
