import { useEffect, useRef, useState } from 'react';
import { createSearchController } from '@data/searchController';
import { StyleSheet, TextInput, View } from 'react-native';

import { useSearchFilterStore } from '@data/stores/useSearchFilterStore';
import { useTheme } from '@hooks/useTheme';

export function CardSearch({ onSubmit }: { onSubmit?: () => void }) {
  const { theme, themeStyles } = useTheme();
  const [draft, setDraft] = useState(
    () => useSearchFilterStore.getState().searchString ?? '',
  );
  const controller = useRef<ReturnType<typeof createSearchController> | null>(
    null,
  );
  useEffect(() => {
    controller.current = createSearchController(setDraft);
    return () => controller.current?.dispose();
  }, []);

  return (
    <View style={[styles.container, themeStyles.background300]}>
      <TextInput
        style={[styles.input, themeStyles.color]}
        accessibilityLabel="Search cards"
        accessibilityHint="Search by title, trait, or keyword"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="always"
        placeholder="Title, trait, or keyword"
        placeholderTextColor={theme.textSubdued}
        returnKeyType="search"
        value={draft}
        onChangeText={(text) => controller.current?.change(text)}
        onSubmitEditing={() => {
          controller.current?.submit();
          onSubmit?.();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    paddingStart: 12,
    paddingEnd: 4,
  },
  input: {
    minHeight: 48,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
});
