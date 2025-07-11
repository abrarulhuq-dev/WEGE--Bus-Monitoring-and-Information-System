import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import React, { useState, useEffect } from 'react'
import CustomBackground from '../components/CustomBackground'
import CustomButton from '../components/CustomButton'
import { router } from 'expo-router'
import CustomHeaderSafeView from '../components/CustomHeaderSafeView'
import DateTimePicker from '@react-native-community/datetimepicker'
import DropDownPicker from 'react-native-dropdown-picker'

// Import Bus Data JSON
import busData from '@/app/data/bus_routes.json'

// Icons
const FromIcon = require("@/assets/icons/busEntry.png")
const ToIcon = require("@/assets/icons/busExit.png")
const CalenderIcon = require("@/assets/icons/calender2.png")

const UserHome = () => {
  const [busStops, setBusStops] = useState<string[]>([]) // Store all bus stops
  const [fromLocation, setFromLocation] = useState<string | null>(null)
  const [toLocation, setToLocation] = useState<string | null>(null)
  const [date, setDate] = useState(new Date())
  const [showDate, setShowDate] = useState(false)

  // DropDown Visibility Control
  const [openFrom, setOpenFrom] = useState(false)
  const [openTo, setOpenTo] = useState(false)

  // Extract unique bus stops from JSON
  useEffect(() => {
    try {
      const uniqueStops = new Set<string>()
      busData.forEach((bus: any) => {
        if (bus["Main Stops"] && Array.isArray(bus["Main Stops"])) {
          bus["Main Stops"].forEach((stop: string) => uniqueStops.add(stop))
        }
      })
      setBusStops(Array.from(uniqueStops).sort()) // Sort alphabetically
    } catch (error) {
      console.error("🚨 Error processing bus stops:", error)
    }
  }, [])

  // Filter dropdown options to avoid selecting the same stop for both From & To
  const filteredToStops = busStops.filter(stop => stop !== fromLocation)
  const filteredFromStops = busStops.filter(stop => stop !== toLocation)

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDate(false)
    if (selectedDate) {
      const today = new Date()
      if (selectedDate < today.setHours(0, 0, 0, 0)) {
        alert("🚨 You cannot select past dates.")
        return
      }
      setDate(selectedDate)
    }
  }

  const handleSearch = () => {
    if (!fromLocation || !toLocation) {
      alert("⚠️ Please select both From and To locations.")
      return
    }

    router.push({
      pathname: "/(user)/bus-list",
      params: {
        from: fromLocation,
        to: toLocation,
        date: date.toISOString()
      }
    })
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <CustomHeaderSafeView headerHref="/">
        <View className="relative h-1/3 mb-4">
          <CustomBackground />
          <Text className="absolute top-1/2 left-6 text-white text-3xl font-bold w-48">
            Bus Management System
          </Text>
        </View>

        {/* Scrollable View for DropDownPicker */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, alignItems: "center", paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* From Location Dropdown */}
          <View className="flex w-[80%] z-50 mb-4">
            <DropDownPicker
              open={openFrom}
              value={fromLocation}
              items={filteredFromStops.map((stop) => ({ label: stop, value: stop }))}
              setOpen={setOpenFrom}
              setValue={setFromLocation}
              placeholder="Select From"
              style={{ backgroundColor: "white" }}
              dropDownContainerStyle={{ backgroundColor: "#fff" }}
              listMode="MODAL"
            />
          </View>

          {/* To Location Dropdown */}
          <View className="flex w-[80%] z-40 mb-4">
            <DropDownPicker
              open={openTo}
              value={toLocation}
              items={filteredToStops.map((stop) => ({ label: stop, value: stop }))}
              setOpen={setOpenTo}
              setValue={setToLocation}
              placeholder="Select To"
              style={{ backgroundColor: "white" }}
              dropDownContainerStyle={{ backgroundColor: "#fff" }}
              listMode="MODAL"
            />
          </View>

          {/* Date Picker */}
          <TouchableOpacity
            className="flex w-[80%] px-6 py-4 rounded-md flex-row items-center gap-4 bg-slate-400 mb-4"
            onPress={() => setShowDate(true)}
          >
            <Image source={CalenderIcon} />
            <Text className="text-2xl">{date.toDateString()}</Text>
          </TouchableOpacity>

          {showDate && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              minimumDate={new Date()} // Prevent past dates
              onChange={handleDateChange}
            />
          )}

          <CustomButton onPress={handleSearch}>Search</CustomButton>
        </ScrollView>
      </CustomHeaderSafeView>
    </KeyboardAvoidingView>
  )
}

export default UserHome
