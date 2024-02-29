import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@hooks/useTheme';

export type ButtonProps = {
  size?: 'small';
  variant?: 'bold';
  onPress?: () => void;
  onLongPress?: () => void;
};

export function Button({
  size,
  variant,
  onPress: handlePress,
  onLongPress: handleLongPress,
  children,
}: PropsWithChildren<ButtonProps>) {
  const { themeStyles } = useTheme();

  return (
    <Pressable
      style={styles.container}
      onPress={() => handlePress && handlePress()}
      onLongPress={() => handleLongPress && handleLongPress()}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.inner,
            themeStyles.themedButtonContainer,
            themeStyles.themedButtonBorder,
            size === 'small' ? styles.inner__small : undefined,
            variant === 'bold'
              ? themeStyles.themedButtonContainerBold
              : undefined,
            variant === 'bold' ? themeStyles.themedButtonBorderBold : undefined,
            pressed ? styles.innerPressed : undefined,
          ]}
        >
          <Text
            style={[
              styles.innerText,
              themeStyles.themedButtonText,
              size === 'small' ? styles.innerText__small : undefined,
              variant === 'bold' ? themeStyles.themedButtonTextBold : undefined,
            ]}
          >
            {children}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {},
  inner: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  inner__small: {
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  innerPressed: {
    opacity: 0.5,
  },
  innerText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  innerText__small: {
    fontSize: 14,
  },
});
