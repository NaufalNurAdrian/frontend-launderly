import api from '@/libs/api';
import {  OutletApiResponse, OutletById } from '@/types/outlet.type';

export const fetchAllOutlet = async (): Promise<OutletApiResponse> => {
    try {
      const response = await api.get<OutletApiResponse>('/outlet/');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch employees');
    }
  };

  export const getOutletById = async (id: number): Promise<OutletById> => {
    try {
      const response = await api.get<OutletById>(`/outlet/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch outlet:", error.response?.data || error.message);
      throw Error("Failed to fetch outlet details");
    }
  };
  
  