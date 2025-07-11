const fs = require("fs");

// Load the JSON file
const filePath = "bus_routes.json";
const updatedFilePath = "bus_routes_updated.json";

// Estimated distances (in km) for known routes
const estimatedDistances = {
    "Pathanamthitta - Adoor": 20,
    "Pathanamthitta - Kollam": 45,
    "Pathanamthitta - Thiruvananthapuram": 100,
    "Pathanamthitta - Pandalam": 15,
    "Adoor - Kollam": 35,
    "Pandalam - Kollam": 30
};

// Function to calculate fare based on distance
const calculateFare = (distance) => {
    const baseFare = 10;
    const perKmRate = 1;
    return distance <= 1 ? baseFare : baseFare + (distance - 1) * perKmRate;
};

// Read the JSON file
fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }

    let busData = JSON.parse(data);

    // Update fare for each route
    busData.forEach((bus) => {
        let route = bus.Route;
        let distance = estimatedDistances[route] || 20; // Default to 20 km if not found
        bus.Fare = `${calculateFare(distance)} Rs`;
    });

    // Save updated data
    fs.writeFile(updatedFilePath, JSON.stringify(busData, null, 4), (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return;
        }
        console.log("Updated bus fares saved to", updatedFilePath);
    });
});
