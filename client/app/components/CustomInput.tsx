import { View, Text, TextInput } from 'react-native';
import React from 'react';
import { Controller } from 'react-hook-form';

interface CustomInputProps {
  title: string;
  control: any; // From `useForm`
  rules?: object; // Validation rules for the input
}

const CustomInput: React.FC<CustomInputProps> = ({ title, control, rules }) => {
  return (
    <View className="relative flex justify-between gap-4 px-2">
      <Text className="text-white font-semibold text-xl capitalize">Enter {title}</Text>
      <Controller
        control={control}
        name={title.replace(/\s+/g, '')} // Remove spaces for the name
        rules={rules}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <>
            <TextInput
              className="py-1 px-2 bg-black text-2xl text-white"
              placeholder={`Enter your ${title}`}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {error && <Text className="text-red-500 text-sm">{error.message}</Text>}
          </>
        )}
      />
    </View>
  );
};

export default CustomInput;
