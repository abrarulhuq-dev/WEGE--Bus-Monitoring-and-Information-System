import { View, Text, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import CustomBookingHeader from '../components/CustomBookingHeader'
import formatDateToDDMMYYYY from '../utils/formatDate'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../components/CustomButton'
import BusCardDirect from '../components/BusCardDirect'
import BusCardIndirect from '../components/BusCardIndirect'
import getDirectBuses from '../utils/getDirectBuses'

const BusList = () => {
  const params = useLocalSearchParams()
  const from = params.from || ''
  const to = params.to || ''
  const date = params.date ? new Date(params.date) : new Date()

  const [activeTab, setActiveTab] = useState(0)
  const [hasDirectBus, setHasDirectBus] = useState(false)

  useEffect(() => {
    if (from && to) {
      setHasDirectBus(getDirectBuses(from, to).length > 0)
    }
  }, [from, to])

  return (
    <SafeAreaView className="flex flex-1">
      <CustomBookingHeader 
        headerHref='/(user)/user-home' 
        from={from} 
        to={to} 
        date={formatDateToDDMMYYYY(date)}
      />

      {/* 🚀 Tabs for Direct & Indirect Routes */}
      <View className="flex flex-row px-4 gap-2 mt-6 justify-center items-center">
        <CustomButton 
          isPrimary={activeTab === 0} 
          onPress={() => setActiveTab(0)}>
          Direct
        </CustomButton>

        <CustomButton 
          isPrimary={activeTab === 1} 
          onPress={() => setActiveTab(1)}>
          Indirect
        </CustomButton>
      </View>

      {/* 🚍 Display Direct or Indirect Routes */}
      <ScrollView className="flex bg-gray-200 mt-4 px-2 py-6">
        {activeTab === 0 ? (
          <BusCardDirect from={from} to={to} />
        ) : (
          <>
            {hasDirectBus && (
              <View className="bg-yellow-200 p-3 rounded-md mb-4">
                <Text className="text-center text-lg font-bold text-black">
                  ⚠️ Direct Bus Available! Check direct buses first.
                </Text>
              </View>
            )}
            <BusCardIndirect from={from} to={to} hasDirect={hasDirectBus} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default BusList
