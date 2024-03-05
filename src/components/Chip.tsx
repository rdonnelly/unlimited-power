import * as Haptics from 'expo-haptics';

import { Button } from '@components/Button';

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
  return (
    <Button
      size="small"
      variant={isSelected ? 'bold' : undefined}
      onPress={() => {
        Haptics.selectionAsync();
        handlePress(value, isSelected);
      }}
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        handleLongPress(value, isSelected);
      }}
    >
      {label}
    </Button>
  );
}
