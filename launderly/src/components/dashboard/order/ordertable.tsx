"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderApiResponse } from "@/types/order.type";
import { fetchOrders } from "@/services/orderService";
import ModalCreateOrder from "./modalcreateorder";

export default function OrderTable({
  searchQuery,
  filterOutlet,
  filterStatus,
  filterDate,
  filterCategory,
  filterCustomerName,
}: {
  searchQuery: string;
  filterOutlet: string;
  filterStatus: string;
  filterDate: string;
  filterCategory: string;
  filterCustomerName: string;
}) {
  const [orders, setOrders] = useState<OrderApiResponse>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(
    null
  );

  const handleOpenModal = (orderNumber: string) => {
    setSelectedOrderNumber(orderNumber);
    setModalOpen(true);
  };

  useEffect(() => {
    const getOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchOrders(
          page,
          searchQuery,
          filterOutlet,
          filterStatus,
          filterDate,
          filterCategory,
          filterCustomerName
        );
        setOrders(data);
        setTotalPages(data?.getOrder?.totalPages || 1);
      } catch (err) {
        setError("Failed to load orders.");
      } finally {
        setIsLoading(false);
      }
    };

    getOrders();
  }, [
    page,
    searchQuery,
    filterOutlet,
    filterStatus,
    filterDate,
    filterCategory,
    filterCustomerName,
  ]);

  return (
    <div className="bg-white shadow-lg rounded-xl m-5">
      {isLoading ? (
        <p className="text-center py-5">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-5">{error}</p>
      ) : (
        <div className="p-5">
          {/* Desktop View: Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableCaption>Recent Orders</TableCaption>
              <TableHeader>
                <div className="bg-white shadow-lg rounded-xl">
                  <div className="flex justify-between items-center bg-gray-200 p-3 rounded-t-xl">
                    <h2 className="font-semibold text-gray-700 text-lg sm:text-xl">
                      Recent Order
                    </h2>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead></TableHead>
                </TableRow>
                  </div>
                </div>
              </TableHeader>
              <TableBody>
                {orders?.getOrder.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>{order.pickupOrder.user.fullName}</TableCell>
                    <TableCell>{order.orderStatus}</TableCell>
                    <TableCell>
                      Rp {order.laundryPrice + order.pickupOrder.pickupPrice}
                    </TableCell>
                    <TableCell>
                      {order.orderStatus === "ARRIVED_AT_OUTLET" && (
                        <button
                          onClick={() => handleOpenModal(order.orderNumber)}
                          className="bg-sky-600 px-3 py-1 text-white rounded-xl"
                        >
                          Create Order
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile View: Cards */}
          <div className="md:hidden space-y-3">
            {orders?.getOrder.orders.map((order) => (
              <div key={order.id} className="border p-3 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">
                  Order #{order.orderNumber}
                </p>
                <p className="text-lg font-semibold">
                  {order.pickupOrder.user.fullName}
                </p>
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  <span className="font-medium">{order.orderStatus}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Total:{" "}
                  <span className="font-medium">
                    Rp {order.laundryPrice} * {order.pickupOrder.pickupPrice}
                  </span>
                </p>
                {order.orderStatus === "ARRIVED_AT_OUTLET" && (
                  <button
                    onClick={() => handleOpenModal(order.orderNumber)}
                    className="bg-sky-600 px-3 py-1 text-white rounded-xl"
                  >
                    Create Order
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4 text-sm md:text-base">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-3 py-2 border rounded-md ${
                page === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-200"
              }`}
            >
              Previous
            </button>

            <p>
              Page {page} of {totalPages}
            </p>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-3 py-2 border rounded-md ${
                page === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-200"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
      {isModalOpen && selectedOrderNumber && (
        <ModalCreateOrder
          orderNumber={selectedOrderNumber}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
