import { Alert, Linking } from 'react-native';

export const openURL = async (url: string) => {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Karabast!', 'The URL could not be opened, please try again!', [
      { text: 'OK' },
    ]);
  }
};
