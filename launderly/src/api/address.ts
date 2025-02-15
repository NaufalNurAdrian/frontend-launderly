"use client";

import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

interface UserResult {
  fullname: string;
  email: string;
}

interface AddressResult {
  user: UserResult;
  addressLine: string;
  city: string;
  isPrimary: boolean;
  latitude: string;
  longitude: string;
  id: number;
}

export async function createUserAddress(payload: Partial<AddressResult>) {
  try {
    const response = await axios.post(`${BASE_URL}/address`, payload, {
      withCredentials: true,
    });
    toast.success(response.data?.message || "Create Address Success!");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error(error.response?.data || error.message);
    } else {
      toast.error("An unexpected error occurred.");
    }
    throw error;
  }
}

export async function getAddressById(id: number) {
  try {
    const response = await axios.get(`${BASE_URL}/address/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error fetching address:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error fetching address.");
    }
    throw error;
  }
}

export async function deleteUserAddress(id: number) {
  try {
    await axios.delete(`${BASE_URL}/address/${id}`, {
      withCredentials: true,
    });
    toast.success("Delete Address Success!");
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || "Failed to delete address");
      console.error(error.response?.data || error.message);
    } else {
      toast.error("An unexpected error occurred.");
    }
    throw error;
  }
}

export async function createAddressByCoord(id: number, payload: Partial<Address>) {
    try {
      const response = await axios.patch(`${BASE_URL}/user/profile/${id}`, payload, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating address by coordinates:", error);
      throw error;
    }
  }
