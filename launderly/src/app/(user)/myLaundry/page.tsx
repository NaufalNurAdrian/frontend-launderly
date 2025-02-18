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
import CustomerSidebar from "@/components/ui/sidebar";
import CreateRequestOrderDialog from "./_components/CreateRequestOrder";

interface OrderResult {
  id: number;
  orderNumber: string;
  status: string;
  totalPrice: number;
  pickupAddress: string;
  createdAt: string;
}

const LaundryPage = () => {
  const { user } = useSession();
  const [orders, setOrders] = useState<OrderResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserOrders();
      // setOrders(data.orders || []);
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <CustomerSidebar />

      {/* Konten Utama */}
      <div className="flex-1 p-4 md:p-8 flex flex-col items-center gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            My Orders <span>🧺</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-2">
            View your laundry orders here.
          </p>
        </div>

        {/* Create Order Button */}
        <div className="w-full max-w-[800px] flex justify-end">
          <CreateRequestOrderDialog onRequestOrderCreated={fetchUserOrders}/>
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
                      <TableHead>Total Price</TableHead>
                      <TableHead>Pickup Address</TableHead>
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
                        <TableCell>{order.status}</TableCell>
                        <TableCell>Rp {order.totalPrice.toLocaleString()}</TableCell>
                        <TableCell>{order.pickupAddress}</TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
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
    </div>
  );
};

export default LaundryPage;
