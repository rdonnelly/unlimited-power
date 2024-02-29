import { memo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { CardDetailImages } from '@components/CardDetailImages';
import { Error } from '@components/Error';
import { useCard } from '@data/hooks/useCard';
import { useTheme } from '@hooks/useTheme';

type CardDetailProps = {
  id: number;
};

function CardDetail({ id }: CardDetailProps) {
  const { theme } = useTheme();
  const { data, isLoading, isError, isFetching, refetch } = useCard(id);

  if (isLoading || data == null) {
    return (
      <View style={styles.container}>
        <View style={styles.activity}>
          <ActivityIndicator color={theme.tintSubdued} />
        </View>
      </View>
    );
  }

  if (isError) {
    return <Error onRetry={() => refetch()} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <CardDetailImages
          cardAttributes={data.attributes}
          isFetching={isFetching}
        />
      </View>
      {isFetching ? (
        <View style={styles.activity}>
          <ActivityIndicator color={theme.tintSubdued} />
        </View>
      ) : null}
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
