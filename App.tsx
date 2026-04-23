import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { LoadingScreen } from './src/components/common/LoadingScreen';
import { useProgressStore } from './src/store/progressStore';

export default function App() {
  const loadProgress = useProgressStore(s => s.loadProgress);
  const isLoaded = useProgressStore(s => s.isLoaded);

  useEffect(() => {
    loadProgress();
  }, []);

  if (!isLoaded) return <SafeAreaProvider><LoadingScreen /></SafeAreaProvider>;
  return <SafeAreaProvider><RootNavigator /></SafeAreaProvider>;
}
