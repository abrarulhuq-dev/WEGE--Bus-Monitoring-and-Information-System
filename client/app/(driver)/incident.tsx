import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';

const reasonList = ["breakdown", "accident", "other"];

const Incident = () => {
  const [active, setActive] = useState<number | null>(null);
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;

  const handleSubmit = async () => {
    if (active === null) {
      Alert.alert("Please select a reason before submitting.");
      return;
    }

    const selectedReason = reasonList[active];
    console.log("🚨 Reporting Incident:", selectedReason);

    try {
      const response = await axios.post(`${baseUrl}/notify/accident`, {
        message: selectedReason,
      });

      console.log("✅ Response:", response.data);
      Alert.alert("Incident reported successfully!");
    } catch (error) {
      console.error("❌ Error submitting incident:", JSON.stringify(error,null,2));
      Alert.alert("Failed to submit the incident. Please try again.");
    }
  };

  return (
    <SafeAreaView>
      <View className="bg-gray-300">
        <Text className="text-3xl text-center font-bold">Report Incident</Text>
      </View>

      <View className="mt-4 flex justify-between gap-2">
        {reasonList.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setActive(index)}
            className={twMerge(
              "flex flex-row justify-center items-center py-6",
              index === active ? "bg-green-400" : "bg-gray-400"
            )}
          >
            <Text className="text-xl font-bold capitalize">{item}</Text>
          </TouchableOpacity>
        ))}

        <CustomButton style="mt-6" onPress={handleSubmit} isPrimary={true}>
          Submit
        </CustomButton>
      </View>
    </SafeAreaView>
  );
};

export default Incident;
