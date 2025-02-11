import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
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
      <Stack.Group screenOptions={{ headerShadowVisible: false }}>
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
                  <View
                    style={{
                      transform: [{ scaleX: -1 }],
                    }}
                  >
                    <FontAwesome6
                      name="bolt-lightning"
                      size={16}
                      color={tintColor}
                    />
                  </View>
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
                  <View>
                    <FontAwesome6
                      name="bolt-lightning"
                      size={16}
                      color={tintColor}
                    />
                  </View>
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
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};
