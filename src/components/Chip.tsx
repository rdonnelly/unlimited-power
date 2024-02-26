import { Button } from '@components/Button';

type ChipProps<T> = {
  label: string;
  value: T;
  isSelected: boolean;
  onPress: (value: T, isSelected: boolean) => void;
};

export function Chip<T>({
  label,
  value,
  isSelected,
  onPress: handlePress,
}: ChipProps<T>) {
  return (
    <Button
      size="small"
      variant={isSelected ? 'bold' : undefined}
      onPress={() => handlePress(value, isSelected)}
    >
      {label}
    </Button>
  );
}
