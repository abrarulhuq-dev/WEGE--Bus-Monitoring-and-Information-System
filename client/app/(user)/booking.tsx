import { View, Text, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomBookingHeader from '../components/CustomBookingHeader'
import formatDateToDDMMYYYY  from '../utils/formatDate'
import CustomTabs from '../components/CustomTabs'
import CustomHeaderSafeView from '../components/CustomHeaderSafeView'
import Ticket from '../components/Ticket'
import { useAuth } from '../context/AuthContext'
import { router } from 'expo-router'

const booking = () => {
  const date=new Date()
  const {userId}=useAuth();
  useEffect(()=>{
    if(userId===null){
      router.replace('/login')
    }

  },[userId])

  return (
    <SafeAreaView className='flex flex-1'>
      <ScrollView contentContainerStyle={{justifyContent:"space-between" ,gap:"20"}} >
      <Ticket/>
    

      <View className='mb-40'></View>
      </ScrollView>

    </SafeAreaView>
  )
}

export default booking