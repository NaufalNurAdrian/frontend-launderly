"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/feat-1/table";
import useSession from "@/hooks/useSession";
import { getUserOrders } from "@/api/order";
import { PickupStatus } from "@/types/request";
import { toTitleCase } from "@/helpers/toTitleCase";

interface OrderResult {
  id: number;
  orderNumber: string;
  orderStatus: string;
  weight: number;
  laundryPrice: string;
  createdAt: string;
}

const OrderPage = () => {
  const { user } = useSession();
  const [orders, setOrders] = useState<OrderResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserOrders(user?.id!);
      setOrders(response.data || []);
    } catch (err) {
      setError("Failed to fetch orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 w-full px-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          My Orders <span>🧺</span>
        </h1>
      </div>

      {/* Tabel Orders - Responsif */}
      <div className="w-full max-w-[900px] overflow-x-auto">
        <div className="shadow-md rounded-lg border border-gray-200 bg-white overflow-hidden">
          {loading ? (
            <p className="text-center py-6 text-gray-500">Loading orders...</p>
          ) : error ? (
            <p className="text-center py-6 text-red-500">{error}</p>
          ) : orders.length > 0 ? (
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-blue-100 text-xs md:text-sm text-gray-700">
                  <th className="text-center w-12 px-3 py-2">No.</th>
                  <th className="px-3 py-2 text-left">Order Number</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Weight</th>
                  <th className="px-3 py-2 text-left">Total Price</th>
                  <th className="px-3 py-2 text-left">Order Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 text-xs md:text-sm border-t"
                  >
                    <td className="text-center px-3 py-2">{index + 1}</td>
                    <td className="px-3 py-2">{order.orderNumber}</td>
                    <td className="px-3 py-2">
                      {toTitleCase(order.orderStatus)}
                    </td>
                    <td className="px-3 py-2">{order.weight} kg</td>
                    <td className="px-3 py-2">Rp.{order.laundryPrice}</td>
                    <td className="px-3 py-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-6 text-gray-500">
              No orders available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
