import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Alert from "../components/Alert";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = process.env.EXPO_PUBLIC_SOCKET_URL;

console.log("🔗 Socket URL:", SOCKET_SERVER_URL);

const AdminHome = () => {
  const [alerts, setAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!SOCKET_SERVER_URL) {
      console.error("❌ SOCKET_SERVER_URL is not defined. Check your environment variables.");
      return;
    }

    console.log("🔄 Attempting WebSocket connection...");
    const socket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
      reconnection: true, // Enable auto-reconnect
      reconnectionAttempts: 5, // Retry up to 5 times
      reconnectionDelay: 3000, // 3-second delay before retrying
    });

    socket.on("connect", () => {
      console.log("✅ WebSocket connected:", socket.id);
      setIsConnected(true);
      socket.emit("set_role", "admin");
    });

    socket.on("connect_error", (error) => {
      console.error("❌ WebSocket connection error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ WebSocket disconnected:", reason);
      setIsConnected(false);
    });



    // Listen for real-time bus alerts
    socket.on("incident_report", (alert) => {
      
      console.log("🚨 Incident received:", alert);
      setAlerts((prevAlerts) => [...prevAlerts, alert]);
    });

    return () => {
      console.log("🛑 Cleaning up WebSocket...");
      socket.disconnect();
    };
  }, []);



  return (
    <SafeAreaView className="px-2">
      <View className="bg-gray-300">
        <Text className="text-3xl text-center font-bold">Alerts</Text>
        <Text className="text-center text-sm">{isConnected ? "🟢 Connected" : "🔴 Disconnected"}</Text>
      </View>
      <ScrollView className="mt-4 flex h-full" contentContainerStyle={{ justifyContent: "space-between" }}>
        {alerts.length === 0 ? (
          <Text className="text-center mt-4">No alerts available.</Text>
        ) : (
          alerts.map((item, index) => (
            <Alert key={index} message={item} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminHome;