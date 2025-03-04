"use client";

import React, { useEffect, useState } from "react";
import CreateRequestOrderDialog from "../_components/CreateRequestOrder";
import { getUserRequestOrder } from "@/api/order";
import { PickupStatus } from "@/types/request";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/feat-1/table";

interface OrderResult {
  id: number;
  pickupNumber: string;
  pickupStatus: string;
  totalPrice: number;
  pickupAddress: string;
  createdAt: string;
  address: {
    addressLine: string;
  };
}

const RequestOrderPage = () => {
  const [orders, setOrders] = useState<OrderResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserRequestOrder();
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
    <div className="flex flex-col items-center gap-6 w-[400px] md:w-full px-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          Request Order <span>🧺</span>
        </h1>
      </div>

      {/* Create Order Button */}
      <div className="w-full max-w-[900px] flex justify-end">
        <CreateRequestOrderDialog onRequestOrderCreated={fetchUserOrders} />
      </div>

      {/* Tabel Orders - Responsif */}
      <div className="w-full max-w-[900px] md:max-w-full border border-gray-200 bg-white shadow-md rounded-lg overflow-hidden">
        <div className="max-h-[500px] md:max-h-none overflow-y-auto md:overflow-visible">
          {loading ? (
            <p className="text-center py-6 text-gray-500">Loading orders...</p>
          ) : error ? (
            <p className="text-center py-6 text-red-500">{error}</p>
          ) : orders.length > 0 ? (
            <Table className="min-w-[700px] w-full">
              <TableHeader>
                <TableRow className="bg-blue-100 text-xs md:text-sm text-gray-700">
                  <TableHead className="text-center w-12 px-3 py-2">
                    No.
                  </TableHead>
                  <TableHead className="px-3 py-2 text-left">
                    Order Number
                  </TableHead>
                  <TableHead className="px-3 py-2 text-left">Status</TableHead>
                  <TableHead className="px-3 py-2 text-left">
                    Pickup Address
                  </TableHead>
                  <TableHead className="px-3 py-2 text-left">
                    Order Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-gray-50 text-xs md:text-sm border-t"
                  >
                    <TableCell className="text-center px-3 py-2">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-3 py-2">
                      {order.pickupNumber}
                    </TableCell>
                    <TableCell className="px-3 py-2">
                      {PickupStatus(order.pickupStatus)}
                    </TableCell>
                    <TableCell className="px-3 py-2">
                      {order.address?.addressLine}
                    </TableCell>
                    <TableCell className="px-3 py-2">
                      {new Date(order.createdAt).toLocaleDateString()}
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

export default RequestOrderPage;
