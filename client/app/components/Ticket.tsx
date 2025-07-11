import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import formatTime from '../utils/formatTime';
import formatDateToDDMMYYYY from '../utils/formatDate';
import axios from 'axios';
import busData from '@/app/data/bus_routes.json';
import { useFocusEffect } from '@react-navigation/native';

const busIcon = require("@/assets/icons/bus.png");
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api";

const TicketList = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/booking/${userId}`);
      console.log("API Response:", response.data);

      if (response.data && response.data.tickets) {
        setTickets(response.data.tickets);
        
      } else {
        console.error("Failed to fetch tickets:", response.data.message);
        setTickets([]);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTickets();
    }, [])
  );

  const getBusDetails = (busId) => {
    const bus = busData.find((bus) => bus["Bus Number"] === busId);
    if (!bus) return { from: "Unknown", to: "Unknown", departureTime: "N/A", arrivalTime: "N/A" };
    
    return {
      from: bus["Main Stops"][0],
      to: bus["Main Stops"].slice(-1)[0],
      departureTime: bus["Departure Time"] || "N/A",
      arrivalTime: bus["Arrival Time"] || "N/A"
    };
  };

  const handlePress = (ticket) => {
    const busDetails = getBusDetails(ticket.busId);

    router.push({
      pathname: "/(user)/ticket-detail",
      params: {
        ticketId: ticket._id,
        busId: ticket.busId,
        fare: ticket.fare,
        date: ticket.bookingDate,
        status: ticket.isUsed ? "Used" : "Confirmed",
        passengers: JSON.stringify(ticket.passengers),
        from: busDetails.from,
        to: busDetails.to,
        departureTime: busDetails.departureTime,
        arrivalTime: busDetails.arrivalTime,
        qrCode: ticket.qrCode
      }
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" className="mt-10" />;
  }

  return (
    <ScrollView className="p-4">
      <Text className="text-2xl font-bold text-center mb-4">My Tickets</Text>

      {tickets.length > 0 ? (
        tickets.map((ticket) => {
          const bookingDate = new Date(ticket.bookingDate);
          const busDetails = getBusDetails(ticket.busId);

          return (
            <TouchableOpacity 
              key={ticket._id} 
              className="flex flex-row justify-around bg-gray-200 mx-4 mt-4 rounded-md shadow-sm" 
              activeOpacity={0.7} 
              onPress={() => handlePress(ticket)}
            >
              <View className="bg-red-400 w-[40%] flex items-center py-4">
                <Image source={busIcon} className="h-14 w-14" />
                <Text className="mt-2 text-xl">{formatDateToDDMMYYYY(bookingDate)}</Text>
                <View className="mt-2 w-full h-0.5 bg-black"></View>
                <Text className="mt-4">{formatTime(bookingDate)}</Text>
              </View>

              <View className="w-[60%] flex justify-around px-2">
                <View className="flex flex-row justify-between mt-4">
                  <Text className="text-lg">Bus Ticket</Text>
                  <Text className={`text-lg ${ticket.isUsed ? "text-red-400" : "text-green-400"}`}>
                    {ticket.isUsed ? "Used" : "Confirmed"}
                  </Text>
                </View>
                <Text className="text-2xl">{ticket.busId}</Text>    
                <Text className="text-lg">From: {busDetails.from} → To: {busDetails.to}</Text>
                <Text className="text-lg">Departure: {busDetails.departureTime} | Arrival: {busDetails.arrivalTime}</Text>
                <Text className="text-lg">Fare: {ticket.fare} Rs</Text>
              </View>
            </TouchableOpacity>
          );
        })
      ) : (
        <Text className="text-center text-red-500 mt-10">No tickets found.</Text>
      )}
    </ScrollView>
  );
};

export default TicketList;
