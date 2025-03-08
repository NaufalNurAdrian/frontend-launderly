import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

export async function getDriverHistory(token: string, page: number, sortBy: string, order: "asc" | "desc", filter: string, pageSize: number) {
  try {
    const res = await axios.get(`${BASE_URL}/request/?page=${page}&sortBy=${sortBy}&order=${order}&type=${filter}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to fetch";
    toast.error(errorMessage);
  }
}

export async function processDriverOrder(token: string, requestId: number, type: "pickup" | "delivery") {
  try {
    const res = await axios.patch(
      `${BASE_URL}/request`,
      { requestId: requestId, type: type },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to fetch";
    toast.error(errorMessage);
  }
}

export async function getDriverRequests(page: number, sortBy: string, order: "asc" | "desc", token: string, type: string) {
  try {
    const res = await axios.get(`${BASE_URL}/${type == "pickup" ? "pickup" : "delivery"}/?page=${page}&sortBy=${sortBy}&order=${order}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to fetch";
    toast.error(errorMessage);
  }
}
