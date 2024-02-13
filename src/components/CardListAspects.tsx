import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { getSortedAspects } from 'src/utils/CardUtils';

import type { CardAttributes } from '@data/Card';

import { ASPECT_IMAGES } from './CardAspectImage';

export type CardListAspectsProps = {
  card: CardAttributes;
};

export function CardListAspects({ card }: CardListAspectsProps) {
  const aspects = getSortedAspects(card);

  return (
    <>
      {aspects.map((aspect, i) => (
        <Image
          style={[styles.image]}
          source={ASPECT_IMAGES[aspect]}
          contentFit="cover"
          transition={200}
          key={`card-list-aspect-${aspect}-${i}`}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 24,
    width: 24,
  },
});
