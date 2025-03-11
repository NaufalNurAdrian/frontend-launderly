"use client";

import React, { useEffect, useState } from "react";
import useSession from "@/hooks/useSession";
import { getUserOrders } from "@/app/api/order";
import { confirmOrder } from "@/app/api/user";
import PayButton from "@/components/feat-1/payButton";
import { toast } from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/feat-1/table";
import OrderStatusBadge from "@/helpers/getColoursStatus";
import { OrderStatus } from "@/types/order.type";

interface OrderResult {
  id: number;
  orderNumber: string;
  orderStatus: string;
  weight: number;
  laundryPrice: number;
  createdAt: string;
  isPaid: boolean;
}

const OrderPage = () => {
  const { user } = useSession();
  const [orders, setOrders] = useState<OrderResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingOrderId, setConfirmingOrderId] = useState<number | null>(
    null
  );

  const fetchUserOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserOrders(user?.id!);
      const sortedOrders = (response.data || []).sort(
        (a: { id: number }, b: { id: number }) => a.id - b.id
      );
      setOrders(sortedOrders);
    } catch (err) {
      setError("Failed to fetch orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  // ✅ Function untuk handle Confirm Order
  const handleConfirmOrder = async (orderId: number) => {
    setConfirmingOrderId(orderId);

    try {
      await confirmOrder(orderId);
      toast.success("Order confirmed successfully!");

      fetchUserOrders();
    } catch (error) {
      toast.error("Failed to confirm order. Please try again.");
    } finally {
      setConfirmingOrderId(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-[400px] md:w-full px-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          My Orders <span>🧺</span>
        </h1>
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
                  <TableHead className="px-3 py-2 text-left">Weight</TableHead>
                  <TableHead className="px-3 py-2 text-left">
                    Laundry Price
                  </TableHead>
                  <TableHead className="px-3 py-2 text-left">
                    Delivery Price
                  </TableHead>
                  <TableHead className="px-3 py-2 text-left">
                    Total Price
                  </TableHead>
                  <TableHead className="px-3 py-2 text-left">
                    Order Date
                  </TableHead>
                  <TableHead className="px-3 py-2 text-left">Action</TableHead>
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
                      {order.orderNumber}
                    </TableCell>
                    <TableCell className="px-3 py-2">
                      <OrderStatusBadge
                        status={order.orderStatus as OrderStatus}
                      />
                    </TableCell>
                    <TableCell className="px-3 py-2">
                      {order.weight ? `${order.weight} Kg` : `TBA`}
                    </TableCell>
                    <TableCell className="px-3 py-2">
                      {order.laundryPrice ? `Rp.${order.laundryPrice}` : "TBA"}
                    </TableCell>

                    <TableCell className="px-3 py-2">Rp.5000</TableCell>

                    <TableCell className="px-3 py-2">
                      {order.laundryPrice
                        ? `Rp.${order.laundryPrice + 5000}`
                        : "-"}
                    </TableCell>

                    <TableCell className="px-3 py-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-3 py-2 flex gap-2">
                      {/* ✅ Button Confirm Order hanya muncul jika statusnya "RECEIVED_BY_CUSTOMER" */}
                      {order.orderStatus === "RECEIVED_BY_CUSTOMER" && (
                        <button
                          onClick={() => handleConfirmOrder(order.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded-md text-xs md:text-sm hover:bg-green-700 transition disabled:opacity-50"
                          disabled={confirmingOrderId === order.id}
                        >
                          {confirmingOrderId === order.id
                            ? "Confirming..."
                            : "Confirm Order"}
                        </button>
                      )}

                      {/* Jika belum dibayar, tampilkan tombol bayar */}
                      {order.isPaid ? (
                        <span className="text-green-600 font-semibold">
                          Already Paid
                        </span>
                      ) : order.laundryPrice > 0 ? (
                        <PayButton orderId={order.id} />
                      ) : null}
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
