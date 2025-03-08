import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

export async function fetchAttendanceHistory(token: string, page: number, sortBy: string, order: "asc" | "desc") {
  try {
    const res = await axios.get(`${BASE_URL}/attendance/history/?page=${page}&sortBy=${sortBy}&order=${order}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error : any) {
    toast.error("Fetch failed: " + error.message);
    throw error;
  }
}

export async function fetchAllAttendanceHistory(token: string, page: number, sortBy: string, order: "asc" | "desc", filter: string, outletId: number) {
  try {
    const res = await axios.get(`${BASE_URL}/attendance/all-history/?page=${page}&sortBy=${sortBy}&order=${order}&role=${filter}&outletId=${outletId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error : any) {
    toast.error("Fetch failed: " + error.message);
    throw error;
  }
}

export async function fetchAttendanceStatus(token: string): Promise<{ status: string }> {
  try {
    const initialRes = await axios.get(`${BASE_URL}/attendance/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const initialData = initialRes.data;

    if (initialData.data.length === 0) {
      return { status: "INACTIVE" };
    }

    const lastPage = initialData.pagination.totalPages;

    const lastPageRes = await axios.get(`${BASE_URL}/attendance/history?page=${lastPage}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const lastPageData = lastPageRes.data;

    const lastAttendance = lastPageData.data[lastPageData.data.length - 1].attendanceStatus;

    return { status: lastAttendance };
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Failed to fetch attendance status");
    throw error;
  }
}

export async function clockOut(token: string) {
  try {
    const res = await axios.patch(`${BASE_URL}/attendance/check-out`, {}, { headers: { Authorization: `Bearer ${token}` } });
    return res.data;
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Failed to clock out");
  }
}
