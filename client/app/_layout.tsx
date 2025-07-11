import React, { createContext, useState } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import '../global.css';
import Toast, { ToastProvider } from './components/Toast';
import { AuthProvider } from './context/AuthContext';

export const ToastContext = createContext({
  showToast: (type: "success" | "error", message: string) => {},
});

const RootLayout = () => {
  const [toast, setToast] = useState({ visible: false, type: "success", message: "" });

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ visible: true, type, message });

    setTimeout(() => setToast({ visible: false, type, message: "" }), 3000); 
  };

  return (
    <AuthProvider>
    <ToastProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(admin)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(driver)" options={{ headerShown: false }} />
          <Stack.Screen name="(user)" options={{ headerShown: false }} />
        </Stack>
        {toast.visible && <Toast toastType={toast.type} content={toast.message} />}
    </ToastProvider>
      </AuthProvider>
  );
};

export default RootLayout;
