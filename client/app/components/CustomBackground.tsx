import { View, Text, ImageBackground } from 'react-native';
import React from 'react';

interface CustomBackgroundProps {
  url?: string; 
}

const DEFAULT_URL = require('@/assets/images/home.png');

const CustomBackground: React.FC<CustomBackgroundProps> = ({ url }) => {
  return (
    <ImageBackground
      source={url ? { uri: url } : DEFAULT_URL} 
      className='absolute h-full w-full bg-black'
    >
    </ImageBackground>
  );
};

export default CustomBackground;
