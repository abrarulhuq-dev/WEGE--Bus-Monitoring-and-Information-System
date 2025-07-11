import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'


interface CustomBookingProps{
    headerHref:string
    from:string      
    to:string
    date:string
    
}

const CustomBookingHeader:React.FC<CustomBookingProps> = ({headerHref,to,from,date}) => {
  return (
    <View className='flex py-4 flex-row px-2  items-center justify-between bg-gray-500'  >
      <Text onPress={()=>router.back()} className=' w-10 bg-black rounded-full text-white text-3xl text-center  '>&lt;</Text>
      <Text className='text-lg font-semibold'>{from}  {to} </Text>
      <Text className='text-lg font-semibold'>{date}</Text>
    </View>
  )
}

export default CustomBookingHeader