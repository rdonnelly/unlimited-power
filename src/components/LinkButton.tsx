import Ionicons from '@expo/vector-icons/Ionicons';
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

export function LinkButton({
  size,
  variant,
  onPress: handlePress,
  onLongPress: handleLongPress,
  children,
}: PropsWithChildren<ButtonProps>) {
  const { theme, themeStyles } = useTheme();

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

          <Ionicons
            name="exit-outline"
            size={16}
            color={variant === 'bold' ? theme.buttonTintBold : theme.buttonTint}
          />
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inner: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
    lineHeight: 20,
  },
});
