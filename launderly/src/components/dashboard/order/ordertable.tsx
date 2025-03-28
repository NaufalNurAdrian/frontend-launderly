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
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CheckCircle2Icon, 
  ClockIcon, 
  XCircleIcon 
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define order status types
type OrderStatus = 
  | 'ARRIVED_AT_OUTLET' 
  | 'COMPLETED' 
  | 'PROCESSING' 
  | 'CANCELLED';

// Helper function to get status styles
const getStatusStyle = (status: OrderStatus) => {
  const statusStyles: Record<OrderStatus, string> = {
    'ARRIVED_AT_OUTLET': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'COMPLETED': 'bg-green-100 text-green-800 border-green-200',
    'PROCESSING': 'bg-blue-100 text-blue-800 border-blue-200',
    'CANCELLED': 'bg-red-100 text-red-800 border-red-200'
  };

  return statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

// Helper function to get status icon
const getStatusIcon = (status: OrderStatus) => {
  const iconMap: Record<OrderStatus, typeof ClockIcon> = {
    'ARRIVED_AT_OUTLET': ClockIcon,
    'COMPLETED': CheckCircle2Icon,
    'PROCESSING': ClockIcon,
    'CANCELLED': XCircleIcon
  };

  return iconMap[status] || ClockIcon;
};

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
  const [itemsPerPage, setItemsPerPage] = useState(15); // Default to 15 items per page
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(null);

  // Calculate total pages based on total count and items per page
  const totalPages = orders?.getOrder?.meta?.total 
    ? Math.ceil(orders.getOrder.meta.total / itemsPerPage) 
    : 1;

  const handleOpenModal = (orderNumber: string) => {
    setSelectedOrderNumber(orderNumber);
    setModalOpen(true);
  };

  // Next page handler
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  // Previous page handler
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
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
          filterCustomerName,
          itemsPerPage
        );
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
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
    itemsPerPage,
  ]);

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setPage(1); // Reset to first page when changing items per page
  };

  // Loading State Component
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center p-10 space-y-4">
      <div className="animate-pulse w-16 h-16 bg-sky-200 rounded-full flex items-center justify-center">
        <ClockIcon className="w-10 h-10 text-sky-600" />
      </div>
      <p className="text-gray-600 animate-pulse">Loading orders...</p>
    </div>
  );

  // Error State Component
  const ErrorState = () => (
    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg flex items-center space-x-4">
      <XCircleIcon className="w-10 h-10 text-red-500" />
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
          {orders?.getOrder?.meta?.total 
            ? `Showing ${Math.min((page - 1) * itemsPerPage + 1, orders.getOrder.meta.total)} to ${Math.min(page * itemsPerPage, orders.getOrder.meta.total)} of ${orders.getOrder.meta.total} orders`
            : 'Recent Orders'}
        </TableCaption>
        <TableHeader className="bg-sky-50 border-b-2 border-sky-200">
          <TableRow className="hover:bg-sky-100/50 transition-colors duration-200">
            <TableHead className="text-sky-800 font-semibold tracking-wider uppercase text-sm">
              Order Number
            </TableHead>
            <TableHead className="text-sky-800 font-semibold tracking-wider uppercase text-sm">
              Customer Name
            </TableHead>
            <TableHead className="text-sky-800 font-semibold tracking-wider uppercase text-sm">
              Status
            </TableHead>
            <TableHead className="text-sky-800 font-semibold tracking-wider uppercase text-sm">
              Total Price
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.getOrder.orders.map((order) => {
            const StatusIcon = getStatusIcon(order.orderStatus as OrderStatus);
            return (
              <TableRow 
                key={order.id} 
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <TableCell className="font-medium text-gray-700">
                  #{order.orderNumber}
                </TableCell>
                <TableCell className="text-gray-600">
                  {order.pickupOrder.user.fullName}
                </TableCell>
                <TableCell>
                  <span 
                    className={`
                      inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium
                      border ${getStatusStyle(order.orderStatus as OrderStatus)}
                    `}
                  >
                    <StatusIcon className="w-4 h-4" />
                    {order.orderStatus.replace('_', ' ')}
                  </span>
                </TableCell>
                <TableCell className="font-semibold text-gray-800">
                  Rp {order.laundryPrice + order.pickupOrder.pickupPrice}
                </TableCell>
                <TableCell>
                  {order.orderStatus === "ARRIVED_AT_OUTLET" && (
                    <button
                      onClick={() => handleOpenModal(order.orderNumber)}
                      className="
                        bg-sky-600 
                        text-white 
                        px-4 py-2 
                        rounded-lg 
                        hover:bg-sky-700 
                        transition-colors 
                        duration-300 
                        flex items-center gap-2
                      "
                    >
                      Create Order
                    </button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );

  // Mobile Card View
  const MobileCardView = () => (
    <div className="md:hidden space-y-4">
      {orders?.getOrder.orders.map((order) => {
        const StatusIcon = getStatusIcon(order.orderStatus as OrderStatus);
        return (
          <div 
            key={order.id} 
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
              <p className="text-sm text-gray-500 font-medium">
                Order #{order.orderNumber}
              </p>
              <span 
                className={`
                  inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                  border ${getStatusStyle(order.orderStatus as OrderStatus)}
                `}
              >
                <StatusIcon className="w-3 h-3" />
                {order.orderStatus.replace('_', ' ')}
              </span>
            </div>
            <p className="text-lg font-semibold text-gray-800 mb-1">
              {order.pickupOrder.user.fullName}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Total: Rp {order.laundryPrice + order.pickupOrder.pickupPrice}
            </p>
            {order.orderStatus === "ARRIVED_AT_OUTLET" && (
              <button
                onClick={() => handleOpenModal(order.orderNumber)}
                className="
                  w-full 
                  bg-sky-600 
                  text-white 
                  py-2 
                  rounded-lg 
                  hover:bg-sky-700 
                  transition-colors 
                  duration-300
                "
              >
                Create Order
              </button>
            )}
          </div>
        );
      })}
    </div>
  );

  // Pagination Controls
  const PaginationControls = () => (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 bg-sky-50 p-4 rounded-b-xl gap-4">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <span className="text-sm text-gray-600">Show:</span>
        <Select 
          value={itemsPerPage.toString()} 
          onValueChange={handleItemsPerPageChange}
        >
          <SelectTrigger className="w-[100px] bg-white">
            <SelectValue placeholder="Per Page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="15">15</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-600">per page</span>
      </div>

      <div className="flex flex-nowrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <button
          onClick={handlePrevPage}
          disabled={page <= 1}
          className="
            px-3 sm:px-4 py-2 
            bg-sky-600 
            text-white 
            rounded-lg 
            hover:bg-sky-700 
            transition-colors 
            disabled:opacity-50 
            disabled:hover:bg-sky-600
            disabled:cursor-not-allowed
            flex items-center gap-1 sm:gap-2
            text-sm sm:text-base
            flex-nowrap whitespace-nowrap
          "
        >
          <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Prev</span>
        </button>

        <p className="text-sm text-gray-600 whitespace-nowrap">
          Page <span className="font-bold text-sky-700">{page}</span> of {totalPages}
        </p>

        <button
          onClick={handleNextPage}
          disabled={page >= totalPages}
          className="
            px-3 sm:px-4 py-2 
            bg-sky-600 
            text-white 
            rounded-lg 
            hover:bg-sky-700 
            transition-colors 
            disabled:opacity-50 
            disabled:hover:bg-sky-600
            disabled:cursor-not-allowed
            flex items-center gap-1 sm:gap-2
            text-sm sm:text-base
            flex-nowrap whitespace-nowrap
          "
        >
          <span>Next</span>
          <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
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
        <ModalCreateOrder
          orderNumber={selectedOrderNumber}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}