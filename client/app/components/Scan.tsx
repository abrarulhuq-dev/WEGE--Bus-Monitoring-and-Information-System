import React, { useState, useEffect, useRef } from "react";
import { View, Text, Alert, ActivityIndicator, Image } from "react-native";
import { CameraView, useCameraPermissions, Camera } from "expo-camera";
import { useRouter } from "expo-router"; // ✅ Importing router for navigation
import CustomButton from "./CustomButton";
import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api";

const QRScanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [scannedQR, setScannedQR] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isUsed, setIsUsed] = useState(false); // ✅ Track if QR has been used
  const cameraRef = useRef(null);
  const router = useRouter(); // ✅ Use router for navigation

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleCapture = async () => {
    if (!cameraRef.current || isUsed) {
      Alert.alert("❌ Error", isUsed ? "This QR code has already been used." : "Camera not ready");
      return;
    }

    try {
      setScannedQR(null);
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedPhoto(photo.uri);
      console.log("📸 Captured Image:", photo.uri);

      if (!Camera.scanFromURLAsync) {
        console.error("🚨 scanFromURLAsync is not available in this environment.");
        Alert.alert("Error", "QR scanning is not supported on this device.");
        return;
      }

      const result = await Camera.scanFromURLAsync(photo.uri, ["qr"]);
      console.log("🔍 QR Scan Result:", result);

      if (!result || !result[0]?.data) {
        Alert.alert("❌ No QR Found", "No QR code detected in the image.");
        return;
      }

      const extractedQR = result[0].data;
      console.log("✅ Extracted QR Code:", extractedQR);

      if (extractedQR && !scannedQR) {
        setScannedQR(extractedQR);
        verifyQRCode(extractedQR);
      }
    } catch (error) {
      console.error("❌ Capture Error:", error);
      Alert.alert("❌ Error", "Failed to capture or scan QR code.");
    }
  };

  const verifyQRCode = async (qrData) => {
    setLoading(true);
    console.log("📡 Sending extracted QR for verification...");

    try {
      const response = await axios.post(`${BASE_URL}/booking/verify`, { scannedQRCode: qrData });
      console.log("✅ API Response:", response.data);

      if (response.data?.isSuccess) {
        Alert.alert("🎉 Success", "Ticket verified successfully!", [
        ]);
      } else {
        Alert.alert( response.data.message );
      }
    } catch (error) {
      console.error("❌ Verification Error:", error);
      Alert.alert("Error", "Failed to verify ticket.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setScannedQR(null);
    setIsUsed(false); // ✅ Allow new scan
  };

  if (!permission) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-lg text-white text-center mb-4">We need camera access</Text>
        <CustomButton isPrimary={true} onPress={requestPermission}>
          <Text>Grant Permission</Text>
        </CustomButton>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {!isUsed && !capturedPhoto ? (
        <View className="h-[50vh] w-full">
          <CameraView ref={cameraRef} className="w-full h-full" facing="back">
            <View className="flex h-full"></View>
          </CameraView>
        </View>
      ) : (
        <View className="h-[50vh] w-full flex justify-center items-center">
          {!isUsed ? (
            <Image source={{ uri: capturedPhoto }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <Text className="text-lg text-white">QR Code Already Used</Text>
          )}
        </View>
      )}

      <View className="h-[30vh] flex justify-center items-center space-y-4">
        {!isUsed && !capturedPhoto && (
          <CustomButton isPrimary={true} onPress={handleCapture}>
            <Text>Capture</Text>
          </CustomButton>
        )}
        {capturedPhoto && !isUsed && (
          <CustomButton isPrimary={false} onPress={handleRetake}>
            <Text>Retake</Text>
          </CustomButton>
        )}
      </View>
    </View>
  );
};

export default QRScanner;
