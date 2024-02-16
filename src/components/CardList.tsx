import { FlashList } from '@shopify/flash-list';
import { StyleSheet, View } from 'react-native';

import { type CardsResponseData } from '@data/CardsResponse';
import { useTheme } from '@hooks/useTheme';

import { CardListItem, ITEM_HEIGHT } from './CardListItem';

export type CardListProps = {
  cards: CardsResponseData;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  handlePressItem: (id: number, title: string, caption?: string) => void;
};

export const CardList = ({
  cards,
  hasNextPage,
  fetchNextPage,
  handlePressItem,
}: CardListProps) => {
  const { themeStyles } = useTheme();

  const loadNext = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View style={[styles.container, themeStyles.themedbackground0]}>
      <FlashList
        data={cards}
        renderItem={({ item: card }) => (
          <CardListItem card={card} handlePress={handlePressItem} />
        )}
        estimatedItemSize={ITEM_HEIGHT}
        onEndReached={loadNext}
        onEndReachedThreshold={1.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});
