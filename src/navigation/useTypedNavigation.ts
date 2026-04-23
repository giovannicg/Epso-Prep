import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types';

export function useAppNavigation() {
  return useNavigation<StackNavigationProp<RootStackParamList>>();
}

export function useQuizRoute() {
  return useRoute<RouteProp<RootStackParamList, 'Quiz'>>();
}

export function useQuizResultsRoute() {
  return useRoute<RouteProp<RootStackParamList, 'QuizResults'>>();
}
