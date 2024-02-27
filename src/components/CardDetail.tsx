import { memo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { CardDetailImages } from '@components/CardDetailImages';
import { useCard } from '@data/hooks/useCard';
import { useTheme } from '@hooks/useTheme';

type CardDetailProps = {
  id: number;
};

function CardDetail({ id }: CardDetailProps) {
  const { theme } = useTheme();
  const { data, error, isError, isFetching } = useCard(id);

  if (data) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {!isFetching ? (
            <CardDetailImages cardAttributes={data.attributes} />
          ) : null}
        </View>
        {isFetching ? (
          <View style={styles.activity}>
            <ActivityIndicator color={theme.tintSubdued} />
          </View>
        ) : null}
      </View>
    );
  }

  if (isError) {
    if (error instanceof Error) {
      return <Text>Error: {error.message}</Text>;
    }

    return <Text>An unknown error occured</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.activity}>
        <ActivityIndicator color={theme.tintSubdued} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    maxWidth: 768,
    width: '100%',
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 16,
  },
  activity: {
    bottom: 24,
    position: 'absolute',
  },
});

const memoCardDetail = memo<CardDetailProps>(CardDetail);
export { memoCardDetail as CardDetail };
