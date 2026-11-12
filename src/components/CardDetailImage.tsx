import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import * as Sharing from 'expo-sharing';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Text, Alert, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  clamp,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Button } from '@components/Button';
import { shareCardImage } from '@data/shareCardImage';
import type { Art } from '@data/CardArt';
import { useTheme } from '@hooks/useTheme';

export type CardDetailImageProps = {
  art?: Art;
  height: number;
  width: number;
  accessibilityLabel?: string;
};

// TODO: blurhash based on color/orientation?
const blurhash = 'TBC74;of00~VaeIp00WB-:00kC_3';

export function CardDetailImage({
  art,
  height,
  width,
  accessibilityLabel = 'Card image',
}: CardDetailImageProps) {
  const imageUrl = art?.data?.attributes.url;

  const { themeStyles } = useTheme();
  const imageRef = useRef<Image>(null);
  const [failed, setFailed] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const sharing = useRef(false);

  const reducedMotion = useReducedMotion();

  const [sharingIsAvailable, setSharingIsAvailable] = useState(false);

  useEffect(() => {
    const checkSharing = async () => {
      const isAvailable = await Sharing.isAvailableAsync();
      setSharingIsAvailable(isAvailable);
    };

    void checkSharing().catch(console.warn);
  }, []);

  const handleLongPress = useCallback(async () => {
    if (!imageUrl || !sharingIsAvailable || sharing.current) return;
    sharing.current = true;
    setIsSharing(true);
    void Haptics.selectionAsync().catch(console.warn);
    try {
      await shareCardImage(imageUrl);
    } catch (error) {
      console.warn(error);
      const reason = error instanceof Error ? error.message : String(error);
      Alert.alert(
        'Unable to share',
        `The image could not be shared.\n\n${reason}`,
      );
    } finally {
      sharing.current = false;
      setIsSharing(false);
    }
  }, [imageUrl, sharingIsAvailable]);

  const scale = useSharedValue(1);
  const pressScale = useSharedValue(1);
  const isZooming = useSharedValue(false);
  const focal = useSharedValue({ x: width / 2, y: height / 2 });
  const offset = useSharedValue({ x: 0, y: 0 });

  const longPressGesture = Gesture.LongPress()
    .enabled(sharingIsAvailable && !isSharing)
    .runOnJS(true)
    .onBegin(() => {
      pressScale.value = withTiming(1.05, {
        duration: 800,
        easing: Easing.bezier(0.31, 0.04, 0.03, 1.04),
      });
    })
    .onStart(() => {
      void handleLongPress();
    })
    .onFinalize(() => {
      pressScale.value = withTiming(1, {
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
      if (!isNaN(e.focalX) && !isNaN(e.focalY)) {
        focal.value = {
          x: e.focalX,
          y: e.focalY,
        };
      }
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
      { scale: pressScale.value },
    ],
    zIndex: scale.value !== 1 || pressScale.value !== 1 ? 1 : 0,
  }));

  return (
    <View style={{ gap: 12, alignItems: 'center' }}>
      <View
        style={[styles.container, themeStyles.background300, { height, width }]}
      >
        {imageUrl ? (
          <GestureDetector gesture={composedGesture}>
            <Animated.View
              collapsable={false}
              style={[!reducedMotion && animatedStyle]}
              accessible
              accessibilityRole="image"
              accessibilityLabel={accessibilityLabel}
              accessibilityHint={
                sharingIsAvailable
                  ? 'Touch and hold to share, or use the Share image action. Pinch to zoom.'
                  : 'Pinch to zoom.'
              }
              accessibilityState={{ busy: isSharing }}
              accessibilityActions={
                sharingIsAvailable
                  ? [{ name: 'share', label: 'Share image' }]
                  : []
              }
              onAccessibilityAction={(event) => {
                if (event.nativeEvent.actionName === 'share')
                  void handleLongPress();
              }}
            >
              <Image
                ref={imageRef}
                accessible={false}
                style={[styles.image, { height, width }]}
                source={imageUrl}
                cachePolicy="disk"
                placeholder={{ blurhash }}
                contentFit="contain"
                onError={() => setFailed(true)}
                onLoad={() => setFailed(false)}
              />
            </Animated.View>
          </GestureDetector>
        ) : (
          <Text style={themeStyles.color}>No image available.</Text>
        )}
        {failed ? (
          <View style={[styles.error, themeStyles.background300]}>
            <Text style={themeStyles.color}>
              Image unavailable. Connect to load it.
            </Text>
            <Button
              size="small"
              onPress={() => {
                void imageRef.current?.reloadAsync().catch(console.warn);
              }}
            >
              Retry image
            </Button>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    justifyContent: 'center',
  },
  error: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 16,
  },
  image: {
    borderRadius: 16,
  },
});
