import { memo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { CardDetailImages } from '@components/CardDetailImages';
import { CardDetailLinks } from '@components/CardDetailLinks';
import { CardDetailRulesClarifications } from '@components/CardDetailRulesClarifications';
import { Error } from '@components/Error';
import { useCard } from '@data/hooks/useCard';
import { useTheme } from '@hooks/useTheme';

type CardDetailProps = {
  id: number;
};

function CardDetail({ id }: CardDetailProps) {
  const { theme } = useTheme();
  const { data, isLoading, isError, isFetching, refetch } = useCard(id);

  if (isError) {
    return <Error labelPrimary="Retry" onPrimary={() => refetch()} />;
  }

  if (isLoading || data == null) {
    return (
      <View style={styles.container}>
        <View style={styles.activity}>
          <ActivityIndicator color={theme.tintSubdued} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <CardDetailImages
          cardAttributes={data.attributes}
          isFetching={isFetching}
        />
      </View>
      <CardDetailRulesClarifications cardAttributes={data.attributes} />
      <CardDetailLinks cardAttributes={data.attributes} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 32,
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
