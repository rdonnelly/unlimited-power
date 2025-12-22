import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import type BottomSheet from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CardList } from '@components/CardList';
import { CardListBottomSheet } from '@components/CardListBottomSheet';
import type { CardListScreenProps } from '@navigation/types';

export function CardListScreen({ navigation }: CardListScreenProps) {
  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) => {
        return (
          <Pressable
            style={{ padding: 8 }}
            onPress={() => {
              navigation.push('StackInfoScreen');
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
  }, [navigation]);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const collapseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.collapse();
  }, []);

  const navigateToCardDetails = useCallback(
    (id: number, index: number, title: string, caption?: string) => {
      if (navigation) {
        bottomSheetRef.current?.collapse();
        navigation.push('StackCardDetailScreen', {
          id,
          index,
          title,
          caption,
        });
      }
    },
    [navigation],
  );

  return (
    <View style={styles.container}>
      <CardList
        onPressItem={navigateToCardDetails}
        onScrollBeginDrag={collapseBottomSheet}
      />
      <CardListBottomSheet bottomSheetRef={bottomSheetRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});
