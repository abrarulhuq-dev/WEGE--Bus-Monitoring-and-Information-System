import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomBookingHeader from "../components/CustomBookingHeader";
import axios from "axios";
import { io } from "socket.io-client";
import formatDateToDDMMYYYY from "../utils/formatDate";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";

// Load environment variables
const socketUrl = process.env.EXPO_PUBLIC_SOCKET_URL;
const baseUrl = process.env.EXPO_PUBLIC_API_URL;

// Debug environment variables
console.log("🔗 API URL:", baseUrl);
console.log("🔗 Socket URL:", socketUrl);

const Tracking = () => {
   
  const [stoplist, setStopList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [incidentMessage, setIncidentMessage] = useState("");

  useEffect(() => {
    console.log("🟢 useEffect running... Initializing WebSocket");

    if (!socketUrl || !baseUrl) {
      console.error("❌ WebSocket or API URL is undefined! Check your .env file.");
      return;
    }

    const socket = io(socketUrl, {
      transports: ["websocket"], // Ensure WebSocket connection
      reconnection: true, // Enable auto-reconnect
      reconnectionAttempts: 5, // Retry up to 5 times
      reconnectionDelay: 3000, // 3 seconds delay before retrying
    });

    // Fetch stop list
    const fetchStopList = async () => {
      try {
        const response = await axios.get(`${baseUrl}/location`);
        console.log("✅ Stop List Fetched:", response.data);
        
        if (response.data?.locations) {
          setStopList(response.data.locations);
        }
      } catch (error) {
        console.error("❌ Error fetching stop list:", error);
        alert("Error occurred while fetching stop list");
      } finally {
        setLoading(false);
      }
    };

    fetchStopList();

    // WebSocket Connection Events
    socket.on("connect", () => {
      console.log("✅ WebSocket connected:", socket.id);
      socket.emit("set_role", "user"); // Ensure user is registered on the server
    });

    socket.on("connect_error", (error) => {
      console.error("❌ WebSocket connection error:", error.message);
    });

    socket.on("connect_timeout", () => {
      console.error("❌ WebSocket connection timed out");
    });

    // Listen for stop status updates
    socket.on("update_stop_status", (updatedStop) => {
      console.log("🔄 Stop updated:", updatedStop);
      setStopList((prevStops) =>
        prevStops.map((stop) =>
          stop._id === updatedStop._id ? { ...stop, ...updatedStop } : stop
        )
      );
    });

    // Incident Report Event
    socket.on("incident_alert", () => {
      console.log("🚨 Incident Report:");
      setIncidentMessage("Bus unavailable.");
    });

    socket.on("disconnect", () => {
      console.log("❌ WebSocket disconnected.");
    });

    // Cleanup function
    return () => {
      console.log("🔴 useEffect cleanup: Removing WebSocket listeners");
      socket.disconnect();
    };
  }, []);

  return (
    <SafeAreaView className="flex flex-1">
      {/* Header */}
      <CustomBookingHeader
        headerHref="/(user)/user-home"
        from=""
        to=""
        date={formatDateToDDMMYYYY(new Date())}
      />
      <Text className="mt-2 text-xl font-semibold text-center">Live Tracking</Text>

      {/* Incident Report */}
      {incidentMessage ? (
        <View style={styles.incidentContainer}>
          <Text style={styles.incidentText}>🚨 {incidentMessage}</Text>
        </View>
      ) : null}

      {/* Stop List / Bus Unavailable */}
      <ScrollView className="flex mt-2 bg-gray-300">
        {loading ? (
          <Text className="text-center mt-4">Loading stops...</Text>
        ) : stoplist.length === 0 ? (
          <Text className="text-center mt-4 text-red-600 text-lg font-bold">
            🚫 Bus Unavailable
          </Text>
        ) : (
          stoplist.map((stop) => (
            <View key={stop._id} style={styles.stopCard}>
              <Text style={styles.stopName}>{stop.name}</Text>
              <Text
                style={[
                  styles.stopStatus,
                  stop.status === "reached" ? styles.reached : styles.notReached,
                ]}
              >
                {stop.status === "reached" ? "Reached ✅" : "Not Reached ❌"}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  stopCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  stopName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  stopStatus: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    padding: 5,
    borderRadius: 5,
    textAlign: "center",
    width: 120,
  },
  reached: {
    backgroundColor: "#4CAF50", // Green
    color: "white",
  },
  notReached: {
    backgroundColor: "#F44336", // Red
    color: "white",
  },
  incidentContainer: {
    backgroundColor: "#ffcc00",
    padding: 10,
    margin: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  incidentText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default Tracking;
