import { Button } from '@components/Button';

type ChipProps = {
  label: string;
  isActive: boolean;
  onPress: () => void;
};

export function Chip({ label, isActive, onPress: handlePress }: ChipProps) {
  return (
    <Button
      size="small"
      variant={isActive ? 'bold' : undefined}
      onPress={() => handlePress()}
    >
      {label}
    </Button>
  );
}
