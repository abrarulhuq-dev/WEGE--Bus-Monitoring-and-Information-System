const userServices = require("../services/UserServices");
const securityUtils = require("../utils/securityUtils");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwtutils");
const path = require("path");
const Model=require("../models/Models")


const register = async (req, res, next) => {
    try {
        const { username, password, name, phone } = req.body;
        const hashedPassword = await securityUtils.hashPassword(password);
        const userExist = await userServices.getUser(username);
        const role = req.role ? req.role : "user"; // Ensure role is assigned
        console.log("role is", req.role);

        if (userExist.isSuccess) {
            return res.status(409).json({ message: "User already registered" });
        }

        const response = await userServices.addUser(username, hashedPassword, name, phone, role);

        if (!response.isSuccess) {
            return res.status(401).json({ message: response.message });
        }
        console.log("user is ",response)
        //
        return { isSuccess: true, data: response.user };

    } catch (error) {
        next(error);
    }
};

const registerDriver = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "ID proof (image) is required" });
        }
        req.role = "driver";

        // Construct file URL for ID proof
        const fileUrl = `/uploads/${req.file.filename}`;

        // ✅ Call register() and get user data
        const userResponse = await register(req, res, next);
        if (!userResponse || !userResponse.isSuccess) {
            return res.status(400).json({ message: "User registration failed" });
        }

        console.log("User registered", userResponse, fileUrl);

        // ✅ Save driver details with userId and image URL
        const newDriver = await userServices.addDriver(userResponse.data._id, fileUrl);
        if (!newDriver.isSuccess) {
            return res.status(401).json({ message: newDriver.message });
        }

        return res.status(201).json({ message: "Driver registered successfully", fileUrl });
    } catch (error) {
        next(error);
    }
};


const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username or password cannot be empty" });
        }

        const userResponse = await userServices.getUser(username);
        
        if (!userResponse.isSuccess) {
            return res.status(401).json({ message: userResponse.message });
        }
        
        const user = userResponse.data.user;
        const isVerified = await securityUtils.comparePassword(password, user.password);
        
        console.log(isVerified);
        if (!isVerified) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

    

        return res.status(200).json({ message: "Login successful", accessToken,role:user.role,refreshToken,name:user.name,username,userId:user._id });
    } catch (error) {
        next(error);
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ message: "Please login again" });
        }

        const response = await userServices.refresh(refreshToken);
        if (!response.isSuccess) {
            return res.status(401).json({ message: response.message });
        }

        return res.status(200).json({ message: response.message, accessToken: response.token });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params; // Get user ID from request params
        const response = await userServices.deleteUser(id);
        if (!response.isSuccess) {
            return res.status(404).json({ message: response.message });
        }

        return res.status(200).json({ message: response.message });
    } catch (error) {
        next(error);
    }
};
const getAllUsers = async (req, res, next) => {
    try {
        const response = await userServices.getAllUsers();
        if (!response.isSuccess) {
            return res.status(500).json({ message: response.message });
        }

        return res.status(200).json({ users: response.data });
    } catch (error) {
        next(error);
    }
};

const getAllDrivers = async (req, res, next) => {
    try {
        // Fetch all drivers and populate the `userId` field from the User model
        const drivers = await Model.Driver.find().populate('userId', 'name phone username');

        if (!drivers || drivers.length === 0) {
            return res.status(404).json({ isSuccess: false, message: "No drivers found" });
        }

        console.log("Fetched drivers:", drivers);

        // Format the response, handling cases where `userId` is null
        const formattedDrivers = drivers.map(driver => ({
            _id: driver.userId ? driver.userId._id : null, // Handle null userId
            name: driver.userId ? driver.userId.name : "Unknown",
            phone: driver.userId ? driver.userId.phone : "N/A",
            username: driver.userId ? driver.userId.username : "Unknown",
            idProof: driver.idProof, // Include idProof
        }));

        res.status(200).json({ isSuccess: true, drivers: formattedDrivers });
    } catch (error) {
        console.error("Error fetching drivers:", error);
        res.status(500).json({ isSuccess: false, message: "Error retrieving drivers" });
    }
};



module.exports = { login, register, registerDriver, refreshToken, logout,deleteUser ,getAllDrivers,getAllUsers};
