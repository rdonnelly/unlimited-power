import { StyleSheet, View } from 'react-native';

import { CardList } from '@components/CardList';

export function CardListScreen() {
  return (
    <View style={styles.container}>
      <CardList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
