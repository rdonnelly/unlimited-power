import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import * as Sharing from 'expo-sharing';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import type { Art } from '@data/CardArt';

export type CardDetailImageProps = {
  art?: Art;
  height: number;
  width: number;
};

// TODO: blurhash based on color/orientation?
const blurhash = 'TBC74;of00~VaeIp00WB-:00kC_3';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      await Sharing.shareAsync(localUrl);
    }
  }, [imageUrl]);

  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withTiming(1.1, { duration: 1000, easing: Easing.circle });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1);
  };

  if (!imageUrl) {
    return null;
  }

  return (
    <AnimatedPressable
      onLongPress={() => sharingIsAvailable && handleLongPress()}
      delayLongPress={400}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ transform: [{ scale }] }}
    >
      <Image
        style={[styles.image, { height, width }]}
        source={`${imageUrl}`}
        placeholder={blurhash}
        contentFit="contain"
      />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#000000',
    borderRadius: 16,
  },
});
