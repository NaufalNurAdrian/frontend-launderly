import api from "@/libs/api";
import { Order, OrderApiResponse } from "@/types/order.type";

export const fetchOrders = async (
  page?: number,
  searchQuery?: string,
  filterOutlet?: string,
  filterStatus?: string,
  filterDate?: string,
  filterCategory?: string,
  filterCustomerName?: string
): Promise<OrderApiResponse> => {
  try {
    const params = new URLSearchParams();

    // Tambahkan parameter hanya jika tidak kosong
    params.append("page", page!.toString());
    params.append("take", "15");
    params.append("sortBy", "id");
    params.append("sortOrder", "desc");

    if (searchQuery) params.append("search", searchQuery);
    if (filterOutlet && filterOutlet !== "all")
      params.append("filterOutlet", filterOutlet);
    if (filterStatus && filterStatus !== "all")
      params.append("filterStatus", filterStatus);
    if (filterDate) params.append("filterDate", filterDate);
    if (filterCategory) params.append("filterCategory", filterCategory);
    if (filterCustomerName) params.append("customerName", filterCustomerName);

    const response = await api.get<OrderApiResponse>(
      `/order/?${params.toString()}`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch orders");
  }
};

export const createOrder = async (orderData: {
  orderNumber: string;
  weight: number;
  orderItem: { laundryItemId: number; qty: number }[];
}): Promise<Order> => {
  try {
    const response = await api.post<Order>(`/order/create`, orderData);
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to create order:",
      error.response?.data || error.message
    );
    throw Error("Failed to create order");
  }
};

export const bypassOrder = async (data: { orderWorkerId: number; action: string }) => {
  try {
    const response = await api.post(`/order/bypass`, data);
    return response.data;
  } catch (error: any) {
    console.error("Bypass order error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to bypass order");
  }
};

