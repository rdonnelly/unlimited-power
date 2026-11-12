import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@components/Button';
import { useTheme } from '@hooks/useTheme';

export function QueryNotice({
  message,
  onRetry,
  busy = false,
}: {
  message: string;
  onRetry: () => void;
  busy?: boolean;
}) {
  const { themeStyles } = useTheme();
  return (
    <View style={[styles.container, themeStyles.background200]}>
      <Text
        accessibilityLiveRegion="polite"
        style={[styles.text, themeStyles.color]}
      >
        {message}
      </Text>
      <Button size="small" disabled={busy} onPress={onRetry}>
        Retry
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    width: '100%',
  },
  text: { flex: 1 },
});
