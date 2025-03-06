"use client";

import { Input } from "@/components/ui/input";
import { OrderStatus } from "@/types/order.type";
import { useEffect, useState } from "react";
import { SearchIcon, FilterIcon, ChevronDownIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OutletApiResponse } from "@/types/outlet.type";
import { fetchAllOutlet } from "@/services/outletService";

export default function HeaderOrder({
  onSearch,
  setFilterOutlet,
  setFilterStatus,
  setFilterDate,
  setFilterCategory,
  setFilterCustomerName,
}: {
  onSearch: (query: string) => void;
  setFilterOutlet: (value: string) => void;
  setFilterStatus: (value: string) => void;
  setFilterDate: (value: string) => void;
  setFilterCategory: (value: string) => void;
  setFilterCustomerName: (value: string) => void;
}) {
  const [searchType, setSearchType] = useState("customer");
  const [query, setQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [outlet, setOutlet] = useState<OutletApiResponse>();

  useEffect(() => {
    const fetchOutlet = async () => {
      try {
        const response: OutletApiResponse = await fetchAllOutlet();
        setOutlet(response);
      } catch (error) {
        console.error("Failed to fetch outlets:", error);
      }
    };
    fetchOutlet();
  }, []);

  const handleSearch = () => {
    if (searchType === "order") {
      onSearch(query);
    } else {
      setFilterCustomerName(query);
    }
  };

  // Format status for display
  const formatStatus = (status: string) =>
    status
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-4 space-y-4">
      {/* Search Section */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        {/* Search Type Select */}
        <Select value={searchType} onValueChange={setSearchType}>
          <SelectTrigger className="w-full sm:w-40 bg-gray-50 border-gray-200">
            <SelectValue placeholder="Search Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="order">Order ID</SelectItem>
            <SelectItem value="customer">Customer Name</SelectItem>
          </SelectContent>
        </Select>

        {/* Search Input */}
        <div className="flex w-full gap-2">
          <div className="relative flex-grow">
            <Input
              className="pl-10 pr-3 py-2 w-full text-sm border-gray-300 focus:ring-2 focus:ring-sky-200"
              placeholder={`Search ${
                searchType === "order" ? "Order ID" : "Customer Name"
              }`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <button
            onClick={handleSearch}
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
              whitespace-nowrap
            "
          >
            <SearchIcon className="w-5 h-5" />
            Search
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <button
            className="
              w-full 
              flex 
              items-center 
              justify-center 
              gap-2 
              bg-gray-50 
              border 
              border-gray-200 
              text-gray-700 
              py-2 
              rounded-lg 
              hover:bg-gray-100 
              transition-colors
            "
          >
            <FilterIcon className="w-5 h-5" />
            Advanced Filters
            <ChevronDownIcon
              className={`
                w-4 h-4 
                transition-transform 
                ${isFilterOpen ? "rotate-180" : ""}
              `}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-full max-w-2xl p-4 bg-white rounded-xl shadow-2xl border-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Outlet Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Outlet
              </label>
              <Select onValueChange={setFilterOutlet}>
                <SelectTrigger>
                  <SelectValue placeholder="All Outlets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Outlets</SelectItem>
                  {outlet?.outlets.map((outlet) => (
                    <SelectItem
                      key={outlet.outletName}
                      value={outlet.outletName}
                    >
                      {outlet.outletName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <Select onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.values(OrderStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {formatStatus(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date</label>
              <Input
                type="date"
                className="w-full border-gray-300"
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>
              <Select onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="pickup">Pickup</SelectItem>
                  <SelectItem value="process">Process</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
