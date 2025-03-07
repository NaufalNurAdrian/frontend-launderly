"use client";

import { IRequestOrderForm } from "@/types/request";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

function getToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("No token found. Please log in again.");
    return null;
  }
  return token;
}

export async function getUserRequestOrder() {
  try {
    const token = getToken();
    const response = await axios.get(`${BASE_URL}/pickupOrder`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error Fetching address:", error);
    throw error;
  }
}

export async function getUserOrders(userId: number) {
  try {
    const token = getToken();
    const response = await axios.get(`${BASE_URL}/pickupOrder/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
}

export async function getOutletNearby(latitude: number, longitude: number) {
  try {
    const token = getToken();
    const response = await axios.get(`${BASE_URL}/pickupOrder/nearby-outlet`, {
      params: { latitude, longitude },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error Fetching nearby outlets:", error);
    throw error;
  }
}

export async function createRequestOrder(orderData: IRequestOrderForm) {
  try {
    const token = getToken();
    const response = await axios.post(`${BASE_URL}/pickupOrder`, orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating request order:", error);
    throw error;
  }
}
