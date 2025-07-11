import { View, Text,Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../components/CustomButton'
import { router } from 'expo-router'
import { useAuth } from '../context/AuthContext'

const UserIcon=require("@/assets/icons/account.png")
// Get User details from context
const Account = () => {
  const {logout}=useAuth();

const handlePress=()=>{
  logout();
  router.replace("/(auth)/login")
}
  return (
    <SafeAreaView className='flex flex-1'>
        <CustomButton onPress={handlePress} style='mt-8' ><Text>Logout</Text></CustomButton>
    </SafeAreaView>
  )
}

export default Account