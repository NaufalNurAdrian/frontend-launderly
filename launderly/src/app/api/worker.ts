import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

export async function getWorkerHistory(token: string, page: number, sortBy: string, order: "asc" | "desc", pageSize: number) {
  try {
    const res = await axios.get(`${BASE_URL}/order/history/?&page=${page}&sortBy=${sortBy}&order=${order}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to fetch";
    toast.error(errorMessage);
  }
}

export async function getWorkerRequests(page: number, sortBy: string, order: "asc" | "desc", token: string) {
  try {
    const res = await axios.get(`${BASE_URL}/order/?page=${page}&sortBy=${sortBy}&order=${order}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to fetch";
    toast.error(errorMessage);
  }
}

export async function getWorkerRequest(orderId: any) {
  try {
    const res = await axios.get(`${BASE_URL}/order/orders/${orderId}`);
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to fetch";
    toast.error(errorMessage);
  }
}

export async function bypassRequest(token: string, notes: string, orderId: any) {
  try {
    const res = await axios.patch(
      `${BASE_URL}/bypass/${orderId}`,
      { bypassNote: notes },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to send Bypass Request";
    toast.error(errorMessage);
  }
}
