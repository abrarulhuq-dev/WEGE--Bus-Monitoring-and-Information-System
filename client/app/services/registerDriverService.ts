import axios from "axios";

const baseApi = process.env.EXPO_PUBLIC_API_URL; 

export const registerDriverService = async (userData: Record<string, any>, file: any) => {
  const formData = new FormData();

  // Append user data
  Object.entries(userData).forEach(([key, value]) => {
    formData.append(key, value);
  });

  // Ensure file is correctly formatted
  if (file) {
    formData.append("idProof", {
      uri: file.uri,
      type: file.mimeType || "image/jpeg",
      name: file.fileName || `idProof_${Date.now()}.jpg`,
    });
  }

  // Debugging - Log formData
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  try {
    const response = await axios.post(`${baseApi}/auth/registerdriver`, formData,{
      headers:{
        "Content-Type":"multipart/form-data"
      }
    });

    return { data: response.data, status: response.status };
  } catch (error: any) {
    console.error("Error in registerDriverService:", JSON.stringify(error, null, 2));
    throw error;
  }
};