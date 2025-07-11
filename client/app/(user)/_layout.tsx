import { Stack } from "expo-router";
import React from 'react'
import CustomTabs from "../components/CustomTabs";
import { useAuth } from "../context/AuthContext";


const homeIcon = require('@/assets/icons/home.png');
const mapIcon = require('@/assets/icons/map.png');
const calendarIcon = require('@/assets/icons/calender.png');
const helpIcon = require('@/assets/icons/help.png');
const accountIcon = require('@/assets/icons/account.png');

const UserLayout = () => {
const {userId}=useAuth();
console.log("user id is",userId);


  const tabList = [
    { title: 'Home', icon: homeIcon,href:"(user)/user-home" },
    { title: 'Tracking', icon: mapIcon,href:"(user)/tracking" },
    { title: 'Booking', icon: calendarIcon,href:"(user)/booking" },
    { title: 'Help', icon: helpIcon,href:"(user)/help" },
    { title: 'Account', icon: accountIcon,href:"(user)/account" },
  ];


  return (
    <>
    
    <Stack  >
      <Stack.Screen name="user-home" options={{headerShown:false}} />
      <Stack.Screen name="bus-list" options={{headerShown:false}} />
      <Stack.Screen name="tracking" options={{headerShown:false}} />
      <Stack.Screen name="booking" options={{headerShown:false}} />
      <Stack.Screen name="book" options={{headerShown:false}} />
      <Stack.Screen name="payment" options={{headerShown:false}} />
      <Stack.Screen name="ticket-detail" options={{headerShown:false}} />
      <Stack.Screen name="help" options={{headerShown:false}} />
      <Stack.Screen name="account" options={{headerShown:false}} />
    </Stack>

    <CustomTabs tabList={tabList}/>
    </>
  )
}

export default UserLayout