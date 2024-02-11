import { StyleSheet, Text, View } from 'react-native';
import { useQuery } from 'react-query';

import { CardResponseSchema } from '@data/CardResponse';

type CardListProps = object;

export const CardList = ({}: CardListProps) => {
  const query = useQuery(['user'], async () => {
    const response = await (
      await fetch(
        'https://admin.starwarsunlimited.com/api/cards?filters[variantOf][id][$null]=true',
      )
    ).json();
    console.log('fetched');
    const parsed = CardResponseSchema.parse(response);
    console.log('parsed');

    // TODO catch errors, loading, etc.

    return parsed;
  });

  return (
    <View style={styles.container}>
      <View>
        <Text>Cards: {query.data?.data.length}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});
