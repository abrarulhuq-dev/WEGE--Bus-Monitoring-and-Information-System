import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const TrackingUpdate = () => {
  const [location, setLocation] = useState(null);
  const [stoplist, setStopList] = useState([]);
  const [trackingFinished, setTrackingFinished] = useState(false);

  // Fetch stop list from API
  useEffect(() => {
    const fetchStopList = async () => {
      try {
        const response = await axios.get(`${baseUrl}/location`);
        if (response.data && response.data.locations) {
          setStopList(response.data.locations);
          console.log("✅ Stop list fetched:", response.data.locations);
        }
      } catch (error) {
        console.error("❌ Error fetching stoplist:", error);
        alert("Error occurred while fetching stop list");
      }
    };

    fetchStopList();
  }, []);

  // Track live location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      const locationWatcher = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 2000, distanceInterval: 5 },
        (newLocation) => {
          setLocation(newLocation.coords);
          console.log("📍 Live Location Updated:", newLocation.coords);
        }
      );

      return () => locationWatcher.remove();
    })();
  }, []);

  // Function to update stop status in the backend
  const updateStopStatus = async (id) => {
    try {
      const response = await axios.post(`${baseUrl}/location/update-status`, { id });
      console.log(`✅ Stop ${id} marked as reached on server:`, response.data);
    } catch (error) {
      console.error(`❌ Error updating stop ${id}:`, JSON.stringify(error,null,2));
    }
  };

  // Check if driver is near any stop and update statuses
  useEffect(() => {
    if (!location || stoplist.length === 0 || trackingFinished) return;

    const updatedStops = stoplist.map((stop) => {
      const distance = getDistance(location.latitude, location.longitude, stop.latitude, stop.longitude);

      if (distance < 50 && stop.status !== "reached") {
        updateStopStatus(stop._id); // ✅ Call API when status changes to "reached"
        return { ...stop, status: "reached" };
      }
      return stop;
    });

    setStopList(updatedStops);
    console.log("🛑 Stop list updated:", updatedStops);

    // ✅ If all stops are reached, mark tracking as finished
    if (updatedStops.every((stop) => stop.status === "reached")) {
      setTrackingFinished(true);
      console.log("🚀 Tracking Finished!");
    }
  }, [location]);

  // Calculate distance between two coordinates
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  // Show loading until location is received
  if (!location) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Fetching Location...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {trackingFinished ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "green" }}>
            🎉 Tracking Finished!
          </Text>
        </View>
      ) : (
        <MapView
          provider={PROVIDER_DEFAULT}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05
          }}
          showsUserLocation={true}
        >
          {/* Driver's Current Location */}
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="You"
            description="Driver's Location"
            pinColor="blue"
          />

          {/* Stop Locations */}
          {stoplist.map((stop) =>
            stop.latitude && stop.longitude ? (
              <Marker
                key={stop._id}
                coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
                title={`Stop ${stop._id}`}
                pinColor={stop.status === "reached" ? "green" : "red"}
              />
            ) : null
          )}
        </MapView>
      )}
    </View>
  );
};

export default TrackingUpdate;
