import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Card } from '@data/Card';
import { useTheme } from '@hooks/useTheme';
import { DARK_THEME, LIGHT_THEME } from '@styles/colors';

export type CardListItemProps = {
  card: Card;
  handlePress: (id: number) => void;
};

export const ITEM_HEIGHT = 64;

export const CardListItem = ({ card, handlePress }: CardListItemProps) => {
  const { theme, themeStyles } = useTheme();

  return (
    <View
      style={[
        styles.container,
        themeStyles.themedBackground200,
        themeStyles.themedBorderSubdued,
      ]}
    >
      <Pressable onPress={() => handlePress(card.id)} style={styles.pressable}>
        {({ pressed }) => (
          <View
            style={[
              styles.inner,
              pressed ? styles.innerPressed : undefined,
              pressed ? themeStyles.themedBackground300 : undefined,
            ]}
          >
            <View>
              <Text style={[styles.cardTitle, themeStyles.themedColor]}>
                {card.attributes.title}
              </Text>
              <Text style={[styles.cardInfo, themeStyles.themedColorSubdued]}>
                {card.attributes.type.data.attributes.name}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={
                theme.scheme === 'light'
                  ? LIGHT_THEME.tintSubdued
                  : DARK_THEME.tintSubdued
              }
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  cardInfo: {},
});
