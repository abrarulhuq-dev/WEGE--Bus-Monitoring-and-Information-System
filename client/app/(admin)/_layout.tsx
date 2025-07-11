import { Stack } from "expo-router";
import React from 'react'
import AdminTab from "../components/AdminTabs";



const AdminLayout = () => {
  return (
  <>
  <Stack screenOptions={{headerShown:false}}>
    <Stack.Screen name="admin-home" options={{headerShown:false}}/>
    <Stack.Screen name="manage-driver" options={{headerShown:false}}/>
    <Stack.Screen name="manage-user" options={{headerShown:false}}/>
    <Stack.Screen name="add-driver" options={{headerShown:false}}/>
    <Stack.Screen name="account" options={{headerShown:false}}/>
    <Stack.Screen name="add-route" options={{headerShown:false}}/>
    </Stack>
    <AdminTab/>
  </>

  )
}

export default AdminLayout
