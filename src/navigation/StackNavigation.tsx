import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

import type { StackParamList } from '@navigation/types';
import { CardDetailScreen } from '@screens/CardDetailScreen';
import { CardListScreen } from '@screens/CardListScreen';
import { InfoScreen } from '@screens/InfoScreen';

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
                      textAlign: 'center',
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
          options={({ route }) => ({
            title: '',
            headerTitle: ({ tintColor }) => {
              return (
                <View>
                  <Text
                    style={{
                      color: tintColor,
                      fontSize: 16,
                      fontWeight: '700',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                    }}
                  >
                    {route.params.title ?? ''}
                  </Text>
                  {route.params.caption ? (
                    <Text
                      style={{
                        color: tintColor,
                        fontSize: 13,
                        opacity: 0.6,
                        textAlign: 'center',
                        marginTop: -2,
                      }}
                    >
                      {route.params.caption}
                    </Text>
                  ) : null}
                </View>
              );
            },
            headerBackButtonDisplayMode: 'minimal',
          })}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="StackInfoScreen"
          component={InfoScreen}
          options={{
            title: '',
            headerTitle: '',
            headerBackButtonDisplayMode: 'minimal',
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};
