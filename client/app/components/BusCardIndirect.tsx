import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import busData from '@/app/data/bus_routes.json';
import TrackItem from './TrackItem';

interface BusCardIndirectProps {
  from: string;
  to: string;
  hasDirect: boolean;
}

const buildGraph = () => {
  const graph: { [key: string]: Set<string> } = {};
  busData.forEach(bus => {
    const stops = bus["Main Stops"];
    for (let i = 0; i < stops.length; i++) {
      if (!graph[stops[i]]) graph[stops[i]] = new Set();
      if (i > 0) graph[stops[i]].add(stops[i - 1]);
      if (i < stops.length - 1) graph[stops[i]].add(stops[i + 1]);
    }
  });
  return graph;
};

const bfsFindPath = (graph: any, start: string, end: string) => {
  if (!graph[start] || !graph[end]) return null;
  const queue = [[start]];
  const visited = new Set();
  while (queue.length) {
    const path = queue.shift();
    const node = path[path.length - 1];
    if (node === end) return path;
    if (!visited.has(node)) {
      visited.add(node);
      graph[node].forEach(neighbor => {
        queue.push([...path, neighbor]);
      });
    }
  }
  return null;
};

const getIndirectBuses = (from: string, to: string) => {
  const graph = buildGraph();
  const shortestPath = bfsFindPath(graph, from, to);
  if (!shortestPath || shortestPath.length < 3) return null;
  
  let busSegments = [];
  for (let i = 0; i < shortestPath.length - 1; i++) {
    const segmentFrom = shortestPath[i];
    const segmentTo = shortestPath[i + 1];

    const matchingBuses = busData.filter(bus => {
      const stops = bus["Main Stops"];
      return stops.includes(segmentFrom) && stops.includes(segmentTo);
    });

    if (matchingBuses.length === 0) return null;

    busSegments.push({ from: segmentFrom, to: segmentTo, buses: matchingBuses });
  }

  return { busSegments };
};

const BusCardIndirect: React.FC = () => {
  const params = useLocalSearchParams();
  const from = params.from || "";
  const to = params.to || "";
  const hasDirect = params.hasDirect === "true";

  if (!from || !to) {
    return (
      <View className="p-6">
        <Text className="text-red-500 text-center">⚠️ Error: Invalid locations selected.</Text>
      </View>
    );
  }

  const indirectRoute = getIndirectBuses(from, to);

  const handleBookNow = (bus: any) => {
    router.push({
      pathname: '/(user)/book',
      params: {
        busId: bus["Bus Number"],
        fare: bus["Fare"] || "299 Rs",
        departureTime: bus["Departure Time"],
        arrivalTime: bus["Arrival Time"],
        from,
        to
      }
    });
  };

  return (
    <ScrollView className="flex flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">Available Indirect Buses</Text>
      {hasDirect && (
        <View className="bg-yellow-300 p-3 mb-4 rounded-md">
          <Text className="text-black font-semibold text-center">
            ⚠️ Direct bus available! Check direct buses first.
          </Text>
        </View>
      )}
      {indirectRoute ? (
        <View className="bg-gray-300 p-4 mb-6 rounded-md shadow-lg">
          <Text className="text-lg font-semibold text-center mb-2">
            {from} → {to}
          </Text>
          <View className="bg-white p-4 rounded-md">
            {indirectRoute.busSegments.map((segment, index) => (
              <View key={index} className="mb-2 p-3 bg-gray-200 rounded-md shadow-sm">
                <Text className="text-center font-semibold text-gray-700">
                  {segment.from} → {segment.to}
                </Text>
                {segment.buses.map((bus, busIndex) => (
                  <TouchableOpacity
                    key={busIndex}
                    className="bg-blue-100 p-2 rounded-md mt-2"
                    onPress={() => handleBookNow(bus)}
                  >
                    <TrackItem
                      from={segment.from}
                      to={segment.to}
                      departureTime={bus["Departure Time"]}
                      arrivalTime={bus["Arrival Time"]}
                      fare={bus["Fare"] || "299 Rs"}
                    />
                    <Text className="text-center font-semibold text-blue-600 mt-2">Book Now</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
      ) : (
        <Text className="text-center text-lg text-red-500">
          ❌ No valid indirect route available.
        </Text>
      )}
    </ScrollView>
  );
};

export default BusCardIndirect;
