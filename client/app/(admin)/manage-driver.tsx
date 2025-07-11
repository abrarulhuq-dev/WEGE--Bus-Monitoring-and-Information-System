import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserCard from '../components/UserCard';
import axios from 'axios';

// API Endpoint
const API_URL = process.env.EXPO_PUBLIC_API_URL + "/auth"; // Ensure this is correctly set

const ManageDriver = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch drivers from the backend (memoized to prevent infinite loops)
  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/drivers`);
      if (response.status === 200) {
        setDrivers(response.data.drivers); 
      } else {
        Alert.alert("Error", "Failed to fetch drivers");
      }
    } catch (error) {
      console.error("Error fetching drivers:", JSON.stringify(error,null,2));
      Alert.alert("Error", "Could not retrieve driver data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  // Function to delete a driver (no confirmation here)
  const handleDeleteDriver = (id: string) => {
    setDrivers((prevDrivers) => prevDrivers.filter((driver) => driver._id !== id));
  };


  return (
    <SafeAreaView className="flex flex-1 bg-gray-100">
      <View className="bg-blue-600 py-4 shadow-md">
        <Text className="text-3xl text-white text-center font-bold">Manage Drivers</Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center bg-gray-100">
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : (
        <FlatList
          data={drivers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <UserCard role='driver' key={item._id} {...item} onDelete={handleDeleteDriver} />} // Direct delete
          contentContainerStyle={{ padding: 10 }}
          ListEmptyComponent={<Text className="text-center text-lg text-gray-600 mt-4">No drivers found</Text>}
        />
      )}
    </SafeAreaView>
  );
};

export default ManageDriver;
