import axios from "axios";
import { LoginProps } from "../interface/Login";

const baseURL = process.env.EXPO_PUBLIC_API_URL;
export const loginService = async (data: LoginProps) => {

    try {
        const response = await axios.post(`${baseURL}/auth/login`, { ...data });
        
        return { message: response.data.message, success: true,role:response.data.role,name:response.data.name,username:response.data.username,userId:response.data.userId }

    } catch (error: any) {
        console.log("login error is",JSON.stringify(error,null,2));
        
        return { message: error.response.data.message || "Something went wrong", success: false }
    }


}