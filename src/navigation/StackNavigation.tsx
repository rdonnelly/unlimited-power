import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { StackParamList } from '@navigation/types';
import { CardDetailScreen } from '@screens/CardDetailScreen';
import { CardListScreen } from '@screens/CardListScreen';

const Stack = createNativeStackNavigator<StackParamList>();

export const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="StackCardListScreen"
          component={CardListScreen}
          options={{
            title: 'Spark of Rebellion',
          }}
        />
        <Stack.Screen
          name="StackCardDetailScreen"
          component={CardDetailScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};
