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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chips } from '@components/Chips';
import {
  FILTER_GROUPS,
  type FilterGroup,
  type FilterGroupKey,
  type FilterGroupValue,
} from '@data/CardFilters';
import { useFilterStore } from '@data/stores/useFilterStore';
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

  const reset = useFilterStore((state) => state.reset);

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
          <Button size="small" onPress={reset}>
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
        {FILTER_GROUPS.map((group) => (
          <FilterGroupChips key={group.key} group={group} />
        ))}
      </ScrollView>
    </TrueSheet>
  );
}

function FilterGroupChips({ group }: { group: FilterGroup }) {
  const selections = useFilterStore((state) => state[group.key]);
  const setGroup = useFilterStore((state) => state.setGroup);

  return (
    <Chips<FilterGroupValue<FilterGroupKey>>
      heading={group.heading}
      showHeaderControls
      options={[...group.options]}
      selections={selections}
      onChange={(values) => setGroup(group.key, values)}
    />
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
