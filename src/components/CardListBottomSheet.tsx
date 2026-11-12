import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { type RefObject, useRef } from 'react';
import {
  Keyboard,
  ScrollView,
  type ScrollViewInstance,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CardSearch } from '@components/CardSearch';

import { Button } from '@components/Button';
import { resetAllFilters } from '@data/stores/resetAllFilters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/shallow';

import { Chips } from '@components/Chips';
import { ExpansionNames } from '@data/Expansion';
import {
  aspectFilterOptions,
  useAspectFilterStore,
} from '@data/stores/useAspectFilterStore';
import {
  expansionFilterOptions,
  useExpansionFilterStore,
} from '@data/stores/useExpansionFilterStore';
import {
  rarityFilterOptions,
  useRarityFilterStore,
} from '@data/stores/useRarityFilterStore';
import {
  typeFilterOptions,
  useTypeFilterStore,
} from '@data/stores/useTypeFilterStore';
import { useTheme } from '@hooks/useTheme';

type CardListBottomSheetProps = {
  bottomSheetRef: RefObject<TrueSheet | null>;
  onDismiss: () => void;
  onPeekHeightChange: (height: number) => void;
};

export function CardListBottomSheet({
  bottomSheetRef,
  onDismiss,
  onPeekHeightChange,
}: CardListBottomSheetProps) {
  const { theme, themeStyles } = useTheme();
  const insets = useSafeAreaInsets();
  const detentIndex = useRef(0);
  const scrollRef = useRef<ScrollViewInstance>(null);

  // The sheet adds the bottom safe-area inset below the header at the peek
  // detent, so subtract it from the header's own bottom padding to keep the
  // search field vertically centered (the top padding also clears the grabber).
  const headerPadding = Math.max(HEADER_MIN_PADDING, insets.bottom);

  const collapse = () => {
    Keyboard.dismiss();
    void bottomSheetRef.current?.resize(0).catch(console.warn);
  };

  const [aspectOptions, updateAspect] = useAspectFilterStore(
    useShallow((state) => [state.aspects, state.update]),
  );

  const [expansionOptions, updateExpansion] = useExpansionFilterStore(
    useShallow((state) => [state.expansions, state.update]),
  );

  const [rarityOptions, updateRarity] = useRarityFilterStore(
    useShallow((state) => [state.rarities, state.update]),
  );

  const [typeOptions, updateType] = useTypeFilterStore(
    useShallow((state) => [state.types, state.update]),
  );

  return (
    <TrueSheet
      ref={bottomSheetRef}
      detents={['peek', 0.7, 1]}
      dismissible={false}
      dimmed={false}
      style={styles.sheet}
      scrollableRef={scrollRef}
      backgroundColor={theme.background200}
      accessibilityOptions={{
        paneTitle: 'Search and filters',
        grabberLabel: 'Search and filters',
        grabberHint: 'Drag up to show filters or down to show only search',
      }}
      onDidPresent={() => {
        detentIndex.current = 0;
      }}
      onDetentChange={(event) => {
        detentIndex.current = event.nativeEvent.index;
      }}
      onBackPress={() => {
        if (detentIndex.current === 0) return false;
        collapse();
        return true;
      }}
      onDidDismiss={onDismiss}
      header={
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: headerPadding,
            paddingBottom: headerPadding - insets.bottom,
          }}
          onLayout={(event) =>
            onPeekHeightChange(event.nativeEvent.layout.height)
          }
        >
          <CardSearch onSubmit={collapse} />
        </View>
      }
    >
      <ScrollView
        ref={scrollRef}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.scrollContainerContent,
          themeStyles.borderSubdued,
        ]}
      >
        <View style={styles.controls}>
          <Text
            accessibilityRole="header"
            style={[styles.title, themeStyles.color]}
          >
            Filters
          </Text>
          <Button size="small" onPress={resetAllFilters}>
            Reset
          </Button>
          <Button
            size="small"
            accessibilityLabel="Collapse filters"
            onPress={collapse}
          >
            Done
          </Button>
        </View>
        <Chips
          heading="Aspects"
          showHeaderControls
          options={aspectFilterOptions.map((aspect) => ({
            value: aspect,
            label: aspect,
          }))}
          selections={aspectOptions}
          onChange={updateAspect}
        />

        <Chips
          heading="Sets"
          showHeaderControls
          options={expansionFilterOptions.map((expansion) => ({
            value: expansion,
            label: ExpansionNames[expansion],
          }))}
          selections={expansionOptions}
          onChange={updateExpansion}
        />

        <Chips
          heading="Type"
          showHeaderControls
          options={typeFilterOptions.map((type) => ({
            value: type,
            label: type,
          }))}
          selections={typeOptions}
          onChange={updateType}
        />

        <Chips
          heading="Rarity"
          showHeaderControls
          options={rarityFilterOptions.map((rarity) => ({
            value: rarity,
            label: rarity,
          }))}
          selections={rarityOptions}
          onChange={updateRarity}
        />
      </ScrollView>
    </TrueSheet>
  );
}

// Clears the native grabber above the search field.
const HEADER_MIN_PADDING = 24;

const styles = StyleSheet.create({
  sheet: { flex: 1 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flex: 1, fontSize: 22, fontWeight: '700' },
  scrollContainer: { flex: 1 },
  scrollContainerContent: {
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 16,
    paddingTop: 16,
    // TrueSheet adds the bottom safe-area inset natively (scrollableOptions).
    paddingBottom: 24,
    marginHorizontal: 16,
  },
});
