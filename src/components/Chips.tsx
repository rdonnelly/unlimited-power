import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Chip } from '@components/Chip';
import { useTheme } from '@hooks/useTheme';

type ChipsProps<T> = {
  heading: string;
  options: { value: T; label: string }[];
  selections: T[];
  onChange: (options: T[]) => void;
  single?: boolean;
};

export function Chips<T>({
  heading,
  options,
  selections,
  onChange: handleChange,
  single,
}: ChipsProps<T>) {
  const { themeStyles } = useTheme();

  const [selectedOptions, setSelectedOptions] = useState(selections);

  const handleChangeDebounced = useMemo(
    () =>
      debounce((newOptions) => {
        handleChange(newOptions);
      }, 2000),
    [handleChange],
  );

  const handlePressChip = useCallback(
    (option: T, isSelected: boolean) => {
      setSelectedOptions((state) => {
        if (isSelected) {
          if (single) {
            return state;
          }

          return [...state].filter((a) => {
            return a !== option;
          });
        }

        if (single) {
          return [option];
        }

        return [...state, option].filter((a, i, self) => {
          return self.indexOf(a) === i;
        });
      });
    },
    [single],
  );

  useEffect(() => {
    handleChangeDebounced(selectedOptions);
  }, [selectedOptions, handleChangeDebounced]);

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={[styles.headingText, themeStyles.themedColor]}>
          {heading}
        </Text>
      </View>
      <View style={styles.chipsContainer}>
        {options.map((option) => (
          <Chip
            label={option.label}
            value={option.value}
            isSelected={selectedOptions.includes(option.value)}
            onPress={handlePressChip}
            key={`chip-${option.value}`}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  heading: {
    marginBottom: 8,
  },
  headingText: {
    fontSize: 20,
    fontWeight: '700',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    width: '100%',
  },
});
