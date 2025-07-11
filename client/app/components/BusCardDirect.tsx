import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import busRoutes from '@/app/data/bus_routes.json';

interface BusCardDirectProps {
  from: string;
  to: string;
}

const getDirectBuses = (from: string, to: string) => {
  return busRoutes.filter(bus => {
    const stops = bus["Main Stops"];
    const fromIndex = stops.indexOf(from);
    const toIndex = stops.indexOf(to);
    return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex; // Ensures valid order
  });
};

const BusCardDirect: React.FC = () => {
  const { from, to } = useLocalSearchParams<BusCardDirectProps>(); 
  const directBuses = getDirectBuses(from, to);

  const handleBookNow = (bus: any) => {
    router.push({
      pathname: '/(user)/book',
      params: {
        busId: bus["Bus Number"],
        fare: bus["Fare"] || "1000 Rs",
        departureTime: bus["Departure Time"],
        arrivalTime: bus["Arrival Time"],
        from,
        to
      }
    });
  };

  return (
    <View className="flex flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">Available Direct Buses</Text>
      {directBuses.length > 0 ? (
        directBuses.map((bus, index) => (
          <TouchableOpacity 
            key={index} 
            className="flex bg-gray-400 py-4 px-2 rounded-sm mb-4"
            onPress={() => handleBookNow(bus)}
          >
            <View className="flex flex-row justify-between">
              <Text className="text-lg">{bus["Departure Time"]} - {bus["Arrival Time"]}</Text>
              <Text className="font-semibold text-lg">{bus["Fare"] || "1000 Rs"}</Text>
            </View>
            <Text className="mt-6 text-3xl">{bus["Bus Number"] || "Unknown Bus"}</Text>
            <Text className="text-lg text-gray-700">{bus["Bus Type"] || "Standard"} | {bus["Operator"] || "Unknown Operator"}</Text>
            <Text className="text-center text-blue-600 font-semibold mt-2">Book Now</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text className="text-center text-lg text-red-500">No direct buses available</Text>
      )}
    </View>
  );
};

export default BusCardDirect;
