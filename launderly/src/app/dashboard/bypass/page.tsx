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
import { OrderApiResponse, OrderStatus } from "@/types/order.type";
import { fetchOrders } from "@/services/orderService";
import ModalBypassRequest from "@/components/dashboard/bypass/modalBypassRequest";
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  AlertCircleIcon, 
  ClockIcon,
  ShieldCheckIcon
} from "lucide-react";
import { withSuperAndOutletAdmin } from "@/hoc/adminAuthorizaton";

// Helper function to get status styles
const getStatusStyle = (status: keyof typeof statusStyles) => {
  const statusStyles = {
    'PROCESSING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'COMPLETED': 'bg-green-100 text-green-800 border-green-200',
    'PENDING': 'bg-blue-100 text-blue-800 border-blue-200',
    'CANCELLED': 'bg-red-100 text-red-800 border-red-200'
  };

  return statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};
function BypassRequest() {
  const [orders, setOrders] = useState<OrderApiResponse>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOrderNumber, setSelectedOrderWorkerId] = useState<string | null>(null);
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
        const data = await fetchOrders(page);

        // Filter orders with bypass requests
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
  }, [page]);

  // Loading State Component
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center p-10 space-y-4">
      <div className="animate-pulse w-16 h-16 bg-sky-200 rounded-full flex items-center justify-center">
        <ClockIcon className="w-10 h-10 text-sky-600" />
      </div>
      <p className="text-gray-600 animate-pulse">Loading bypass requests...</p>
    </div>
  );

  // Error State Component
  const ErrorState = () => (
    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg flex items-center space-x-4">
      <AlertCircleIcon className="w-10 h-10 text-red-500" />
      <div>
        <p className="text-red-800 font-semibold">Error</p>
        <p className="text-red-700">{error}</p>
      </div>
    </div>
  );

  // Desktop Table View
  const DesktopTableView = () => (
    <div className="hidden md:block overflow-x-auto">
      <Table className="bg-white shadow-md rounded-xl overflow-hidden">
        <TableCaption className="bg-gray-100 p-2 text-gray-600">
          Bypass Request Orders
        </TableCaption>
        <TableHeader className="bg-sky-50 border-b-2 border-sky-200">
          <TableRow>
            <TableHead className="text-sky-800 font-semibold tracking-wider uppercase text-sm">Order Number</TableHead>
            <TableHead className="text-sky-800 font-semibold tracking-wider uppercase text-sm">Customer Name</TableHead>
            <TableHead className="text-sky-800 font-semibold tracking-wider uppercase text-sm">Status</TableHead>
            <TableHead className="text-sky-800 font-semibold tracking-wider uppercase text-sm">Worker Name</TableHead>
            <TableHead className="text-sky-800 font-semibold tracking-wider uppercase text-sm">Bypass Note</TableHead>
            <TableHead className="text-sky-800 font-semibold tracking-wider uppercase text-sm">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(orders?.getOrder?.orders ?? []).length > 0 ? (
            orders?.getOrder.orders.map((order) => 
              order.orderWorker
                .filter((worker) => worker.bypassRequest === true)
                .map((worker) => (
                  <TableRow 
                    key={worker.id} 
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <TableCell className="font-medium text-gray-700">
                      #{order.orderNumber}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {order.pickupOrder?.user?.fullName || "N/A"}
                    </TableCell>
                    <TableCell>
                      <span 
                        className={`
                          inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium
                          border ${getStatusStyle(order.orderStatus as "COMPLETED" | "PROCESSING" | "CANCELLED" | "PENDING")}
                        `}
                      >
                        {order.orderStatus}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {worker.worker.user.fullName}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {worker.bypassNote || "No Note"}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleOpenModal(order.orderNumber, worker.id)}
                        className="
                          bg-sky-600 
                          text-white 
                          px-4 
                          py-2 
                          rounded-lg 
                          hover:bg-sky-700 
                          transition-colors 
                          flex 
                          items-center 
                          gap-2
                        "
                      >
                        <ShieldCheckIcon className="w-5 h-5" />
                        Bypass
                      </button>
                    </TableCell>
                  </TableRow>
                ))
            )
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                No bypass requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  // Mobile Card View
  const MobileCardView = () => (
    <div className="md:hidden space-y-4">
      {(orders?.getOrder?.orders ?? []).length > 0 ? (
        orders?.getOrder.orders.map((order) => 
          order.orderWorker
            .filter((worker) => worker.bypassRequest)
            .map((worker) => (
              <div
                key={worker.id}
                className="
                  bg-white 
                  border 
                  border-l-4 
                  border-l-sky-500 
                  rounded-lg 
                  shadow-sm 
                  p-4 
                  hover:shadow-md 
                  transition-shadow 
                  duration-300
                "
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm text-gray-500 tracking-wider">
                    Order #{order.orderNumber}
                  </p>
                  <span 
                    className={`
                      inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                      border ${getStatusStyle(order.orderStatus as "PROCESSING" | "COMPLETED" | "PENDING" | "CANCELLED")}
                    `}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-800 mb-1">
                  {order.pickupOrder?.user?.fullName || "N/A"}
                </p>
                <div className="space-y-1 mb-3">
                  <p className="text-sm text-gray-600">
                    Worker: <span className="font-medium">{worker.worker.user.fullName}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Bypass Note: <span className="font-medium">{worker.bypassNote || "No Note"}</span>
                  </p>
                </div>
                <button
                  onClick={() => handleOpenModal(order.orderNumber, worker.id)}
                  className="
                    w-full 
                    bg-sky-600 
                    text-white 
                    py-2 
                    rounded-lg 
                    hover:bg-sky-700 
                    transition-colors 
                    duration-300
                    flex 
                    items-center 
                    justify-center 
                    gap-2
                  "
                >
                  <ShieldCheckIcon className="w-5 h-5" />
                  Bypass
                </button>
              </div>
            ))
        )
      ) : (
        <p className="text-center text-gray-500 py-5">
          No bypass requests found.
        </p>
      )}
    </div>
  );

  // Pagination Controls
  const PaginationControls = () => (
    <div className="flex justify-between items-center mt-6 bg-sky-50 p-4 rounded-b-xl">
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={page === 1}
        className="
          px-4 
          py-2 
          bg-sky-600 
          text-white 
          rounded-lg 
          hover:bg-sky-700 
          transition-colors 
          disabled:opacity-50 
          disabled:cursor-not-allowed
          flex 
          items-center 
          gap-2
        "
      >
        <ChevronLeftIcon className="w-5 h-5" />
        Previous
      </button>

      <p className="text-sm text-gray-600">
        Page <span className="font-bold text-sky-700">{page}</span> of {totalPages}
      </p>

      <button
        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={page === totalPages}
        className="
          px-4 
          py-2 
          bg-sky-600 
          text-white 
          rounded-lg 
          hover:bg-sky-700 
          transition-colors 
          disabled:opacity-50 
          disabled:cursor-not-allowed
          flex 
          items-center 
          gap-2
        "
      >
        Next
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <div className="bg-gray-50 shadow-lg rounded-xl m-5">
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState />
      ) : (
        <div className="space-y-4">
          <DesktopTableView />
          <MobileCardView />
          <PaginationControls />
        </div>
      )}
      
      {isModalOpen && selectedOrderNumber && (
        <ModalBypassRequest
          orderNumber={selectedOrderNumber}
          onClose={() => setModalOpen(false)}
          orderWorkerId={orderWorkerId}
        />
      )}
    </div>
  );
}

export default withSuperAndOutletAdmin(BypassRequest)