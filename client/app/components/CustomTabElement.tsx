import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CustomTabElementProps {
  index: number;
  title: string;
  icon: any;
  isActive: boolean;
  handlePress: (index: number) => void;
}

const CustomTabElement: React.FC<CustomTabElementProps> = ({ title, index, icon, isActive, handlePress }) => {
  const classNames = twMerge(
    "text-xs font-semibold text-center ",
    isActive?"text-red-600":"text-black"
  );

  return (
    <TouchableOpacity className= "flex-1 items-center justify-center" onPress={() => handlePress(index)}>
      <Image 
        source={icon} 
        className='h-14 w-14 pb-2 '
        style={{tintColor:isActive?"red":"black"}}
        resizeMode="contain" 
      />
      <Text className={classNames}>{title}</Text> 
    </TouchableOpacity>
  );
};

export default CustomTabElement;
