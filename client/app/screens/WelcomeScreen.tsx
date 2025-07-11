import React from 'react';
import { View, Text, Image, Button, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import { router } from 'expo-router';
import CustomHeaderSafeView from '../components/CustomHeaderSafeView';

const bgImage=require("@/assets/images/home.png")
const Icon=require("@/assets/images/icon.png")

const WelcomeScreen = () => {
  

  const handleLogin = () => {
    router.replace('/(auth)/login'); 
  };

  const handleRegister = () => {
    router.replace('/(auth)/register'); 
  };

  const handleGuestLogin = () => {
    router.replace('/(user)/user-home'); 
  };
  console.log("Hello",process.env.EXPO_PUBLIC_API_URL);
  


  return (
    <View className=' relative w-full h-full  '>
      <ImageBackground source={bgImage}  resizeMode='cover' className=' absolute h-full w-full bg-black' />    
        <SafeAreaView className='p-0.5 flex flex-1  items-center justify-between  ' >
          <View className='flex items-center'>
            <Image source={Icon} className='h-32 w-32 mt-10 mb-5 ' />
            <Text className='text-white text-4xl font-semibold'>Welcome to Our App!</Text>
          </View>
          <View className='flex justify-between gap-4 '>
          <CustomButton isPrimary={true}  onPress={handleLogin}>Login</CustomButton>
          <CustomButton isPrimary={true} onPress={handleRegister}>Register</CustomButton>
          <CustomButton onPress={handleGuestLogin}>View as Guest</CustomButton>
          </View>
      </SafeAreaView>
    </View>
  );
};


export default WelcomeScreen;
