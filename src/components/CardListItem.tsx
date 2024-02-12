import Ionicons from '@expo/vector-icons/Ionicons';
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
            <Ionicons name="chevron-forward" size={24} color="#000000" />
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
    borderTopColor: '#ffffff',
    borderTopWidth: StyleSheet.hairlineWidth,
    height: ITEM_HEIGHT,
    width: '100%',
  },
  pressable: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'center',
  },
  inner: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: '100%',
  },
});
