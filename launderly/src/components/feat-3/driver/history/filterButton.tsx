"use client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface filterProp {
  onFilterChange: (filter: string) => void;
  option1: string;
  option2: string;
}
export default function FilterDropdown({ onFilterChange, option1, option2 }: filterProp) {
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  const handleFilterChange = (event: any) => {
    const value = event.target.value;
    setSelectedFilter(value);
    onFilterChange(value);
  };

  return (
    <div className="relative">
      <select value={selectedFilter} onChange={handleFilterChange} className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500">
        <option value="">All</option>
        <option value={option1}>{option1}</option>
        <option value={option2}>{option2}</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDown />
      </div>
    </div>
  );
}
