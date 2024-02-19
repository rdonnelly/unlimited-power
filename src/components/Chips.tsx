import { StyleSheet, View } from 'react-native';

import { Chip } from '@components/Chip';

type ChipsProps<T> = {
  options: { key: T; label: string }[];
  selectedOptions: T[];
  onChange: (option: T, isSelected: boolean) => void;
};

export function Chips<T extends string>({
  options,
  selectedOptions,
  onChange: handleChange,
}: ChipsProps<T>) {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <Chip
          label={option.label}
          isActive={selectedOptions.includes(option.key)}
          onPress={() => {
            handleChange(option.key, selectedOptions.includes(option.key));
          }}
          key={`chip-${option.key}`}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    width: '100%',
  },
});
