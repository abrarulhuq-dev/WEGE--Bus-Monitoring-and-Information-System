import React from 'react';
import { Text, Button, View } from 'react-native';
import { Controller } from 'react-hook-form';
import * as DocumentPicker from 'expo-document-picker';

interface CustomFileInputProps {
  control: any;
  title: string;
  name: string;
  rules?: object;
  error?: any; // Added error prop to display validation errors
}

const CustomFileInput: React.FC<CustomFileInputProps> = ({ control, title, name, rules, error }) => {
  const handleFilePick = async (setValue: Function) => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf', // Only allow PDF files
      });
      

      if (!res.canceled) {
        // Here, `res.assets[0]` contains the file details
        // Update the value for the file input field with the file object (name, uri, etc.)
        setValue(res.assets[0].name); 
      } else {
        console.log('Document selection was cancelled');
      }
    } catch (err) {
      console.log('Error picking document:', err);
    }
  };

  return (
    <View>
      <Text>{title}</Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <View>
            <Button
              title="Choose PDF"
              onPress={() => handleFilePick(onChange)}
            />
           
              <Text>File selected: {value}</Text>
            
            {error && <Text style={{ color: 'red' }}>{error.message}</Text>} 
          </View>
        )}
      />
    </View>
  );
};

export default CustomFileInput;
