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

interface OrderResult {
  id: number;
  orderNumber: string;
  orderStatus: string;
  weight: number;
  laundryPrice: string;
  createdAt: string
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
      <div className="flex flex-col items-center gap-6 w-full">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            My Orders <span>🧺</span>
          </h1>
        </div>

        {/* Tabel Orders */}
        <div className="w-full max-w-[800px]">
          <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200 bg-white">
            {loading ? (
              <p className="text-center py-6 text-gray-500">
                Loading orders...
              </p>
            ) : error ? (
              <p className="text-center py-6 text-red-500">{error}</p>
            ) : orders.length > 0 ? (
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-gray-100 text-xs md:text-sm text-gray-700">
                    <TableHead className="text-center w-16">No.</TableHead>
                    <TableHead>Order Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead className="text-center">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order, index) => (
                    <TableRow
                      key={order.id}
                      className="hover:bg-gray-50 text-xs md:text-sm"
                    >
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell>{order.orderNumber}</TableCell>
                      <TableCell>{PickupStatus(order.orderStatus)}</TableCell>
                      <TableCell>{order.weight} kg</TableCell>
                      <TableCell>{order.laundryPrice}</TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <button className="text-blue-500 hover:underline">
                          View Details
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
