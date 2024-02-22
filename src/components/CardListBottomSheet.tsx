import BottomSheet, { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useCallback, useMemo, useRef } from 'react';
import {
  type NativeSyntheticEvent,
  StyleSheet,
  Text,
  type TextInputSubmitEditingEventData,
  View,
} from 'react-native';

import { Chips } from '@components/Chips';
import {
  rarityFilterOptions,
  useRarityFilterStore,
} from '@data/stores/useRarityFilterStore';
import { useSearchFilterStore } from '@data/stores/useSearchFilterStore';
import {
  typeFilterOptions,
  useTypeFilterStore,
} from '@data/stores/useTypeFilterStore';
// import {
//   aspectFilterOptions,
//   useAspectFilterStore,
// } from '@data/stores/useAspectFilterStore';
import { useTheme } from '@hooks/useTheme';

export function CardListBottomSheet() {
  const { theme, themeStyles } = useTheme();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => [112, 400], []);

  const [searchString, updateSearchString] = useSearchFilterStore((state) => [
    state.searchString,
    state.update,
  ]);

  //   const setSearchStringDebounced = useMemo(
  //     () =>
  //       debounce((value) => {
  //         updateSearchString(value);
  //       }, 500),
  //     [updateSearchString],
  //   );

  //   const handleChange = useCallback(
  //     (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
  //       const query = event.nativeEvent.text;
  //       if (query) {
  //         setSearchStringDebounced(query);
  //       } else {
  //         setSearchStringDebounced(undefined);
  //       }
  //     },
  //     [setSearchStringDebounced],
  //   );

  const handleSubmitEditing = useCallback(
    (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      const query = event.nativeEvent.text;
      if (query) {
        updateSearchString(query);
      } else {
        updateSearchString(undefined);
      }

      bottomSheetRef.current?.collapse();
    },
    [updateSearchString],
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
      backgroundStyle={[styles.background, themeStyles.themedbackground100]}
      // index={0}
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
          onSubmitEditing={handleSubmitEditing}
          //   onChange={handleChange}
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
            selectedOptions={aspectFilters}
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
            <Text style={styles.filterSectionHeaderText}>Type</Text>
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
            <Text style={styles.filterSectionHeaderText}>Rarity</Text>
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
