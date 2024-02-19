import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import * as Sharing from 'expo-sharing';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import type { Art } from '@data/CardArt';

export type CardDetailImageProps = {
  art?: Art;
  height: number;
  width: number;
};

// TODO: blurhash based on color/orientation?
const blurhash = 'TBC74;of00~VaeIp00WB-:00kC_3';

export function CardDetailImage({ art, height, width }: CardDetailImageProps) {
  const imageUrl = art?.data?.attributes.url;

  const [sharingIsAvailable, setSharingIsAvailable] = useState(false);

  useEffect(() => {
    const checkSharing = async () => {
      const isAvailable = await Sharing.isAvailableAsync();
      setSharingIsAvailable(isAvailable);
    };

    checkSharing();
  }, []);

  const handleLongPress = useCallback(async () => {
    if (imageUrl) {
      const directory = `${FileSystem.cacheDirectory}cards`;
      const filename = imageUrl.split('/').pop();
      const downloadPath = `${directory}${filename}`;

      await FileSystem.makeDirectoryAsync(directory, {
        intermediates: true,
      });

      const { uri: localUrl } = await FileSystem.downloadAsync(
        imageUrl,
        downloadPath,
      );

      await Sharing.shareAsync(localUrl);
    }
  }, [imageUrl]);

  if (!imageUrl) {
    return null;
  }

  return (
    <Pressable onLongPress={() => sharingIsAvailable && handleLongPress()}>
      <Image
        style={[styles.image, { height, width }]}
        source={`${imageUrl}`}
        placeholder={blurhash}
        contentFit="contain"
        transition={200}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#000000',
    borderRadius: 16,
  },
});
