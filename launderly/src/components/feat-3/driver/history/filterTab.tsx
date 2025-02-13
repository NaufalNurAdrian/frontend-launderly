"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface FilterTabsProps {
  onFilterChange: (filter: string) => void;
  option1: string;
  option2?: string;
}

export default function FilterTabs({ onFilterChange, option1, option2 }: FilterTabsProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    onFilterChange(value);
  };

  const options = [{ label: "All", value: "" }, { label: option1, value: option1 }];
  if (option2) options.push({ label: option2, value: option2 });

  return (
    <div className="relative w-full flex justify-center border-b border-gray-300">
      {options.map((option) => (
        <button
          key={option.value}
          className={`relative px-4 py-2 text-lg font-medium transition-colors duration-300 ${
            selectedFilter === option.value ? "text-blue-600" : "text-gray-600"
          }`}
          onClick={() => handleFilterChange(option.value)}
        >
          {option.label}
          {selectedFilter === option.value && (
            <motion.div
              layoutId="underline"
              className="absolute left-0 bottom-0 w-full h-[3px] bg-blue-600"
            />
          )}
        </button>
      ))}
    </div>
  );
}
