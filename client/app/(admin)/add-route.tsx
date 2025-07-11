import React, { useState } from "react";
import { 
  View, Text, Button, Alert, ActivityIndicator, ScrollView, 
  TouchableWithoutFeedback, Keyboard, StyleSheet, TextInput 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const AddRoute = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [region, setRegion] = useState({
    latitude: 9.2825292,
    longitude: 76.8188802,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const isDuplicate = (lat, lon) => {
    return locations.some((loc) => loc.latitude === lat && loc.longitude === lon);
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    if (isDuplicate(latitude, longitude)) {
      Alert.alert("Duplicate Entry", "This location is already added.");
      return;
    }

    setLocations((prev) => [...prev, { name: "", latitude, longitude, isAccident: false }]);

    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Enable location services in settings.");
        setLoading(false);
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = userLocation.coords;

      if (isDuplicate(latitude, longitude)) {
        Alert.alert("Duplicate Entry", "This location is already added.");
        setLoading(false);
        return;
      }

      setLocations((prev) => [...prev, { name: "", latitude, longitude, isAccident: false }]);

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } catch (error) {
      Alert.alert("Error", "Could not fetch location.");
    }
    setLoading(false);
  };

  const removeLocation = (index) => {
    setLocations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNameChange = (index, newName) => {
    setLocations((prev) =>
      prev.map((loc, i) => (i === index ? { ...loc, name: newName } : loc))
    );
  };

  const submitLocations = async () => {
    if (locations.length === 0) {
      Alert.alert("No Locations", "Please add at least one location before submitting.");
      return;
    }

    if (locations.some((loc) => loc.name.trim() === "")) {
      Alert.alert("Missing Name", "Please enter a name for all locations.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${baseUrl}/location/add`, { locations });
      Alert.alert("Success", "Locations submitted successfully!");
      setLocations([]);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
    setSubmitting(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="bg-blue-500 py-4 rounded-lg shadow-lg">
          <Text className="text-3xl text-center font-bold text-white">Add Routes</Text>
        </View>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={region}
            onPress={handleMapPress}
          >
            {locations.map((loc, index) => (
              <Marker key={index} coordinate={loc} title={loc.name || `Location ${index + 1}`} />
            ))}
          </MapView>
        </View>

        <View className="p-2">
          {loading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <Button title="Use Current Location" color="green" onPress={getCurrentLocation} />
          )}
        </View>
        <View className="p-2">
          {submitting ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <Button title="Submit Locations" color="blue" onPress={submitLocations} />
          )}
        </View>

        <ScrollView style={{ maxHeight: 300, paddingHorizontal: 16 }}>
          <Text className="text-lg font-semibold mb-2">Added Locations:</Text>

          {locations.length === 0 ? (
            <Text className="text-gray-500 text-center mt-2">No locations added.</Text>
          ) : (
            locations.map((item, index) => (
              <View key={index} className="p-3 bg-gray-200 mb-2 rounded-md">
                <TextInput
                  placeholder="Enter location name"
                  value={item.name}
                  onChangeText={(text) => handleNameChange(index, text)}
                  style={styles.input}
                />
                <Text className="text-gray-700">
                  Lat: {item.latitude.toFixed(4)}, Lon: {item.longitude.toFixed(4)}
                </Text>
                <Button title="Remove" color="red" onPress={() => removeLocation(index)} />
              </View>
            ))
          )}
        </ScrollView>

     
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    height: 250,
    borderRadius: 15,
    overflow: "hidden",
    marginHorizontal: 10,
    marginTop: 10,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
});

export default AddRoute;
