import { Stack } from "expo-router";
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomTabs from "../components/CustomTabs";


const homeIcon = require('@/assets/icons/home.png');
const mapIcon = require('@/assets/icons/map.png');
const incidentIcon=require("@/assets/icons/incident.png")
const accountIcon = require('@/assets/icons/account.png');



const tabList = [
  { title: 'Home', icon: homeIcon,href:"(driver)/driver-home" },
  { title: 'Tracking', icon: mapIcon,href:"(driver)/tracking-update" },
  { title: 'Incident', icon: incidentIcon,href:"(driver)/incident" },
  { title: 'Account', icon: accountIcon,href:"(driver)/account" },
];


const AdminLayout = () => {
  return (
  <>
  
  <Stack>
    <Stack.Screen name="driver-home" options={{headerShown:false}}/>
    <Stack.Screen name="tracking-update" options={{headerShown:false}}/>
    <Stack.Screen name="incident" options={{headerShown:false}}/>
    <Stack.Screen name="account" options={{headerShown:false}}/>
    </Stack>
    <CustomTabs tabList={tabList}/>
  </>

  )
}

export default AdminLayout

const styles = StyleSheet.create({})