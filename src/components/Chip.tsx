import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@components/PressableScale';
import { useTheme } from '@hooks/useTheme';

type ChipProps<T> = {
  label: string;
  value: T;
  isSelected: boolean;
  onPress: (value: T, isSelected: boolean) => void;
  onLongPress: (value: T, isSelected: boolean) => void;
};

export function Chip<T>({
  label,
  value,
  isSelected,
  onPress: handlePress,
  onLongPress: handleLongPress,
}: ChipProps<T>) {
  const { theme, themeStyles } = useTheme();

  return (
    <PressableScale
      style={styles.container}
      onPress={() => {
        Haptics.selectionAsync();
        handlePress && handlePress(value, isSelected);
      }}
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        handleLongPress && handleLongPress(value, isSelected);
      }}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.inner,
            isSelected ? styles.innerSelected : undefined,
            themeStyles.chipContainer,
            themeStyles.chipBorder,
            isSelected ? themeStyles.chipSelectedContainer : undefined,
            isSelected ? themeStyles.chipSelectedBorder : undefined,
            pressed ? styles.innerPressed : undefined,
          ]}
        >
          {isSelected ? (
            <FontAwesome6
              name="check-circle"
              size={12}
              color={isSelected ? theme.chipSelectedTint : theme.chipTint}
            />
          ) : null}
          <Text
            style={[
              styles.innerText,
              themeStyles.chipText,
              isSelected ? themeStyles.chipSelectedText : undefined,
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: {},
  inner: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 26,
    paddingVertical: 10,
  },
  innerPressed: {
    opacity: 0.5,
  },
  innerSelected: {
    paddingHorizontal: 16,
  },
  innerText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    textAlign: 'center',
  },
});
