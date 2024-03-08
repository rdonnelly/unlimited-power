import * as Application from 'expo-application';
import * as Linking from 'expo-linking';
import { useCallback } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LinkButton } from '@components/LinkButton';
import { useTheme } from '@hooks/useTheme';
import type { InfoScreenProps } from '@navigation/types';

export function InfoScreen({ navigation }: InfoScreenProps) {
  const { themeStyles } = useTheme();
  const insets = useSafeAreaInsets();

  const openUrl = useCallback((url: string) => {
    try {
      Linking.openURL(url);
    } catch {
      Alert.alert('Karabast!', 'The URL could not be opened, sorry!', [
        { text: 'OK' },
      ]);
    }
  }, []);

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(32, insets.bottom) }]}
    >
      <View style={styles.disclaimer}>
        <Text style={[styles.disclaimerText, themeStyles.color]}>
          The information presented in this app about Star Wars Unlimited, both
          literal and graphical, is copyrighted by Fantasy Flight Games. This
          app is not produced by, endorsed by, supported by, or affiliated with
          Fantasy Flight Games.
        </Text>
      </View>

      <View style={styles.links}>
        <LinkButton
          size="small"
          onPress={() => openUrl('https://starwarsunlimited.com/')}
        >
          Star Wars: Unlimited Website
        </LinkButton>
        <LinkButton
          size="small"
          onPress={() =>
            openUrl('https://starwarsunlimited.com/how-to-play?chapter=rules')
          }
        >
          Rules and How to Play
        </LinkButton>
        <LinkButton
          size="small"
          onPress={() => openUrl('https://starwarsunlimited.com/cards')}
        >
          Official Card Database
        </LinkButton>
        <LinkButton size="small" onPress={() => openUrl('https://swudb.com/')}>
          SWUDB.com
        </LinkButton>
        <LinkButton
          size="small"
          onPress={() => openUrl('https://sw-unlimited-db.com')}
        >
          SW-Unlimited-db.com
        </LinkButton>
        <LinkButton
          size="small"
          onPress={() => openUrl('https://rdonnelly.com/unlimited-power')}
        >
          Unlimited Power Website
        </LinkButton>
      </View>

      <View style={styles.version}>
        <Text style={[styles.versionText, themeStyles.color]}>
          {Application.applicationName} {Application.nativeApplicationVersion} (
          {Application.nativeBuildVersion})
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 32,
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  disclaimer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  disclaimerText: {
    textAlign: 'justify',
  },
  links: {
    gap: 16,
    paddingHorizontal: 16,
    width: '100%',
  },
  version: {
    paddingHorizontal: 16,
  },
  versionText: {
    fontWeight: '600',
    textAlign: 'justify',
  },
  credit: {
    paddingHorizontal: 16,
  },
  creditText: {
    textAlign: 'center',
  },
});
