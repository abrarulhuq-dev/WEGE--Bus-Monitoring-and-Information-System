import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import QRCode from 'react-native-qrcode-svg'; // ✅ Import QR Code generator

const TicketDetail = () => {
  const params = useLocalSearchParams();
  const { ticketId, busId, fare, date, status, passengers, from, to, departureTime, arrivalTime } = params;
  const parsedPassengers = passengers ? JSON.parse(passengers) : [];

  return (
    <SafeAreaView className="flex flex-1 justify-around">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} className="mx-10">
        <Text className="text-2xl font-bold text-center mb-4">Ticket Details</Text>

        {/* ✅ Ticket Information */}
        <View className="mt-6 p-4 bg-gray-200 rounded-md shadow-md">
          <Text className="text-lg font-semibold">Bus Number: {busId || "N/A"}</Text>
          <Text className="text-lg">Fare: {fare} Rs</Text>
          <Text className={`text-lg ${status === "Used" ? "text-red-500" : "text-green-500"}`}>
            Status: {status}
          </Text>
        </View>

        <View className="items-center justify-start">
          {status==="Used"?"":
        <QRCode value={ticketId} size={200} />
          }
        <Text className="text-center mt-2 text-gray-500">Scan this QR Code for verification</Text>
      </View>

        {/* ✅ Show Passenger Details */}
        <View className="mt-4  bg-white p-4 rounded-md shadow-md">
          <Text className="text-lg font-semibold">Passengers:</Text>
          {parsedPassengers.map((passenger, index) => (
            <Text key={index} className="text-md">
              {index + 1}. {passenger.name} ({passenger.age}, {passenger.gender})
            </Text>
          ))}
        </View>
      </ScrollView>

    
    </SafeAreaView>
  );
};

export default TicketDetail;
