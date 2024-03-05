import * as Linking from 'expo-linking';
import { memo, useCallback } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { LinkButton } from '@components/LinkButton';
import type { CardAttributes } from '@data/Card';

type CardDetailLinksProps = {
  cardAttributes: CardAttributes;
};

function CardDetailLinks({ cardAttributes }: CardDetailLinksProps) {
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
    <View style={styles.container}>
      <LinkButton
        size="small"
        onPress={() =>
          openUrl(
            `https://starwarsunlimited.com/cards?cid=${cardAttributes.cardUid}`,
          )
        }
      >
        Open on Official Card Database
      </LinkButton>
      <LinkButton
        size="small"
        onPress={() =>
          openUrl(
            `https://swudb.com/card/${cardAttributes.expansion.data?.attributes.code}/${String(cardAttributes.cardNumber).padStart(3, '0')}/`,
          )
        }
      >
        Open on SWUDB.com
      </LinkButton>
      <LinkButton
        size="small"
        onPress={() =>
          openUrl(
            `https://sw-unlimited-db.com/cards/${cardAttributes.expansion.data?.attributes.code.toLowerCase()}/${[cardAttributes.title.toLowerCase().replaceAll(' ', '-'), ...(cardAttributes.subtitle ? [cardAttributes.subtitle.toLowerCase().replaceAll(' ', '-')] : [])].join('-')}`,
          )
        }
      >
        Open on SW-Unlimited-db.com
      </LinkButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingHorizontal: 16,
    width: '100%',
  },
});

const memoCardDetailLinks = memo<CardDetailLinksProps>(CardDetailLinks);
export { memoCardDetailLinks as CardDetailLinks };
