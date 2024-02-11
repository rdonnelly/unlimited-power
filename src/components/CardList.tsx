import { FlashList } from '@shopify/flash-list';
import { StyleSheet, View } from 'react-native';

import { type CardResponseData } from '@data/CardResponse';

import { CardListItem, ITEM_HEIGHT } from './CardListItem';

export type CardListProps = {
  cards: CardResponseData;
};

export const CardList = ({ cards }: CardListProps) => {
  return (
    <View style={styles.container}>
      <FlashList
        data={cards}
        renderItem={({ item: card }) => <CardListItem card={card} />}
        estimatedItemSize={ITEM_HEIGHT}
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
