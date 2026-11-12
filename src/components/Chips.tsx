import { StyleSheet, Text, View } from 'react-native';

import { Chip } from '@components/Chip';
import { PressableScale } from '@components/PressableScale';
import { useTheme } from '@hooks/useTheme';

type ChipsProps<T> = {
  heading: string;
  showHeaderControls?: boolean;
  options: { value: T; label: string }[];
  selections: T[];
  onChange: (options: T[]) => void;
  single?: boolean;
};

export function Chips<T>({
  heading,
  showHeaderControls = false,
  options,
  selections,
  onChange: handleChange,
  single = false,
}: ChipsProps<T>) {
  const { themeStyles } = useTheme();

  const handlePressChip = (option: T, isSelected: boolean) => {
    if (single) {
      handleChange([option]);
    } else {
      handleChange(
        isSelected
          ? selections.filter((value) => value !== option)
          : [...selections, option],
      );
    }
  };

  const handleLongPressChip = (option: T) => handleChange([option]);
  const handlePressAll = () =>
    handleChange(options.map((option) => option.value));
  const handlePressNone = () => handleChange([]);

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={[styles.headingText, themeStyles.color]}>{heading}</Text>
        {showHeaderControls ? (
          <View style={styles.headingControls}>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel={`Select all ${heading.toLowerCase()}`}
              onPress={handlePressAll}
            >
              {({ pressed }) => (
                <View
                  style={[
                    styles.headingControl,
                    themeStyles.chipContainer,
                    themeStyles.chipBorder,
                    pressed ? styles.headingControlPressed : undefined,
                  ]}
                >
                  <Text style={[themeStyles.chipText]}>All</Text>
                </View>
              )}
            </PressableScale>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel={`Clear ${heading.toLowerCase()}`}
              onPress={handlePressNone}
            >
              {({ pressed }) => (
                <View
                  style={[
                    styles.headingControl,
                    themeStyles.chipContainer,
                    themeStyles.chipBorder,
                    pressed ? styles.headingControlPressed : undefined,
                  ]}
                >
                  <Text style={[themeStyles.chipText]}>None</Text>
                </View>
              )}
            </PressableScale>
          </View>
        ) : null}
      </View>
      <View style={styles.chipsContainer}>
        {options.map((option) => (
          <Chip
            label={option.label}
            value={option.value}
            isSelected={selections.includes(option.value)}
            onPress={handlePressChip}
            onLongPress={handleLongPressChip}
            key={`chip-${option.value}`}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  heading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  headingText: {
    fontSize: 20,
    fontWeight: '700',
  },
  headingControls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  headingControl: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  headingControlPressed: {
    opacity: 0.5,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    width: '100%',
  },
});
