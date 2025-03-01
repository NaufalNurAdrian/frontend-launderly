"use client";

import { Input } from "@/components/ui/input";
import { OrderStatus } from "@/types/order.type";
import { useState } from "react";

export default function HeaderOrder({ 
  onSearch, 
  setFilterOutlet, 
  setFilterStatus, 
  setFilterDate, 
  setFilterCategory,
  setFilterCustomerName
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
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSearch = () => {
    if (searchType === "order") {
      onSearch(query);
    } else {
      setFilterCustomerName(query);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md p-3 space-y-3 text-sm">
      {/* Search Input */}
      <div className="flex flex-wrap md:flex-nowrap gap-2">
        <select 
          className="border p-1.5 rounded-md w-full md:w-auto text-xs" 
          value={searchType} 
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="order">Order ID</option>
          <option value="customer">Customer Name</option>
        </select>
        <Input
          className="w-full text-xs px-2 py-1.5"
          placeholder={`Search ${searchType === "order" ? "Order ID" : "Customer Name"}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button 
          onClick={handleSearch} 
          className="bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition text-xs"
        >
          🔍 Search
        </button>
      </div>

      {/* Filter Options */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {/* Filter Outlet */}
        <select 
          className="border p-1.5 rounded-md w-full text-xs" 
          onChange={(e) => setFilterOutlet(e.target.value)}
        >
          <option value="all">All Outlets</option>
          <option value="1">Outlet 1</option>
          <option value="2">Outlet 2</option>
        </select>

        {/* Filter Status */}
        <select 
          className="border p-1.5 rounded-md w-full text-xs" 
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          {Object.values(OrderStatus).map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}
            </option>
          ))}
        </select>

        {/* Filter Date */}
        <input 
          type="date" 
          className="border p-1.5 rounded-md w-full text-xs" 
          onChange={(e) => setFilterDate(e.target.value)}
        />

        {/* Filter Category */}
        <select 
          className="border p-1.5 rounded-md w-full text-xs" 
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="pickup">Pickup</option>
          <option value="process">Process</option>
          <option value="delivery">Delivery</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
}
