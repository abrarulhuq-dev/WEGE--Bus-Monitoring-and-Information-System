import { View, Text } from "react-native";
import React from "react";

interface AlertProps {
  message: string;
}

const Alert: React.FC<AlertProps> = ({ message }) => {
  return (
    <View className="flex bg-red-400 gap-1 px-2 py-4">
      <Text className="text-lg">Bus</Text>
      <Text className="text-lg">⚠️ Message: {message}</Text>
    </View>
  );
};

export default Alert;
