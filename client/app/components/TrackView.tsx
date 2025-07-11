import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'


interface TrackingUpdateProps{
place:string;status:boolean;
}
const TrackingUpdate:React.FC<TrackingUpdateProps> = ({place,status}) => {
  return (
    <TouchableOpacity className='flex flex-row items-center justify-between px-2 bg-gray-500 py-4'>
      <Text className='text-xl'>{place}</Text>
      {status?<View className='h-4 w-4 bg-green-600 rounded-full'></View>:<View className='h-4 w-4 bg-red-600 rounded-full'></View>}
    </TouchableOpacity>
  )
}

export default TrackingUpdate