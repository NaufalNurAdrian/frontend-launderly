"use client";

import {  useEffect, useState } from "react";
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
import ModalBypassRequest from "@/components/dashboard/bypass/modalBypassRequest";

export default function BypassRequest() {
  const [orders, setOrders] = useState<OrderApiResponse>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOrderNumber, setSelectedOrderWorkerId] = useState<
    string | null
  >(null);
  const [orderWorkerId, setOrderWorkerId] = useState<number>(1);

  const handleOpenModal = (
    orderNumber: string | null,
    orderWorkerId: number,
  ) => {
    if (!orderNumber) {
      alert("Invalid order ID!");
      return;
    }
    setSelectedOrderWorkerId(orderNumber);
    setOrderWorkerId(orderWorkerId);
    setModalOpen(true);
  };

  useEffect(() => {
    const getOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchOrders(
          page,
        );

        // **Filter orders yang memiliki orderWorker dengan bypassRequest: true**
        const filteredOrders = data?.getOrder?.orders.filter((order) =>
          order.orderWorker.some((worker) => worker.bypassRequest === true)
        );

        setOrders({
          ...data,
          getOrder: { ...data.getOrder, orders: filteredOrders },
        });
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
  ]);

  return (
    <div className="bg-white shadow-lg rounded-xl m-5 p-5">
      {isLoading ? (
        <p className="text-center py-5 text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-5">{error}</p>
      ) : (
        <>
          {/* Desktop View: Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableCaption className="text-gray-500">
                Bypass Request Orders
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Worker Name</TableHead>
                  <TableHead>Bypass Note</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(orders?.getOrder?.orders ?? []).length > 0 ? (
                  orders?.getOrder.orders.map((order) => {
                    return order.orderWorker
                      .filter((worker) => worker.bypassRequest === true)
                      .map((worker) => (
                        <TableRow key={worker.id}>
                          <TableCell>{order.orderNumber}</TableCell>
                          <TableCell>
                            {order.pickupOrder?.user?.fullName || "N/A"}
                          </TableCell>
                          <TableCell>{order.orderStatus}</TableCell>
                          <TableCell>{worker.worker.user.fullName}</TableCell>
                          <TableCell>
                            {worker.bypassNote || "No Note"}
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() =>
                                handleOpenModal(
                                  order.orderNumber,
                                  worker.id,
                                )
                              }
                              className=" bg-sky-500 to-blue-700 px-4 py-2 text-white rounded-lg shadow-md hover:opacity-90 transition"
                            >
                              Bypass
                            </button>
                          </TableCell>
                        </TableRow>
                      ));
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No bypass requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile View: Cards */}
          <div className="md:hidden space-y-3">
            {(orders?.getOrder?.orders ?? []).length > 0 ? (
              orders?.getOrder.orders.map((order) => {
                return order.orderWorker
                  .filter((worker) => worker.bypassRequest)
                  .map((worker) => (
                    <div
                      key={worker.id}
                      className="border p-4 rounded-lg shadow-md bg-gray-50"
                    >
                      <p className="text-sm text-gray-500">
                        Order #{order.orderNumber}
                      </p>
                      <p className="text-lg font-semibold">
                        {order.pickupOrder?.user?.fullName || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Status:{" "}
                        <span className="font-medium">{order.orderStatus}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Worker Name:{" "}
                        <span className="font-medium">
                          {worker.worker.user.fullName}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Bypass Note:{" "}
                        <span className="font-medium">
                          {worker.bypassNote || "No Note"}
                        </span>
                      </p>
                      <button
                        onClick={() =>
                          handleOpenModal(
                            order.orderNumber,
                            worker.id,
                          )
                        }
                        className="mt-3 w-full bg-gradient-to-r from-sky-500 to-blue-700 px-4 py-2 text-white rounded-lg shadow-md hover:opacity-90 transition"
                      >
                        Bypass
                      </button>
                    </div>
                  ));
              })
            ) : (
              <p className="text-center text-gray-500 py-5">
                No bypass requests found.
              </p>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6 text-sm md:text-base">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 border rounded-md ${
                page === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-200"
              }`}
            >
              Previous
            </button>

            <p className="text-gray-600">
              Page {page} of {totalPages}
            </p>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-4 py-2 border rounded-md ${
                page === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-200"
              }`}
            >
              Next
            </button>
          </div>
          {isModalOpen && selectedOrderNumber && (
            <ModalBypassRequest
              orderNumber={selectedOrderNumber}
              onClose={() => setModalOpen(false)}
              orderWorkerId={orderWorkerId}
            />
          )}
        </>
      )}
    </div>
  );
}
