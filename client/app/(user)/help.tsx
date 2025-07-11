import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomBookingHeader from '../components/CustomBookingHeader'
import CustomTabs from '../components/CustomTabs'
import CustomButton from '../components/CustomButton'

const help = () => {
  return (
    <SafeAreaView className='flex flex-1 '>
        <View className='flex  w-full`'>
      <Text className=' bg-gray-400 py-4 text-center  '>Contact Us</Text>
      <View className=' mt-6 px-2'>
        <Text className='text-xl'>Phone:</Text>
        <Text className='font-semibold'>9118273841</Text>
      </View>

        </View>
    </SafeAreaView>
  )
}

export default help