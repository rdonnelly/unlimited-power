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
  const isZooming = useSharedValue(false);
  const focal = useSharedValue({ x: 0, y: 0 });
  const offset = useSharedValue({ x: 0, y: 0 });

  const longPressGesture = Gesture.LongPress()
    .onBegin(() => {
      scale.value = withTiming(1.05, {
        duration: 800,
        easing: Easing.bezier(0.31, 0.04, 0.03, 1.04),
      });

      focal.value = { x: width / 2, y: height / 2 };
    })
    .onStart(() => {
      if (sharingIsAvailable) {
        runOnJS(handleLongPress)();
      }
    })
    .onFinalize(() => {
      scale.value = withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.exp),
      });
    });

  const panGesture = Gesture.Pan()
    .minPointers(2)
    .averageTouches(true)
    .onUpdate((e) => {
      if (isZooming.value) {
        offset.value = {
          x: e.translationX,
          y: e.translationY,
        };
      }
    });

  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      isZooming.value = true;
    })
    .onStart((e) => {
      focal.value = {
        x: e.focalX,
        y: e.focalY,
      };
    })
    .onUpdate((e) => {
      scale.value = clamp(e.scale, 0.5, 4);
    })
    .onEnd(() => {
      scale.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.exp),
      });

      offset.value = withTiming(
        {
          x: 0,
          y: 0,
        },
        {
          duration: 400,
          easing: Easing.out(Easing.exp),
        },
      );
    })
    .onFinalize(() => {
      isZooming.value = false;
    });

  const composedGesture = Gesture.Race(
    Gesture.Simultaneous(pinchGesture, panGesture),
    longPressGesture,
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      // drag
      { translateX: offset.value.x },
      { translateY: offset.value.y },

      // zoom
      { translateX: focal.value.x },
      { translateY: focal.value.y },
      { translateX: -width / 2 },
      { translateY: -height / 2 },
      { scale: scale.value },
      { translateX: -focal.value.x },
      { translateY: -focal.value.y },
      { translateX: width / 2 },
      { translateY: height / 2 },
    ],
    zIndex: scale.value !== 1 ? 1 : 0,
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <AnimatedPressable style={[!reducedMotion && animatedStyle]}>
        <Image
          style={[styles.image, { height, width }]}
          source={imageUrl}
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
