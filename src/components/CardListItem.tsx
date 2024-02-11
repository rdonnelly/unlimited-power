import { StyleSheet, Text, View } from 'react-native';

import type { Card } from '@data/Card';

export type CardListItemProps = {
  card: Card;
};

export const ITEM_HEIGHT = 64;

export const CardListItem = ({ card }: CardListItemProps) => {
  return (
    <View style={styles.container}>
      <Text>
        {card.id}: {card.attributes.title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#000000',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    height: ITEM_HEIGHT,
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    width: '100%',
  },
});
