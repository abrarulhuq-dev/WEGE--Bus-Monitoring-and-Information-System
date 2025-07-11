import React, { useState, useEffect } from 'react';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import SplashScreenAnimated from './screens/SplashScreenAnimated';
import WelcomeScreen from './screens/WelcomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const firstLaunch = await AsyncStorage.getItem('isFirstLaunch');
        if (firstLaunch === null) {
          // First launch detected
          setIsFirstLaunch(true);
          await AsyncStorage.setItem('isFirstLaunch', 'false');
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error('Error checking first launch status:', error);
      }
    };

    checkFirstLaunch();
  }, []);

  const handleAnimationFinish = () => {
    setIsReady(true);
  };

  if (isFirstLaunch === null) {
    // While loading the first launch status, show a loader
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      {!isReady && isFirstLaunch ? (
        <SplashScreenAnimated onAnimationFinish={handleAnimationFinish} />
      ) : (
        <WelcomeScreen />
      )}
    </SafeAreaProvider>
  );
}

