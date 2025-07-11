import {  Button, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { twMerge } from 'tailwind-merge';
import { Link, router } from 'expo-router';

interface CustomSafeViewProps{
    className?:string;
    children:React.ReactNode;    
    headerHref:string;
}


const CustomHeaderSafeView :React.FC<CustomSafeViewProps>= ({className,children,headerHref}) => {
    const classNames=twMerge(className)
  return (
    <SafeAreaView className={classNames}>
      <View className='relative flex items-start '>
        <TouchableOpacity onPress={()=>router.replace(headerHref)} className='absolute z-10 top-1 left-4 p-1 bg-white rounded-full w-12 h-12 ' ><Text className='text-center font-bold text-3xl' >&lt;</Text></TouchableOpacity>
        <View className='flex h-full w-full'>
       {children}
        </View>
        </View>
    </SafeAreaView>
  )
}

export default CustomHeaderSafeView
