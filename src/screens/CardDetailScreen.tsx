import throttle from 'lodash/throttle';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Dimensions,
  FlatList,
  type ScaledSize,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CardDetail } from '@components/CardDetail';
import type { Card } from '@data/Card';
import { useCards } from '@data/hooks/useCards';
import type { CardDetailScreenProps } from '@navigation/types';

export function CardDetailScreen({ navigation, route }: CardDetailScreenProps) {
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const { data, hasNextPage, fetchNextPage } = useCards();

  const cards = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const loadNextPage = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      throttle(
        ({ window }: { window: ScaledSize }) => {
          flatListRef?.current?.scrollToOffset({
            offset: window.width * route.params.index,
            animated: false,
          });
        },
        50,
        { leading: false, trailing: true },
      ),
    );

    return () => subscription?.remove();
  }, [route.params.index]);

  const renderItem = useCallback(
    ({ item: card }: { item: Card }) => (
      <View
        style={[
          styles.cell,
          { paddingBottom: insets.bottom, width: windowWidth },
        ]}
      >
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          <CardDetail id={card.id} />
        </ScrollView>
      </View>
    ),
    [insets.bottom, windowWidth],
  );

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: windowWidth,
      offset: windowWidth * index,
      index,
    }),
    [windowWidth],
  );

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index != null) {
        navigation.setParams({
          id: cards[viewableItems[0]?.index]?.id,
          index: viewableItems[0]?.index,
          title: cards[viewableItems[0]?.index]?.attributes.title,
          caption:
            cards[viewableItems[0]?.index]?.attributes.subtitle ?? undefined,
        });
      }
    },
    [cards, navigation],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cards}
        keyExtractor={(item: Card) => `card-detail-${item.id}`}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        ref={flatListRef}
        horizontal
        scrollEnabled
        pagingEnabled
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        viewabilityConfig={viewabilityConfig.current}
        onViewableItemsChanged={handleViewableItemsChanged}
        initialScrollIndex={route.params.index}
        windowSize={2}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        updateCellsBatchingPeriod={100}
        onEndReached={loadNextPage}
        onEndReachedThreshold={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  cell: {
    alignItems: 'center',
    height: '100%',
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
});
