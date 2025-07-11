import { View, Text, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomBookingHeader from '../components/CustomBookingHeader';
import formatDateToDDMMYYYY from '../utils/formatDate';
import PassengerCard from '../components/PassengerCard';
import CustomButton from '../components/CustomButton';
import { useLocalSearchParams, router } from 'expo-router';

const Book = () => {
  const date = new Date();
  const params = useLocalSearchParams();

  const { busId, fare, departureTime, arrivalTime, from, to } = params;

  const [passengers, setPassengers] = useState([{ id: Date.now(), name: '', age: '', gender: '' }]);

  const handleAddPassenger = () => {
    const lastPassenger = passengers[passengers.length - 1];

    if (!lastPassenger.name || !lastPassenger.age || !lastPassenger.gender) {
      Alert.alert('Error', 'Please fill in all passenger details before adding another.');
      return;
    }

    setPassengers([...passengers, { id: Date.now(), name: '', age: '', gender: '' }]);
  };

  const handleBookTicket = () => {
    if (passengers.some(passenger => !passenger.name || !passenger.age || !passenger.gender)) {
      Alert.alert('Error', 'Please fill in all passenger details before booking.');
      return;
    }

    router.push({
      pathname: '/(user)/payment',
      params: { 
        passengers: JSON.stringify(passengers),
        busId,
        fare,
        departureTime,
        arrivalTime,
        from,
        to
      }
    });
  };

  return (
    <SafeAreaView className='flex flex-1'>
      <CustomBookingHeader 
        headerHref='/(user)/bus-list' 
        from={from || ''} 
        to={to || ''} 
        date={formatDateToDDMMYYYY(date)}
      />

      <Text className='mt-2 text-xl font-bold text-center'>Book</Text>

      {/* Bus Details Section */}
      <View className="bg-white p-4 rounded-md shadow-md mx-4 mt-4">
        <Text className="text-lg font-bold text-center">Bus Details</Text>
        <Text>Bus Number: {busId || 'N/A'}</Text>
        <Text>Departure Time: {departureTime || 'N/A'}</Text>
        <Text>Arrival Time: {arrivalTime || 'N/A'}</Text>
        <Text>Fare: {fare || 'N/A'}</Text>
      </View>

      <ScrollView className='mt-2 bg-gray-300' contentContainerStyle={{ justifyContent: 'space-between', gap: 20 }}>
        {passengers.map((passenger, index) => (
          <PassengerCard key={passenger.id} passenger={passenger} setPassengers={setPassengers} index={index} />
        ))}

        <View className='mb-40 gap-4'>
          <CustomButton onPress={handleAddPassenger}>Add Passenger</CustomButton>
          <CustomButton isPrimary={true} onPress={handleBookTicket}>
            Book Ticket
          </CustomButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Book;
