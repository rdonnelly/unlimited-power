import { Image } from 'expo-image';
import { StyleSheet, useWindowDimensions } from 'react-native';

import type { Art } from '@data/CardArt';

export type CardDetailImageProps = {
  art?: Art;
};

// TODO: blurhash based on color/orientation?
const blurhash = 'TBC74;of00~VaeIp00WB-:00kC_3';

export function CardDetailImage({ art }: CardDetailImageProps) {
  const { width: windowWidth } = useWindowDimensions();

  if (!art?.data?.attributes) {
    return null;
  }

  const imageFrameWidth = windowWidth - 32;
  const imageHeight = art.data.attributes.height;
  const imageWidth = art.data.attributes.width;
  const imageFrameHeight = (imageFrameWidth / imageWidth) * imageHeight;

  return (
    <Image
      style={[
        styles.image,
        { height: imageFrameHeight, width: imageFrameWidth },
      ]}
      source={`${art.data?.attributes.url}`}
      placeholder={blurhash}
      contentFit="cover"
      transition={200}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    backgroundColor: '#000',
  },
});
