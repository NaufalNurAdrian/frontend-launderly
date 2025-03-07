"use client";

import { IAddress } from "@/types/address";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

function getToken() {
  if (typeof window === "undefined") {
    return null; // Mencegah error saat SSR
  }
  const token = window.localStorage.getItem("token");
  if (!token) {
    toast.error("No token found. Please log in again.");
    return null;
  }
  return token;
}

export async function getUserAddresses() {
  const token = getToken();
  if (!token) return null; // Hentikan eksekusi jika token tidak ada

  try {
    const response = await axios.get(`${BASE_URL}/address/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching address:", error);

    // Menampilkan error ke user
    toast.error("Failed to fetch addresses. Please try again.");

    return null; // Mengembalikan null agar tidak crash
  }
}

export async function getOutletAddress() {
  try {
    const response = await axios.get(`${BASE_URL}/address/outlet`, {});
    return response;
  } catch (error) {
    console.error("Error Fetching address:", error);
    throw error;
  }
}

export async function createUserAddress(payload: Partial<IAddress>) {
  try {
    const token = localStorage.getItem("token");
    console.log("Token in Frontend:", token);

    const response = await axios.post(`${BASE_URL}/address`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Headers being sent:", response.config.headers);

    toast.success(response.data?.message || "Create Address Success!");
    return response.data;
  } catch (error) {
    console.error("Error creating address:", error);
    throw error;
  }
}

export async function getAddressById(id: number) {
  try {
    const response = await axios.get(`${BASE_URL}/address/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching address:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error fetching address.");
    }
    throw error;
  }
}

export async function deleteUserAddress(id: number) {
  try {
    const token = getToken();
    if (!token) return;

    await axios.delete(`${BASE_URL}/address/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    toast.success("Delete Address Success!");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete address";
      toast.error(errorMessage);
      console.error(error.response?.data || error.message);
    } else {
      toast.error("An unexpected error occurred.");
      console.error(error);
    }
  }
}

export async function createAddressByCoord(
  id: number,
  payload: Partial<IAddress>
) {
  try {
    const response = await axios.patch(
      `${BASE_URL}/user/profile/${id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating address by coordinates:", error);
    throw error;
  }
}

export async function updateUserAddress(
  id: number,
  payload: Partial<IAddress>
) {
  try {
    const token = getToken();
    const response = await axios.patch(`${BASE_URL}/address/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    toast.success(response.data?.message || "Update Address Success!");
    return response.data;
  } catch (error) {
    throw error;
  }
}
