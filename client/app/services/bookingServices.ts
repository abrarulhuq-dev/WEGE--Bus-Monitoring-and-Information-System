import axios from 'axios';

const baseUrl=process.env.EXPO_PUBLIC_API_URL;

export const bookTicket = async (data: any) => {
  try {
    const response = await axios.post(`${baseUrl}/booking/book`, data);
    return { success: true, ticketId: response.data.ticketId };
  } catch (error) {
    console.error("Booking API error:", error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || "Booking failed" };
  }
};
