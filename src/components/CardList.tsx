import { FlashList } from '@shopify/flash-list';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { CardListItem, ITEM_HEIGHT } from '@components/CardListItem';
import { type CardsResponseData } from '@data/CardsResponse';
import { useTheme } from '@hooks/useTheme';
import { DARK_THEME, LIGHT_THEME } from '@styles/theme';

export type CardListProps = {
  cards: CardsResponseData;
  cardCount?: number;
  showLoading: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  onPressItem: (
    id: number,
    index: number,
    title: string,
    caption?: string,
  ) => void;
};

export const CardList = ({
  cards,
  cardCount,
  showLoading,
  hasNextPage,
  fetchNextPage,
  onPressItem: handlePressItem,
}: CardListProps) => {
  const { theme, themeStyles } = useTheme();

  const loadNextPage = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View style={[styles.container, themeStyles.themedbackground0]}>
      <FlashList
        data={cards}
        renderItem={({ item: card, index }) => (
          <CardListItem card={card} index={index} onPress={handlePressItem} />
        )}
        estimatedItemSize={ITEM_HEIGHT}
        onEndReached={loadNextPage}
        onEndReachedThreshold={1.5}
        ListFooterComponent={
          <View style={[styles.listFooter, themeStyles.themedbackground100]}>
            {showLoading || cardCount == null ? (
              <ActivityIndicator
                color={
                  theme.scheme === 'light'
                    ? LIGHT_THEME.tintSubdued
                    : DARK_THEME.tintSubdued
                }
              />
            ) : (
              <Text style={styles.listFooterText}>{cardCount} Cards Found</Text>
            )}
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  listFooter: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  listFooterText: {
    fontWeight: '700',
  },
});
