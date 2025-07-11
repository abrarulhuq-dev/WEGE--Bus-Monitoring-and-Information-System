import { View, Text, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomInput from '@/app/components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useForm } from 'react-hook-form';
import CustomBackground from '../components/CustomBackground';
import CustomHeaderSafeView from '../components/CustomHeaderSafeView';
import { ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { RegisterUserProps } from '../interface/Register';
import { registerService } from '../services/registerService';
import { useToast } from '../components/Toast';




const Register = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterUserProps>({
    defaultValues: {
      username: "",
      password: "",
      confirmpassword: "",
      phone: "",
      name: ""
    }
  });

  const toast = useToast()



  const validateConfirmPassword = (value: string) =>
    value === control._formValues.password || 'Passwords do not match';

  const handlePress = async (data: RegisterUserProps) => {
    const { confirmpassword, ...finaldata } = data;
    const result = await registerService(finaldata);
    if (!result.success) {
      return toast.error(result.message);
    }
    toast.success(result.message);
    router.replace("/(auth)/login")
  };

  return (
    <View className='flex flex-1'>
      <CustomBackground />
      <CustomHeaderSafeView headerHref="/" className="flex flex-1">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <SafeAreaView>
              <Text className="text-4xl font-bold text-center text-white mb-10">Register</Text>
              <View className="flex justify-between gap-8">
                <CustomInput
                  control={control}
                  title="name"
                  rules={{ required: 'Name is required' }}
                />
                <CustomInput
                  control={control}
                  title="phone"

                  rules={{ required: 'Phone is required' }}
                />
                <CustomInput
                  control={control}
                  title="username"
                  rules={{
                    required: 'Username is required',
                    pattern: {

                      message: 'Enter a valid email',
                    },
                  }}
                />
                <CustomInput
                  control={control}
                  title="password"
                  rules={{
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  }}
                />
                <CustomInput
                  control={control}
                  title="confirm password"
                  rules={{
                    required: 'Confirm Password is required',
                    validate: validateConfirmPassword,
                  }}
                />
              </View>
              {Object.keys(errors).length > 0 && (
                <View className="mt-4">
                  <Text className="text-red-500 text-sm ">
                    Please fix the errors above before proceeding.
                  </Text>
                </View>
              )}
            </SafeAreaView>
            <CustomButton onPress={handleSubmit(handlePress)}>Register</CustomButton>
            <Text className='text-center text-white mt-6'>
              Already have a account
              <Link href={'/(auth)/login'} className='text-blue-400 font-semibold'> Login</Link>
            </Text>

          </ScrollView>
        </KeyboardAvoidingView>
      </CustomHeaderSafeView>
    </View>
  );
};

export default Register;
