import api from "@/libs/api";
import { Order, OrderApiResponse } from "@/types/order.type";

export const fetchOrders = async (
  page: number = 1,
  searchQuery: string = "",
  filterOutlet: string = "",
  filterStatus: string = "",
  filterDate: string = "",
  filterCategory: string = "",
  filterCustomerName: string = "",
  itemsPerPage: number = 15
): Promise<OrderApiResponse> => {
  try {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("take", itemsPerPage.toString());
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
      `/orders/?${params.toString()}`
    );
    
    return response.data;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    throw new Error("Failed to fetch orders");
  }
};

interface CreateOrderData {
  orderNumber: string;
  weight: number;
  orderItem: { laundryItemId: string; qty: string }[];
}

export const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
  try {
    const response = await api.post<Order>(`/orders/create`, orderData);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to create order:",
    );
    throw Error("Failed to create order");
  }
};

export const bypassOrder = async (data: { orderWorkerId: number; action: string }) => {
  try {
    const response = await api.post(`/orders/bypass`, data);
    return response.data;
  } catch (error) {
    console.error("Bypass order error:");
    throw new Error("Failed to bypass order");
  }
};

