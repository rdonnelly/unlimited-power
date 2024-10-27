import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import * as Sharing from 'expo-sharing';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  clamp,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
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

  const reducedMotion = useReducedMotion();

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
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const longPressGesture = Gesture.LongPress()
    .onBegin(() => {
      scale.value = withTiming(1.1, {
        duration: 800,
        easing: Easing.bezier(0.31, 0.04, 0.03, 1.04),
      });
    })
    .onStart(() => {
      if (sharingIsAvailable) {
        runOnJS(handleLongPress)();
      }
    })
    .onFinalize(() => {
      scale.value = withTiming(1, {
        duration: 250,
        easing: Easing.bezier(0.82, 0.06, 0.42, 1.01),
      });
    });

  const pinchGesture = Gesture.Pinch()
    .onStart((event) => {
      focalX.value = event.focalX;
      focalY.value = event.focalY;
    })
    .onUpdate((event) => {
      scale.value = clamp(event.scale, 1, 4);

      // adjust the focal point, but move it slower
      focalX.value =
        focalX.value + (1 / (scale.value * 2)) * (event.focalX - focalX.value);
      focalY.value =
        focalY.value + (1 / (scale.value * 2)) * (event.focalY - focalY.value);
    })
    .onEnd(() => {
      scale.value = 1;
      focalX.value = 0;
      focalY.value = 0;
    });

  const composedGesture = Gesture.Race(pinchGesture, longPressGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    zIndex: scale.value > 1 ? 1 : 0,
  }));

  if (!imageUrl) {
    return null;
  }

  return (
    <GestureDetector gesture={composedGesture}>
      <AnimatedPressable style={[!reducedMotion && animatedStyle]}>
        <Image
          style={[styles.image, { height, width }]}
          source={`${imageUrl}`}
          placeholder={blurhash}
          contentFit="contain"
        />
      </AnimatedPressable>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#000000',
    borderRadius: 16,
  },
});
