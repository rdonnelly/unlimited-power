import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { cardSearchSheet } from '@data/cardSearchSheet';

import { CardList } from '@components/CardList';
import { CardListBottomSheet } from '@components/CardListBottomSheet';
import type { CardListScreenProps } from '@navigation/types';

export function CardListScreen({ navigation }: CardListScreenProps) {
  const navigating = useRef(false);
  const navigate = useCallback(
    (action: () => void) => {
      if (navigating.current || !navigation.isFocused()) return;
      navigating.current = true;
      Keyboard.dismiss();
      void cardSearchSheet
        .hide()
        .then(() => {
          if (navigation.isFocused()) action();
        })
        .catch((error) => {
          navigating.current = false;
          console.warn(error);
          void cardSearchSheet.restore().catch(console.warn);
        });
    },
    [navigation],
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) => {
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="About Unlimited Power"
            style={{ padding: 8 }}
            onPress={() => {
              navigate(() => navigation.push('StackInfoScreen'));
            }}
          >
            {({ pressed }) => (
              <FontAwesome6
                name="question-circle"
                size={20}
                color={tintColor}
                style={{ opacity: pressed ? 0.5 : 1 }}
              />
            )}
          </Pressable>
        );
      },
    });
  }, [navigate, navigation]);

  const bottomSheetRef = useRef<TrueSheet>(null);
  const [peekHeight, setPeekHeight] = useState(88);

  useEffect(() => {
    cardSearchSheet.attach(bottomSheetRef.current);
    return () => cardSearchSheet.attach(null);
  }, []);

  useFocusEffect(
    useCallback(() => {
      navigating.current = false;
      void cardSearchSheet.setFocused(true).catch(console.warn);
      return () => {
        Keyboard.dismiss();
        void cardSearchSheet.setFocused(false).catch(console.warn);
      };
    }, []),
  );

  const navigateToCardDetails = useCallback(
    (id: number, index: number, title: string, caption?: string) => {
      navigate(() =>
        navigation.push('StackCardDetailScreen', {
          id,
          index,
          title,
          caption,
        }),
      );
    },
    [navigate, navigation],
  );

  return (
    <View style={styles.container}>
      <CardList onPressItem={navigateToCardDetails} bottomInset={peekHeight} />
      <CardListBottomSheet
        bottomSheetRef={bottomSheetRef}
        onDismiss={cardSearchSheet.didDismiss}
        onPeekHeightChange={setPeekHeight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});
