import axios from "axios";

const api=axios.create({
    baseURL:process.env.EXPO_PUBLIC_API_URL,
    withCredentials:true
})

api.interceptors.request.use((config)=>{
    return config
},
(error)=>Promise.reject(error)
)


api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`, {
            withCredentials: true,
          });
          return api(originalRequest); 
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
  
export default api