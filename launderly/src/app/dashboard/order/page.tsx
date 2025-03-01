"use client";

import { useState } from "react";
import HeaderOrder from "@/components/dashboard/order/headerorder";
import OrderTable from "@/components/dashboard/order/ordertable";

export default function Order() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterOutlet, setFilterOutlet] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterDate, setFilterDate] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterCustomerName, setFilterCustomerName] = useState(""); // ✅ NEW

    return (
        <div className="h-full w-full">
            <HeaderOrder 
                onSearch={setSearchQuery}
                setFilterOutlet={setFilterOutlet}
                setFilterStatus={setFilterStatus}
                setFilterDate={setFilterDate}
                setFilterCategory={setFilterCategory}
                setFilterCustomerName={setFilterCustomerName} // ✅ NEW
            />
            <OrderTable 
                searchQuery={searchQuery}
                filterOutlet={filterOutlet}
                filterStatus={filterStatus}
                filterDate={filterDate}
                filterCategory={filterCategory}
                filterCustomerName={filterCustomerName} // ✅ NEW
            />
        </div>
    );
}
