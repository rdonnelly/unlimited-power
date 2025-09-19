import React from 'react';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import { Pressable } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const DEFAULT_TARGET_SCALE = 0.95;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PressableScale({
  targetScale = DEFAULT_TARGET_SCALE,
  children,
  style,
  onPressIn,
  onPressOut,
  ...rest
}: {
  targetScale?: number;
  style?: StyleProp<ViewStyle>;
} & Exclude<PressableProps, 'onPressIn' | 'onPressOut' | 'style'>) {
  const reducedMotion = useReducedMotion();

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      onPressIn={(e) => {
        if (onPressIn) {
          scheduleOnRN(onPressIn, e);
        }
        cancelAnimation(scale);
        scale.value = withTiming(targetScale, { duration: 100 });
      }}
      onPressOut={(e) => {
        if (onPressOut) {
          scheduleOnRN(onPressOut, e);
        }
        cancelAnimation(scale);
        scale.value = withTiming(1, { duration: 100 });
      }}
      style={[!reducedMotion && animatedStyle, style]}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}
