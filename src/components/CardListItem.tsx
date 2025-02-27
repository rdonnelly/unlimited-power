import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CardListAspects } from '@components/CardListAspects';
import { CardListRarity } from '@components/CardListRarity';
import type { Card } from '@data/Card';
import { useTheme } from '@hooks/useTheme';

export type CardListItemProps = {
  card: Card;
  index: number;
  onPress: (id: number, index: number, title: string, caption?: string) => void;
};

export const ITEM_HEIGHT = 64;

export const CardListItem = ({
  card,
  index,
  onPress: handlePress,
}: CardListItemProps) => {
  const { theme, themeStyles } = useTheme();

  return (
    <Pressable
      style={[
        styles.container,
        themeStyles.background50,
        themeStyles.borderSubdued,
      ]}
      onPress={() =>
        handlePress(
          card.id,
          index,
          card.attributes.title,
          card.attributes.subtitle ?? undefined,
        )
      }
    >
      {({ pressed }) => (
        <View
          style={[
            styles.inner,
            pressed ? styles.innerPressed : undefined,
            pressed ? themeStyles.background100 : undefined,
          ]}
        >
          <View style={styles.innerDetails}>
            <View style={styles.innerDetailsTitle}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.cardTitle, themeStyles.color]}
              >
                {card.attributes.title}
              </Text>
              {card.attributes.unique ? (
                <Text style={[styles.cardTitle, themeStyles.color]}>⟡</Text>
              ) : null}
            </View>
            <View style={styles.innerDetailsCaption}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.cardInfo, themeStyles.colorSubdued]}
              >
                {card.attributes.subtitle ? (
                  <>
                    <Text style={{ fontStyle: 'italic' }}>
                      {card.attributes.subtitle}
                    </Text>
                    {' · '}
                  </>
                ) : null}
                {card.attributes.arenas.data.length
                  ? `${card.attributes.arenas.data
                      .map((arena) => arena.attributes.name)
                      .join(', ')} `
                  : null}
                {card.attributes.type.data?.attributes.name}
                <Text>{' · '}</Text>
                {card.attributes.cost &&
                card.attributes.type.data &&
                !['Leader', 'Leader Unit'].includes(
                  card.attributes.type.data.attributes.name,
                ) ? (
                  <>
                    {card.attributes.cost}
                    {' · '}
                  </>
                ) : null}
              </Text>
              <CardListRarity cardAttibutes={card.attributes} />
            </View>
          </View>
          <CardListAspects card={card.attributes} />
          <FontAwesome6
            name="chevron-right"
            size={16}
            color={theme.tintSubdued}
          />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    paddingTop: StyleSheet.hairlineWidth,
    width: '100%',
  },
  inner: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: '100%',
  },
  innerPressed: {
    opacity: 0.5,
  },
  innerDetails: {
    flex: 1,
    gap: 2,
  },
  innerDetailsTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  innerDetailsCaption: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 16,
  },
  cardInfo: {
    fontSize: 13,
  },
});
