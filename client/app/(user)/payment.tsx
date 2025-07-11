import { View, Text, ScrollView, TextInput, Alert } from 'react-native';
import React, { useState, useMemo } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { bookTicket } from '../services/bookingServices';

const Payment = () => {
  const params = useLocalSearchParams();
  const passengers = params.passengers ? JSON.parse(params.passengers) : [];
  const [enteredUsername, setEnteredUsername] = useState('');

  const { username, userId } = useAuth(); // Fetch logged-in user details
  console.log("Logged-in username:", username, userId);

  // ✅ Calculate Total Payment
  const totalPayment = useMemo(() => {
    let fare = params.fare;
    if (typeof fare === "string") {
      fare = parseFloat(fare.replace(/[^0-9.]/g, "")); // Remove non-numeric characters
    }
    return isNaN(fare) || fare <= 0 ? 0 : fare * passengers.length; // ✅ Total cost = fare * num of passengers
  }, [params.fare, passengers.length]);

  const handleConfirmPayment = async () => {
    if (enteredUsername.trim() === '') {
      Alert.alert('Error', 'Please enter your username.');
      return;
    }

    if (enteredUsername !== username) {
      Alert.alert('Invalid Username', 'Entered username does not match the logged-in user.');
      return;
    }

    if (totalPayment <= 0) {
      Alert.alert('Error', 'Invalid total payment amount.');
      return;
    }

    try {
      const bookingData = {
        userId,
        busId: params.busId,
        fare: totalPayment, // ✅ Send total fare as a number
        bookingDate: new Date().toISOString(),
        passengers
      };

      console.log("Sending Booking Data:", bookingData); // Debugging Log

      const response = await bookTicket(bookingData);

      if (response.success) {
        Alert.alert('Payment Confirmed', `Your ticket has been booked successfully! Total Paid: rs${totalPayment}`, [
          { text: 'OK', onPress: () => router.replace('/(user)/booking') }
        ]);
      } else {
        Alert.alert('Booking Failed', response.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error("Booking error:", error);
      Alert.alert('Error', 'Failed to complete payment. Please try again.');
    }
  };

  return (
    <ScrollView className="p-4">
      <Text className="text-2xl font-bold text-center">Payment</Text>

      {passengers.length > 0 ? (
        passengers.map((passenger, index) => (
          <View key={index} className="p-4 bg-gray-200 rounded-md shadow-md mb-4">
            <Text className="text-lg font-bold">Passenger {index + 1}</Text>
            <Text>Name: {passenger.name}</Text>
            <Text>Age: {passenger.age}</Text>
            <Text>Gender: {passenger.gender}</Text>
          </View>
        ))
      ) : (
        <Text className="text-center text-red-500">No passengers found.</Text>
      )}

      {/* Total Payment Display */}
      <View className="mt-4 p-4 bg-green-200 rounded-md shadow-md">
        <Text className="text-xl font-bold text-center">Total Payment: Rs{totalPayment.toFixed(2)}</Text>
      </View>

      {/* Username Input for Payment Confirmation */}
      <View className="mt-4 mb-4">
        <Text className="text-lg font-bold">Enter Username for Payment Confirmation</Text>
        <TextInput
          className="border p-2 rounded-md mt-2"
          placeholder="Enter your username"
          value={enteredUsername}
          onChangeText={setEnteredUsername}
        />
      </View>

      {/* Confirm Payment Button */}
      <CustomButton isPrimary={true} onPress={handleConfirmPayment}>
        Confirm Payment
      </CustomButton>
    </ScrollView>
  );
};

export default Payment;
