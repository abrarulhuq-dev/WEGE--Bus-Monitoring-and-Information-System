import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import Account from '../comm/account'
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';

const UserAccount = () => {
  const {userId}=useAuth();
  useEffect(()=>{

    if(userId===null){
      router.replace('/login')
    }

  },[userId])
  return (
    <Account/>
  )
}

export default UserAccount