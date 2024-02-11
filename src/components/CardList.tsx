import { FlashList } from '@shopify/flash-list';
import { StyleSheet, View } from 'react-native';

import { type CardResponseData } from '@data/CardResponse';

import { CardListItem, ITEM_HEIGHT } from './CardListItem';

export type CardListProps = {
  cards: CardResponseData;
  hasNextPage: boolean;
  fetchNextPage: () => void;
};

export const CardList = ({
  cards,
  hasNextPage,
  fetchNextPage,
}: CardListProps) => {
  const loadNext = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View style={styles.container}>
      <FlashList
        data={cards}
        renderItem={({ item: card }) => <CardListItem card={card} />}
        estimatedItemSize={ITEM_HEIGHT}
        onEndReached={loadNext}
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
