import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@components/Button';
import { useTheme } from '@hooks/useTheme';

type ErrorProps = {
  heading?: string;
  message?: string;
  labelPrimary: string;
  onPrimary: () => void;
  labelSecondary?: string;
  onSecondary?: () => void;
};

export function Error({
  heading,
  message,
  labelPrimary,
  onPrimary: handlePrimary,
  labelSecondary,
  onSecondary: handleSecondary,
}: ErrorProps) {
  const { themeStyles } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.error}>
        <View style={styles.errorInfo}>
          <Text style={[styles.errorInfoHeading, themeStyles.colorSubdued]}>
            {heading ?? 'Bantha Poodoo!'}
          </Text>
          <Text style={[styles.errorInfoText, themeStyles.colorSubdued]}>
            {message ?? 'An unknown error occured while fetching card data.'}
          </Text>
        </View>

        <View style={styles.errorControls}>
          <Button variant="bold" onPress={handlePrimary}>
            {labelPrimary}
          </Button>

          {labelSecondary && handleSecondary ? (
            <Button onPress={handleSecondary}>{labelSecondary}</Button>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
  },
  error: {
    maxWidth: 240,
    paddingTop: 96,
  },
  errorInfo: {
    marginBottom: 32,
  },
  errorInfoHeading: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorInfoText: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorControls: {
    gap: 16,
  },
});
