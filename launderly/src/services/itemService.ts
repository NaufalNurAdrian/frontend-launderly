import api from "@/libs/api";
import { ItemApiResponse } from "@/types/laundryItem.type";


export const getItem = async (): Promise<ItemApiResponse> => {
    try {
      const response = await api.get<ItemApiResponse>(`/item`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch laundry item:", error.response?.data || error.message);
      throw Error("Failed to fetch laundry item");
    }
  };