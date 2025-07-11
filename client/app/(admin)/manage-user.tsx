import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserCard from '../components/UserCard';
import axios from 'axios';

// API Endpoint
const API_URL = process.env.EXPO_PUBLIC_API_URL + "/auth"; 

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      if (response.status === 200) {
        setUsers(response.data.users);
      } else {
        Alert.alert("Error", "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      Alert.alert("Error", "Could not retrieve user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to remove a user from the state after deletion
  const handleDeleteUser = (id: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
  };

  return (
    <SafeAreaView className="flex flex-1 bg-gray-100">
      <View className="bg-blue-600 py-4 shadow-md">
        <Text className="text-3xl text-white text-center font-bold">Manage Users</Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center bg-gray-100">
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <UserCard key={item._id} {...item} onDelete={handleDeleteUser} />}
          contentContainerStyle={{ padding: 10 }}
          ListEmptyComponent={<Text className="text-center text-lg text-gray-600 mt-4">No users found</Text>}
        />
      )}
    </SafeAreaView>
  );
};

export default ManageUser;
