import { View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import CustomTabElement from './CustomTabElement';
import { useRouter, useSegments } from 'expo-router';

const homeIcon = require('@/assets/icons/home.png');
const mapIcon = require('@/assets/icons/map.png');
const calendarIcon = require('@/assets/icons/calender.png');
const helpIcon = require('@/assets/icons/help.png');
const accountIcon = require('@/assets/icons/account.png');

const AdminTab = () => {
  const [activeTab, setActiveTab] = useState(0); 
  const router=useRouter()
  const segments=useSegments()
  
  const tabList = [
    { title: 'Home', icon: homeIcon,href:"(admin)/admin-home" },
    { title: 'Manage Users', icon: mapIcon,href:"(admin)/manage-user" },
    { title: 'Manage Driver', icon: mapIcon,href:"(admin)/manage-driver" },
    { title: 'Add Driver', icon: accountIcon,href:"(admin)/add-driver" },
    {title:'Add Route',icon:calendarIcon,href:"(admin)/add-route"},
    { title: 'Account', icon: accountIcon,href:"(admin)/account" },
    

  ];

  const handleTabPress = (index: number,href:any) => {
 
    console.log(segments.join("/")===href);
    
    if(segments.join("/")!==href)
      router.replace(href)
    
    setActiveTab(index); 
  };

  return (
    <View className="absolute w-full bottom-0 flex-row items-center justify-between pt-3 pb-6 px-5 bg-slate-300 border border-t-4 border-t-slate-400">
      {tabList.map((item, index) => (
        <CustomTabElement
          key={index}
          index={index}
          title={item.title}
          icon={item.icon}
          isActive={activeTab === index}
          handlePress={()=>handleTabPress(index,item.href)}
        />
      ))}
    </View>
  );
};

export default AdminTab;
