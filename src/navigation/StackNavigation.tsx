import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, StyleSheet, Text, View } from 'react-native';

import type { StackParamList } from '@navigation/types';
import { CardDetailScreen } from '@screens/CardDetailScreen';
import { CardListScreen } from '@screens/CardListScreen';
import { InfoScreen } from '@screens/InfoScreen';

const Stack = createNativeStackNavigator<StackParamList>();

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  headerIcon: {
    transform: [{ scaleX: -1 }],
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  cardDetailTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 16,
    textAlign: Platform.OS === 'android' ? 'auto' : 'center',
    textTransform: 'uppercase',
  },
  cardDetailCaption: {
    fontSize: 13,
    lineHeight: 15,
    opacity: 0.6,
    textAlign: Platform.OS === 'android' ? 'auto' : 'center',
  },
});

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
                <View style={styles.headerContainer}>
                  <View style={styles.headerIcon}>
                    <FontAwesome6
                      name="bolt-lightning"
                      size={16}
                      color={tintColor}
                    />
                  </View>
                  <Text style={[styles.headerTitle, { color: tintColor }]}>
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
                  <Text style={[styles.cardDetailTitle, { color: tintColor }]}>
                    {route.params.title ?? ''}
                  </Text>
                  {route.params.caption ? (
                    <Text
                      style={[styles.cardDetailCaption, { color: tintColor }]}
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
