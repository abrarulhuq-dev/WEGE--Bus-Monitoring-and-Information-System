import axios from "axios";
import { BaseUserProps } from "../interface/Register";

const baseURL = process.env.EXPO_PUBLIC_API_URL;

export const registerService = async (data: BaseUserProps) => {
    try {
        console.log("reached register");
        const response = await axios.post(`${baseURL}/auth/register`, data);
        return { success: true, message: response.data.message };
    } catch (error: any) {
        console.log("error is",error);
        return {
            success: false,
            
            message: error.response?.data?.message || "Something went wrong",
        };
    }
};
