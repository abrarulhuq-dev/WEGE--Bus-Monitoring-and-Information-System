import { View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import CustomTabElement from './CustomTabElement';
import { useRouter, useSegments } from 'expo-router';




interface CustomTabsProps{
  tabList:{
    title:string;
    icon:string;
    href:string;
  }[]
}

const CustomTabs:React.FC<CustomTabsProps> = ({tabList}) => {
  const [activeTab, setActiveTab] = useState(0); 
  const router=useRouter()
  const segments=useSegments()
  
  

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

export default CustomTabs;
