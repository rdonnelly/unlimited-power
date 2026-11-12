import { memo, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { CardDetailImages } from '@components/CardDetailImages';
import { CardDetailLinks } from '@components/CardDetailLinks';
import { CardDetailRulesClarifications } from '@components/CardDetailRulesClarifications';
import { Error } from '@components/Error';
import { QueryNotice } from '@components/QueryNotice';
import { useCardDetails } from '@data/hooks/useCardDetails';
import { useTheme } from '@hooks/useTheme';
import { useIsOnline } from '@hooks/useIsOnline';

type CardDetailProps = {
  id: number;
};

function CardDetail({ id }: CardDetailProps) {
  const { theme } = useTheme();
  const isOnline = useIsOnline();
  const { data, isFetching, isPaused, isError, refetch } = useCardDetails(id);

  const variantName = useMemo(() => {
    return (
      data?.attributes.variantTypes?.data[0]?.attributes.name || 'Standard'
    );
  }, [data]);

  if (!data && (isError || isPaused)) {
    return (
      <Error
        message={
          isPaused
            ? 'This card is not loaded. Connect to load it.'
            : 'This card could not be loaded.'
        }
        labelPrimary="Retry"
        onPrimary={() => refetch()}
      />
    );
  }

  if (data == null) {
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
      {!isOnline || isPaused || isError ? (
        <QueryNotice
          message={
            !isOnline || isPaused
              ? 'Offline. Showing loaded card details.'
              : 'Details could not be updated.'
          }
          onRetry={() => {
            void refetch({ cancelRefetch: false });
          }}
          busy={isFetching}
        />
      ) : null}
      <View style={styles.content}>
        <CardDetailImages cardId={id} variantName={variantName} />
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
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 16,
    zIndex: 1,
  },
  activity: {
    bottom: 24,
    position: 'absolute',
  },
});

const memoCardDetail = memo<CardDetailProps>(CardDetail);
export { memoCardDetail as CardDetail };
