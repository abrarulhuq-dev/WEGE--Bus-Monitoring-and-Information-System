import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomBackground from '../components/CustomBackground';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import CustomHeaderSafeView from '../components/CustomHeaderSafeView';
import { useForm } from 'react-hook-form';
import { Link, router } from 'expo-router';
import { LoginProps } from '../interface/Login';
import { loginService } from '../services/loginService';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext'; // Import AuthContext

const Login = () => {
  const toast = useToast();
  const { login } = useAuth(); // Use Auth Context

  const { control, handleSubmit, formState: { errors } } = useForm<LoginProps>({
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const handlePress = async (data: LoginProps) => {
    console.log(data);
    const result = await loginService(data);
    if (!result.success) {
      return toast.error(result.message);
    }

    toast.success(result.message);

    // Store username in AuthContext
    login(data.username,result.userId);

    console.log("user id is",result.userId);

    if (result.role === 'admin') {
      console.log("reached admin");
      router.replace("/(admin)/admin-home");
    } else if (result.role === 'driver') {
      router.replace("/(driver)/driver-home");
    } else {
      router.replace("/(user)/user-home");
    }
  };

  return (
    <View className='flex flex-1'>
      <CustomBackground />
      <CustomHeaderSafeView headerHref="/" className="flex flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className='flex flex-1'
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <SafeAreaView>
              <Text className="text-center font-bold text-4xl text-white mt-8">Login</Text>
              <View className="flex justify-between gap-8 mb-8">
                <CustomInput
                  control={control}
                  rules={{
                    required: "username is required",
                    pattern: {
                      message: "Enter a valid username",
                    },
                  }}
                  title="username"
                />
                <CustomInput
                  control={control}
                  rules={{ required: "password is required" }}
                  title="password"
                />
              </View>
              <CustomButton onPress={handleSubmit(handlePress)}>
                Login
              </CustomButton>
              <Text className='text-white text-center mt-6'>Don't have an account?</Text>
              <Link href='/(auth)/register' className='text-blue-200 font-semibold text-center'>Register</Link>
            </SafeAreaView>
          </ScrollView>
        </KeyboardAvoidingView>
      </CustomHeaderSafeView>
    </View>
  );
};

export default Login;
