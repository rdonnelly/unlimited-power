import { FontAwesome5 } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

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
            title: 'Unlimited Power',
            headerTitle: ({ tintColor }) => {
              return (
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: 16,
                  }}
                >
                  <FontAwesome5
                    name="bolt"
                    size={16}
                    color={tintColor}
                    style={{
                      transform: [{ scaleX: -1 }],
                    }}
                  />
                  <Text
                    style={{
                      color: tintColor,
                      fontSize: 16,
                      fontWeight: '700',
                      textTransform: 'uppercase',
                    }}
                  >
                    Unlimited Power
                  </Text>
                  <FontAwesome5 name="bolt" size={16} color={tintColor} />
                </View>
              );
            },
          }}
        />
        <Stack.Screen
          name="StackCardDetailScreen"
          component={CardDetailScreen}
          options={{
            title: '',
            headerTitle: '',
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};
