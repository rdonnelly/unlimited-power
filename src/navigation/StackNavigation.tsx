import Ionicons from '@expo/vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable } from 'react-native';

import type { StackParamList } from '@navigation/types';
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
            title: 'SWU',
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};
