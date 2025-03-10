"use client";

import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { IoSearch, IoAdd } from "react-icons/io5";
import { MdOutlineStore } from "react-icons/md";

interface HeaderOutletProps {
  onSearch?: (query: string) => void;
}

export default function HeaderOutletDelete({ onSearch }: HeaderOutletProps) {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchValue);
      if (onSearch) onSearch(searchValue);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchValue, onSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex flex-col sm:flex-row w-full justify-between gap-4 items-center">
        <div className="flex items-center justify-center">
          <h2 className="text-xl font-semibold text-blue-700 hidden md:flex items-center">
            <MdOutlineStore className="mr-2" size={24} />
            Outlet Management
          </h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <IoSearch className="text-gray-400" />
            </div>
            <Input 
              placeholder="Search outlet" 
              className="pl-10 border-blue-200 focus:border-blue-500 w-full"
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}