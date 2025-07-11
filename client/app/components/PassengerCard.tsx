import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import React from 'react';
import RNPickerSelect from 'react-native-picker-select';

const PassengerCard = ({ passenger, setPassengers, index }) => {
  const handleInputChange = (field, value) => {
    setPassengers(prevPassengers => {
      const updatedPassengers = [...prevPassengers];
      updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
      return updatedPassengers;
    });
  };

  const handleAgeChange = (text) => {
    const numericAge = parseInt(text, 10);

    if (!text) {
      handleInputChange('age', ''); // Allow empty input
    } else if (!isNaN(numericAge) && numericAge >= 1 && numericAge <= 100) {
      handleInputChange('age', numericAge.toString());
    } else {
      Alert.alert('Invalid Age', 'Age must be between 1 and 100.');
    }
  };

  const handleRemovePassenger = () => {
    setPassengers(prevPassengers => {
      if (prevPassengers.length === 1) {
        Alert.alert('Error', 'At least one passenger is required.');
        return prevPassengers;
      }
      return prevPassengers.filter((_, i) => i !== index);
    });
  };

  return (
    <View className="p-4 bg-gray-200 rounded-md shadow-md mb-4">
      <Text className="font-bold text-lg mb-2">Passenger {index + 1}</Text>

      <TextInput
        className="border p-2 rounded-md mb-2"
        placeholder="Enter Name"
        value={passenger.name}
        onChangeText={text => handleInputChange('name', text)}
      />

      <TextInput
        className="border p-2 rounded-md mb-2"
        placeholder="Enter Age"
        value={passenger.age}
        keyboardType="numeric"
        onChangeText={handleAgeChange}
        maxLength={3} 
      />

      <Text className="text-black">Gender</Text>
      <RNPickerSelect
        onValueChange={value => handleInputChange('gender', value)}
        items={[
          { label: 'Male', value: 'Male' },
          { label: 'Female', value: 'Female' }
        ]}
        placeholder={{ label: 'Select Gender', value: null }}
        value={passenger.gender}
        style={{
          inputIOS: { padding: 10, borderWidth: 1, borderColor: '#ff0000', borderRadius: 5, marginBottom: 10 },
          inputAndroid: { padding: 10, borderWidth: 1, borderColor: '#ff0000', borderRadius: 5, marginBottom: 10 }
        }}
      />

      {/* Remove Passenger Button */}
      <TouchableOpacity 
        onPress={handleRemovePassenger} 
        className="bg-red-500 p-2 rounded-md mt-2"
      >
        <Text className="text-white text-center font-bold">Remove Passenger</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PassengerCard;
