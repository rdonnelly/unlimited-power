import BottomSheet, { BottomSheetTextInput } from '@gorhom/bottom-sheet';
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

export function CardListBottomSheet() {
  const { theme, themeStyles } = useTheme();

  const bottomSheetRef = useRef<BottomSheet>(null);

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

  const [aspectOptions, addAspect, removeAspect] = useAspectFilterStore(
    (state) => [state.aspects, state.add, state.remove],
  );

  const [rarityOptions, addRarity, removeRarity] = useRarityFilterStore(
    (state) => [state.rarities, state.add, state.remove],
  );

  const [typeOptions, addType, removeType] = useTypeFilterStore((state) => [
    state.types,
    state.add,
    state.remove,
  ]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      // index={0}
      backgroundStyle={[styles.background, themeStyles.themedbackground100]}
      handleIndicatorStyle={{ backgroundColor: theme.textSubdued }}
      keyboardBehavior="fillParent"
      keyboardBlurBehavior="restore"
    >
      <View style={styles.container}>
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
          defaultValue={searchString ?? ''}
        />

        {/* <View style={styles.filterSection}>
          <View style={styles.filterSectionHeader}>
            <Text style={styles.filterSectionHeaderText}>Aspects</Text>
          </View>
          <Chips
            options={aspectFilterOptions.map((aspect) => ({
              key: aspect,
              label: aspect,
            }))}
            selectedOptions={aspectOptions}
            onChange={(aspect, isSelected) => {
              if (isSelected) {
                removeAspect(aspect);
              } else {
                addAspect(aspect);
              }
            }}
          />
        </View> */}

        <View style={styles.filterSection}>
          <View style={styles.filterSectionHeader}>
            <Text
              style={[styles.filterSectionHeaderText, themeStyles.themedColor]}
            >
              Type
            </Text>
          </View>
          <Chips
            options={typeFilterOptions.map((type) => ({
              key: type,
              label: type,
            }))}
            selectedOptions={typeOptions}
            onChange={(type, isSelected) => {
              if (isSelected) {
                removeType(type);
              } else {
                addType(type);
              }
            }}
          />
        </View>

        <View style={styles.filterSection}>
          <View style={styles.filterSectionHeader}>
            <Text
              style={[styles.filterSectionHeaderText, themeStyles.themedColor]}
            >
              Rarity
            </Text>
          </View>
          <Chips
            options={rarityFilterOptions.map((rarity) => ({
              key: rarity,
              label: rarity,
            }))}
            selectedOptions={rarityOptions}
            onChange={(rarity, isSelected) => {
              if (isSelected) {
                removeRarity(rarity);
              } else {
                addRarity(rarity);
              }
            }}
          />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  background: {},
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  input: {
    borderRadius: 8,
    borderWidth: 0,
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 40,
    padding: 12,
    width: '100%',
  },
  filterSection: {
    alignItems: 'flex-start',
    marginBottom: 16,
    width: '100%',
  },
  filterSectionHeader: {
    marginBottom: 8,
  },
  filterSectionHeaderText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
  },
});
