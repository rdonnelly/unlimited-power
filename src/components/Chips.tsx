import { StyleSheet, View } from 'react-native';

import { Chip } from '@components/Chip';

type ChipsProps = {
  options: { key: string; label: string }[];
  selectedOption: string;
  onChange: (option: string) => void;
};

export function Chips({
  options,
  selectedOption,
  onChange: handleChange,
}: ChipsProps) {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <Chip
          label={option.label}
          isActive={option.key === selectedOption}
          onPress={() => {
            if (option.key !== selectedOption) {
              handleChange(option.key);
            }
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
