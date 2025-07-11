import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Scan from '../components/Scan'

const DriverHome = () => {
  return (
    <SafeAreaView >
     <View className='bg-gray-300'><Text className=' text-3xl text-center font-bold'>
                      Scan Ticket
                  </Text></View>
        <Scan />
                  
    </SafeAreaView>
  )
}

export default DriverHome