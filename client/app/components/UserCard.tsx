import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import axios from 'axios';
import CustomButton from './CustomButton';

interface UserCardProps {
  _id: string;
  name: string;
  phone: string;
  username: string;
  role: string;
  onDelete: (id: string) => void; // Callback to update the UI
}

const API_URL = process.env.EXPO_PUBLIC_API_URL + "/auth"; // Ensure this is set

const UserCard: React.FC<UserCardProps> = ({ _id, name, phone, username, role, onDelete }) => {
  
  // Function to delete the user
  const handleDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await axios.delete(`${API_URL}/user/${_id}`);
              if (response.status === 200) {
                Alert.alert("Success", "User deleted successfully!");
                onDelete(_id); // Remove from UI
              } else {
                Alert.alert("Error", "Failed to delete user.");
              }
            } catch (error) {
              console.error("Error deleting user:", error);
              Alert.alert("Error", "Could not delete user.");
            }
          },
        },
      ]
    );
  };

  return (
    <View className="bg-white shadow-lg rounded-lg p-4 mb-4 border border-gray-200">
      <View>
        <Text className="text-lg font-semibold text-gray-900">👤 {name}</Text>
        <Text className="text-sm text-gray-600">📧 {username}</Text>
        <Text className="text-sm text-gray-600">📞 {phone}</Text>
      </View>

      <View className="flex-row justify-end mt-4 space-x-2">
        {role === "driver" && (
          <CustomButton style="bg-blue-500 px-4 py-2 rounded-lg shadow-sm" isPrimary={true}>
            <Text className="text-white text-sm font-semibold">View</Text>
          </CustomButton>
        )}
        <TouchableOpacity
          className="bg-red-500 px-4 py-2 rounded-lg shadow-sm"
          onPress={handleDelete}
        >
          <Text className="text-white text-sm font-semibold">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserCard;
