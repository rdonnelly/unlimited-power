import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import type { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chips } from '@components/Chips';
import {
  aspectFilterOptions,
  useAspectFilterStore,
} from '@data/stores/useAspectFilterStore';
import {
  rarityFilterOptions,
  useRarityFilterStore,
} from '@data/stores/useRarityFilterStore';
import { useSearchFilterStore } from '@data/stores/useSearchFilterStore';
import {
  typeFilterOptions,
  useTypeFilterStore,
} from '@data/stores/useTypeFilterStore';
import { useTheme } from '@hooks/useTheme';

type CardListBottomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheetMethods>;
};

export function CardListBottomSheet({
  bottomSheetRef,
}: CardListBottomSheetProps) {
  const { theme, themeStyles } = useTheme();
  const insets = useSafeAreaInsets();

  const snapPoints = useMemo(
    () => [72 + Math.max(16, insets.bottom), 400, '100%'],
    [insets.bottom],
  );

  useEffect(() => {
    bottomSheetRef.current?.collapse();
  }, [bottomSheetRef]);

  const [searchString, updateSearchString] = useSearchFilterStore((state) => [
    state.searchString,
    state.update,
  ]);

  const setSearchStringDebounced = useMemo(
    () =>
      debounce((searchString) => {
        updateSearchString(searchString);
      }, 500),
    [updateSearchString],
  );

  const handleChangeText = useCallback(
    (searchString: string) => {
      if (searchString) {
        setSearchStringDebounced(searchString);
      } else {
        setSearchStringDebounced(searchString);
      }
    },
    [setSearchStringDebounced],
  );

  const handleSubmitEditing = useCallback(() => {
    bottomSheetRef.current?.collapse();
  }, [bottomSheetRef]);

  const [aspectOptions, updateAspect] = useAspectFilterStore((state) => [
    state.aspects,
    state.update,
  ]);

  const [rarityOptions, updateRarity] = useRarityFilterStore((state) => [
    state.rarities,
    state.update,
  ]);

  const [typeOptions, updateType] = useTypeFilterStore((state) => [
    state.types,
    state.update,
  ]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={0}
      backgroundStyle={[styles.background, themeStyles.background200]}
      handleIndicatorStyle={{ backgroundColor: theme.textSubdued }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="none"
      android_keyboardInputMode="adjustResize"
    >
      <View style={styles.container}>
        <BottomSheetTextInput
          style={[
            styles.input,
            themeStyles.background300,
            themeStyles.color,
            { marginBottom: Math.max(24, insets.bottom) },
          ]}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="always"
          placeholder="Search by Title, Trait, or Keyword"
          placeholderTextColor={theme.textSubdued}
          returnKeyType="search"
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmitEditing}
          defaultValue={searchString ?? ''}
        />

        <BottomSheetScrollView
          style={[styles.scrollContainer, themeStyles.borderSubdued]}
          contentContainerStyle={[
            styles.scrollContainerContent,
            { paddingBottom: insets.bottom },
          ]}
        >
          <Chips
            heading="Aspects"
            options={aspectFilterOptions.map((aspect) => ({
              value: aspect,
              label: aspect,
            }))}
            selections={aspectOptions}
            onChange={updateAspect}
            delay={1000}
          />

          <Chips
            heading="Type"
            options={typeFilterOptions.map((type) => ({
              value: type,
              label: type,
            }))}
            selections={typeOptions}
            onChange={updateType}
          />

          <Chips
            heading="Rarity"
            options={rarityFilterOptions.map((rarity) => ({
              value: rarity,
              label: rarity,
            }))}
            selections={rarityOptions}
            onChange={updateRarity}
          />
        </BottomSheetScrollView>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  background: {},
  container: {
    flex: 1,
  },
  input: {
    borderRadius: 8,
    borderWidth: 0,
    fontSize: 16,
    height: 48,
    lineHeight: 20,
    marginHorizontal: 16,
    padding: 12,
  },
  scrollContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
  },
  scrollContainerContent: {
    gap: 16,
    paddingTop: 16,
  },
});
