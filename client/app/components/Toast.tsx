import React, { createContext, useState, useContext, ReactNode } from "react";
import { View, Text, Image } from "react-native";

const successImage = require("@/assets/icons/bus.png");
const errorImage = require("@/assets/icons/busExit.png");

const ToastContext = createContext({
  success: (message: string) => {},
  error: (message: string) => {},
});

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ visible: boolean; type: "success" | "error"; message: string }>({
    visible: false,
    type: "success",
    message: "",
  });

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ visible: true, type, message });
    setTimeout(() => setToast({ visible: false, type: "success", message: "" }), 3000); // Hide after 3s
  };

  return (
    <ToastContext.Provider value={{ success: (msg) => showToast("success", msg), error: (msg) => showToast("error", msg) }}>
      <View style={{ flex: 1 }}>
        {children}
        {toast.visible && (
          <View className={`absolute z-50 top-10 left-1/2 transform -translate-x-1/2  p-4 rounded-lg shadow-lg flex flex-row items-center ${toast.type==="success"?"bg-green-300":"bg-red-300"}`}>
            <Image source={toast.type === "success" ? successImage : errorImage} className="w-6 h-6 mr-2" />
            <Text className="text-lg">{toast.message}</Text>
          </View>
        )}
      </View>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
