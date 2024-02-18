import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type StackParamList = {
  StackCardListScreen: undefined;
  StackCardDetailScreen: {
    id: number;
    title: string;
    caption?: string;
    index: number;
  };
  StackInfoScreen: undefined;
};

export type CardListScreenProps = NativeStackScreenProps<
  StackParamList,
  'StackCardListScreen'
>;

export type CardDetailScreenProps = NativeStackScreenProps<
  StackParamList,
  'StackCardDetailScreen'
>;

export type InfoScreenProps = NativeStackScreenProps<
  StackParamList,
  'StackInfoScreen'
>;
