import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { getSortedAspects } from 'src/utils/CardUtils';

import { ASPECT_IMAGES } from '@components/CardAspectImage';
import type { CardAttributes } from '@data/Card';

export type CardListAspectsProps = {
  card: CardAttributes;
};

export function CardListAspects({ card }: CardListAspectsProps) {
  const aspects = getSortedAspects(card);

  return (
    <View style={styles.container}>
      {aspects.map((aspect, i) => (
        <Image
          style={[styles.image]}
          source={ASPECT_IMAGES[aspect]}
          contentFit="cover"
          key={`card-list-aspect-${aspect}-${i}`}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
  },
  image: {
    height: 20,
    width: 20,
  },
});
