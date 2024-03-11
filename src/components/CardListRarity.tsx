import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { RARITY_IMAGES } from '@components/CardRarityImage';
import type { CardAttributes } from '@data/Card';

export type CardListRarityProps = {
  cardAttibutes: CardAttributes;
};

export function CardListRarity({ cardAttibutes }: CardListRarityProps) {
  const rarity = cardAttibutes.rarity.data.attributes.name;

  if (!rarity) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image
        style={[styles.image]}
        source={RARITY_IMAGES[rarity]}
        contentFit="cover"
        key={`card-list-aspect-${rarity}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: -4,
  },
  image: {
    height: 14,
    width: 14,
  },
});
