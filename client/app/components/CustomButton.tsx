import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { twMerge } from 'tailwind-merge'; 

interface CustomButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  isPrimary?: boolean; 
  style?: string; 
  isDisabled?:boolean
}

const CustomButton: React.FC<CustomButtonProps> = ({ children, onPress, isPrimary, style,isDisabled=false }) => {
  const buttonStyles = twMerge(
    'p-4 rounded-lg w-52 self-center' ,
    isPrimary ? 'bg-blue-500' : 'bg-gray-500', 
    style 
  );

  return (
    <TouchableOpacity onPress={onPress} disabled={isDisabled} className={buttonStyles}>
      <Text className="text-white w text-center text-xl">{children}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
