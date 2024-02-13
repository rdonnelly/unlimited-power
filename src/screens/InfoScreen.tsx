import { A } from '@expo/html-elements';
import * as Application from 'expo-application';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@hooks/useTheme';
import type { InfoScreenProps } from '@navigation/types';

export function InfoScreen({ navigation }: InfoScreenProps) {
  const { themeStyles } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.disclaimer}>
        <Text style={[styles.disclaimerText, themeStyles.themedColor]}>
          The information presented in this app about Star Wars Unlimited, both
          literal and graphical, is copyrighted by Fantasy Flight Games. This
          app is not produced by, endorsed by, supported by, or affiliated with
          Fantasy Flight Games.
        </Text>
      </View>

      <View style={styles.version}>
        <Text style={[styles.versionText, themeStyles.themedColor]}>
          {Application.applicationName} {Application.nativeApplicationVersion} (
          {Application.nativeBuildVersion})
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
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingTop: 16,
  },
  disclaimer: {
    flex: 1,
    padding: 16,
    paddingBottom: 32,
  },
  disclaimerText: {
    textAlign: 'justify',
  },
  version: {
    padding: 16,
    paddingBottom: 32,
  },
  versionText: {
    fontWeight: '600',
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
