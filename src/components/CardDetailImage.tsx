import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import type { Art } from '@data/CardArt';

export type CardDetailImageProps = {
  art?: Art;
  height: number;
  width: number;
};

// TODO: blurhash based on color/orientation?
const blurhash = 'TBC74;of00~VaeIp00WB-:00kC_3';

export function CardDetailImage({ art, height, width }: CardDetailImageProps) {
  if (!art?.data?.attributes) {
    return null;
  }

  return (
    <Image
      style={[styles.image, { height, width }]}
      source={`${art.data?.attributes.url}`}
      placeholder={blurhash}
      contentFit="contain"
      transition={200}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#000000',
    borderRadius: 16,
  },
});
