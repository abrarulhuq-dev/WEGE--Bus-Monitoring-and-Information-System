import { View, Text } from 'react-native'
import React from 'react'

interface TrackItemProps {
  from: string
  to: string
  departureTime: string
  arrivalTime: string
  fare: string
}

const TrackItem: React.FC<TrackItemProps> = ({ from, to, departureTime, arrivalTime, fare }) => {
  return (
    <View className="px-4 py-6 bg-gray-100 rounded-md mb-2 shadow-sm">
      <View className="flex flex-row justify-between">
        <Text className="text-black font-semibold">{from} → {to}</Text>
        <Text className="text-black">{fare}</Text>
      </View>
      <View className="mt-2 flex flex-row justify-between">
        <Text className="text-sm">Departure: {departureTime}</Text>
        <Text className="text-sm">Arrival: {arrivalTime}</Text>
      </View>
    </View>
  )
}

export default TrackItem
