import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@components/PressableScale';
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
    <PressableScale
      style={styles.container}
      onPress={() => handlePress && handlePress()}
      onLongPress={() => handleLongPress && handleLongPress()}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.inner,
            themeStyles.buttonContainer,
            themeStyles.buttonBorder,
            size === 'small' ? styles.inner__small : undefined,
            variant === 'bold' ? themeStyles.buttonContainerBold : undefined,
            variant === 'bold' ? themeStyles.buttonBorderBold : undefined,
            pressed ? styles.innerPressed : undefined,
          ]}
        >
          <Text
            style={[
              styles.innerText,
              themeStyles.buttonText,
              size === 'small' ? styles.innerText__small : undefined,
              variant === 'bold' ? themeStyles.buttonTextBold : undefined,
            ]}
          >
            {children}
          </Text>
        </View>
      )}
    </PressableScale>
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
    paddingVertical: 10,
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
    lineHeight: 20,
  },
});
