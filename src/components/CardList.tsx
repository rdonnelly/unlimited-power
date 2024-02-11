import { StyleSheet, Text, View } from 'react-native';

import { type CardResponseData } from '@data/CardResponse';

type CardListProps = {
  cards: CardResponseData;
};

export const CardList = ({ cards }: CardListProps) => {
  return (
    <View style={styles.container}>
      <View>
        <Text>Cards: {cards.length}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});
