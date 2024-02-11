import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type StackParamList = {
  StackCardListScreen: undefined;
  StackCardDetailScreen: {
    id: number;
  };
};

export type CardListScreenProps = NativeStackScreenProps<
  StackParamList,
  'StackCardListScreen'
>;

export type CardDetailScreenProps = NativeStackScreenProps<
  StackParamList,
  'StackCardDetailScreen'
>;
