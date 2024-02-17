import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-fast-text';

import type { Card } from '@data/Card';
import { useTheme } from '@hooks/useTheme';
import { DARK_THEME, LIGHT_THEME } from '@styles/theme';

import { CardListAspects } from './CardListAspects';

export type CardListItemProps = {
  card: Card;
  handlePress: (id: number, title: string, caption?: string) => void;
};

export const ITEM_HEIGHT = 64;

export const CardListItem = ({ card, handlePress }: CardListItemProps) => {
  const { theme, themeStyles } = useTheme();

  return (
    <View
      style={[
        styles.container,
        themeStyles.themedbackground50,
        themeStyles.themedBorderSubdued,
      ]}
    >
      <Pressable
        onPress={() =>
          handlePress(
            card.id,
            card.attributes.title,
            card.attributes.subtitle ?? undefined,
          )
        }
        style={styles.pressable}
      >
        {({ pressed }) => (
          <View
            style={[
              styles.inner,
              pressed ? styles.innerPressed : undefined,
              pressed ? themeStyles.themedbackground100 : undefined,
            ]}
          >
            <View style={styles.innerDetails}>
              <View style={styles.innerDetailsTitle}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[styles.cardTitle, themeStyles.themedColor]}
                >
                  {card.attributes.title}
                </Text>
                {card.attributes.unique ? (
                  <Image
                    style={[styles.cardUniqueIcon]}
                    source={require('../../assets/icons/unique.png')}
                    contentFit="cover"
                  />
                ) : null}
              </View>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.cardInfo, themeStyles.themedColorSubdued]}
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
                  ? card.attributes.arenas.data
                      .map((arena) => arena.attributes.name)
                      .join(', ')
                  : card.attributes.type.data.attributes.name}
              </Text>
            </View>
            <CardListAspects card={card.attributes} />
            <Ionicons
              name="chevron-forward"
              size={24}
              color={
                theme.scheme === 'light'
                  ? LIGHT_THEME.tintSubdued
                  : DARK_THEME.tintSubdued
              }
              style={styles.innerChevron}
            />
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: ITEM_HEIGHT,
    paddingTop: StyleSheet.hairlineWidth,
    width: '100%',
  },
  pressable: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'center',
  },
  inner: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: '100%',
  },
  innerPressed: {
    opacity: 0.5,
  },
  innerDetails: {
    flex: 1,
  },
  innerDetailsTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  cardUniqueIcon: {
    backgroundColor: DARK_THEME.background100,
    borderRadius: 8,
    height: 12,
    width: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardInfo: {
    fontSize: 13,
  },
  innerChevron: {
    marginRight: -8,
  },
});
