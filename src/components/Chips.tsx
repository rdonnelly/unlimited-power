import debounce from 'lodash/debounce';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Chip } from '@components/Chip';
import { useTheme } from '@hooks/useTheme';

type ChipsProps<T> = {
  heading: string;
  options: { value: T; label: string }[];
  selections: T[];
  onChange: (options: T[]) => void;
  single?: boolean;
  delay?: number;
};

export function Chips<T>({
  heading,
  options,
  selections,
  onChange: handleChange,
  single = false,
  delay = 0,
}: ChipsProps<T>) {
  const { themeStyles } = useTheme();

  const selectedOptionsRef = useRef(selections);
  const [selectedOptions, setSelectedOptions] = useState(selections);

  const handleChangeDebounced = useMemo(
    () =>
      debounce(() => {
        handleChange(selectedOptionsRef.current);
      }, delay),
    [handleChange, delay],
  );

  const handlePressChip = useCallback(
    (option: T, isSelected: boolean) => {
      if (isSelected) {
        if (!single) {
          selectedOptionsRef.current = [...selectedOptionsRef.current].filter(
            (a) => {
              return a !== option;
            },
          );
        }
      } else {
        if (single) {
          selectedOptionsRef.current = [option];
        }

        selectedOptionsRef.current = [
          ...selectedOptionsRef.current,
          option,
        ].filter((a, i, self) => {
          return self.indexOf(a) === i;
        });
      }

      setSelectedOptions(selectedOptionsRef.current);
      handleChangeDebounced();
    },
    [single, handleChangeDebounced],
  );

  const handleLongPressChip = useCallback(
    (option: T) => {
      selectedOptionsRef.current = [option];

      setSelectedOptions(selectedOptionsRef.current);
      handleChangeDebounced();
    },
    [handleChangeDebounced],
  );

  const handlePressAll = () => {
    selectedOptionsRef.current = [...options.map((option) => option.value)];

    setSelectedOptions(selectedOptionsRef.current);
    handleChangeDebounced();
  };

  const handlePressNone = () => {
    selectedOptionsRef.current = [];

    setSelectedOptions(selectedOptionsRef.current);
    handleChangeDebounced();
  };

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={[styles.headingText, themeStyles.color]}>{heading}</Text>
        <View style={styles.headingControls}>
          <Pressable onPress={() => handlePressAll && handlePressAll()}>
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
          </Pressable>
          <Pressable onPress={() => handlePressNone && handlePressNone()}>
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
          </Pressable>
        </View>
      </View>
      <View style={styles.chipsContainer}>
        {options.map((option) => (
          <Chip
            label={option.label}
            value={option.value}
            isSelected={selectedOptions.includes(option.value)}
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
