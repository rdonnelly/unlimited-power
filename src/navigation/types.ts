import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type StackParamList = {
  StackCardListScreen: undefined;
  StackCardDetailScreen: {
    id: number;
    title: string;
    caption?: string;
    index: number;
    // Show only this card instead of paging through the card list results
    standalone?: boolean;
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

declare global {
  namespace ReactNavigation {
    interface RootParamList extends StackParamList {}
  }
}
