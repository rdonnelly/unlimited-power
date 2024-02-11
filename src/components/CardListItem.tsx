import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Card } from '@data/Card';

export type CardListItemProps = {
  card: Card;
  handlePress: (id: number) => void;
};

export const ITEM_HEIGHT = 64;

export const CardListItem = ({ card, handlePress }: CardListItemProps) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => handlePress(card.id)} style={styles.pressable}>
        {({ pressed }) => (
          <View style={styles.inner}>
            <Text>
              {card.attributes.cardNumber}: {card.attributes.title}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderBottomColor: '#000000',
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: ITEM_HEIGHT,
    width: '100%',
  },
  pressable: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'center',
  },
  inner: {
    paddingHorizontal: 16,
  },
});
