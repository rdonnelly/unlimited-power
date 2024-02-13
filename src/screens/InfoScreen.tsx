import { A } from '@expo/html-elements';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@hooks/useTheme';
import type { InfoScreenProps } from '@navigation/types';

export function InfoScreen({ navigation }: InfoScreenProps) {
  const { themeStyles } = useTheme();

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.disclaimer}>
          <Text style={[styles.disclaimerText, themeStyles.themedColor]}>
            The information presented in this app about Star Wars Unlimited,
            both literal and graphical, is copyrighted by Fantasy Flight Games.
            This app is not produced by, endorsed by, supported by, or
            affiliated with Fantasy Flight Games.
          </Text>
        </View>

        <A href="https://rdonnelly.com" style={styles.credit}>
          <>
            <Text style={[styles.creditText, themeStyles.themedColor]}>{`
Designed and Developed by
Ryan Donnelly
            `}</Text>
          </>
        </A>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingTop: 16,
  },
  disclaimer: {
    padding: 16,
    paddingBottom: 32,
  },
  disclaimerText: {
    textAlign: 'justify',
  },
  credit: {
    padding: 16,
    paddingBottom: 32,
  },
  creditText: {
    textAlign: 'center',
  },
});
