import { 
  View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity, Image, ActivityIndicator 
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { RegisterDriverProps } from "../interface/Register";
import { registerDriverService } from "../services/registerDriverService";

const AddDriver = () => {
  const { control, formState: { errors }, handleSubmit, setValue, reset } = useForm<RegisterDriverProps>();
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateConfirmPassword = (value: string) =>
    value === control._formValues.password || "Passwords do not match";

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "You need to grant camera roll permissions to upload an image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      setSelectedImage(image);
      setValue("idProof", image);
    }
  };

  const handlePress = async (data: RegisterDriverProps) => {
    const { confirmpassword,idProof, ...finalData } = data;

    if (!selectedImage) {
      Alert.alert("Error", "Please select an ID proof image.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await registerDriverService(finalData, selectedImage);
      
      if (response?.status >= 200 && response.status < 300) {
        Alert.alert("Success", "Driver has been registered successfully.");
        
        // ✅ Clear all fields after success
        reset();  
        setSelectedImage(null);  
      } else {
        Alert.alert("Failed", response?.message || "Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView>
      <View className="bg-gray-300">
        <Text className="text-3xl text-center font-bold">Add Driver</Text>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="bg-slate-500">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <SafeAreaView>
            <View className="flex justify-between gap-8">
              <CustomInput control={control} title="name" rules={{ required: "Name is required" }} />
              <CustomInput control={control} title="phone" rules={{ required: "Phone is required" }} />
              <CustomInput control={control} title="username" rules={{ required: "Username is required" }} />
              <CustomInput control={control} title="password" rules={{ required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } }} />
              <CustomInput control={control} title="confirm password" rules={{ required: "Confirm Password is required", validate: validateConfirmPassword }} />
            </View>

            {/* Image Picker */}
            <View className="mt-4">
              <TouchableOpacity onPress={pickImage} className="bg-blue-500 p-3 rounded-md">
                <Text className="text-white text-center">Pick an ID Proof Image</Text>
              </TouchableOpacity>
              {selectedImage && (
                <Image source={{ uri: selectedImage.uri }} style={{ width: 100, height: 100, marginTop: 10, alignSelf: "center" }} />
              )}
            </View>

            {Object.keys(errors).length > 0 && (
              <View className="mt-4">
                <Text className="text-red-500 text-sm">Please fix the errors above before proceeding.</Text>
              </View>
            )}
          </SafeAreaView>

          {/* Submit Button */}
          <CustomButton style="mb-52" onPress={handleSubmit(handlePress)} isDisabled={isSubmitting}>
            {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text>Register</Text>}
          </CustomButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddDriver;
