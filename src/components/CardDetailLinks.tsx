import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { openURL } from 'src/utils/OpenURL';

import { LinkButton } from '@components/LinkButton';
import type { CardAttributes } from '@data/Card';

type CardDetailLinksProps = {
  cardAttributes: CardAttributes;
};

function CardDetailLinks({ cardAttributes }: CardDetailLinksProps) {
  return (
    <View style={styles.container}>
      <LinkButton
        size="small"
        onPress={() =>
          openURL(
            `https://starwarsunlimited.com/cards?cid=${cardAttributes.cardUid}`,
          )
        }
      >
        Open on Official Card Database
      </LinkButton>
      <LinkButton
        size="small"
        onPress={() =>
          openURL(
            `https://swudb.com/card/${cardAttributes.expansion.data?.attributes.code}/${String(cardAttributes.cardNumber).padStart(3, '0')}/`,
          )
        }
      >
        Open on SWUDB.com
      </LinkButton>
      <LinkButton
        size="small"
        onPress={() =>
          openURL(
            `https://swuforge.com/cards/${cardAttributes.expansion.data?.attributes.code}/${String(cardAttributes.cardNumber)}/`,
          )
        }
      >
        Open on SWU Forge
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
