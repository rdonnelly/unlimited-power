import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import type { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import debounce from 'lodash/debounce';
import { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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

  const snapPoints = useMemo(() => [112, 400], []);

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
      backgroundStyle={[styles.background, themeStyles.themedbackground100]}
      handleIndicatorStyle={{ backgroundColor: theme.textSubdued }}
      keyboardBehavior="fillParent"
      keyboardBlurBehavior="none"
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <BottomSheetTextInput
            style={[
              styles.input,
              themeStyles.themedbackground200,
              themeStyles.themedColor,
            ]}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="always"
            placeholder="Search"
            placeholderTextColor={theme.textSubdued}
            returnKeyType="search"
            onChangeText={handleChangeText}
            onSubmitEditing={handleSubmitEditing}
            defaultValue={searchString ?? ''}
          />
        </View>

        <BottomSheetScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContainerContent}
        >
          {/* <Chips
            heading="Aspects"
            options={aspectFilterOptions.map((aspect) => ({
              value: aspect,
              label: aspect,
            }))}
            selectedOptions={aspectOptions}
            onChange={updateAspect}
          /> */}

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
  inputContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
    width: '100%',
  },
  input: {
    borderRadius: 8,
    borderWidth: 0,
    fontSize: 16,
    height: 44,
    lineHeight: 20,
    padding: 12,
    width: '100%',
  },
  scrollContainer: {
    width: '100%',
  },
  scrollContainerContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  filterSection: {
    marginBottom: 16,
    width: '100%',
  },
  filterSectionHeader: {
    marginBottom: 8,
  },
  filterSectionHeaderText: {
    fontSize: 20,
    fontWeight: '700',
  },
});
