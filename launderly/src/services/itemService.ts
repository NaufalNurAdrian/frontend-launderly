// services/itemService.ts
import api from "@/libs/api";
import { ItemApiResponse } from "@/types/laundryItem.type";

// Get all items
export const getItem = async (): Promise<ItemApiResponse> => {
  try {
    const response = await api.get<ItemApiResponse>(`/item`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch laundry item:", error.response?.data || error.message);
    throw Error("Failed to fetch laundry item");
  }
};

// Define Item interface
export interface Item {
  id?: string;
  itemName: string;
  qty?: number; // Make qty optional since backend may not require it
  createdAt?: string;
  updatedAt?: string;
  isDelete?: boolean;
}

// Create API service for items
export const itemService = {
  // Create a new item
  createItem: async (item: Item) => {
    try {
      const response = await api.post<Item>(`/item/create`, {
        itemName: item.itemName,
        qty: item.qty
      });
      return response.data;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  },

  // Update an existing item
  updateItem: async (item: Item) => {
    if (!item.id) {
      throw new Error('Item ID is required for update');
    }
    try {
      const response = await api.patch<Item>(`/item/update`, {
        id: item.id,
        itemName: item.itemName,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  // Delete an item
  deleteItem: async (id: string) => {
    try {
      const response = await api.patch<Item>(`/item/delete`, {id: id});
      return response.data;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }
};

export default itemService;