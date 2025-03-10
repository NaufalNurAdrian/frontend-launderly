"use client";

import { ArrowUp, ArrowDown } from "lucide-react";

interface SortButtonProps {
  sortBy: string;
  order: "asc" | "desc";
  onSort: (sortBy: string, order: "asc" | "desc") => void;
  label: string;
}

export default function SortButton({ sortBy, order, onSort, label }: SortButtonProps) {
  const handleClick = () => {
    const newOrder = order === "asc" ? "desc" : "asc";
    onSort(sortBy, newOrder);
  };

  return (
    <button
      onClick={handleClick}
      className="group flex justify-center items-center px-4 py-2 max-w-[250px] text-center 
    bg-gradient-to-r from-blue-400 to-blue-300 text-white rounded-lg 
    transition-all duration-300 
    hover:from-blue-400 hover:to-blue-300"
    >
      <span className="mr-2">{label}</span>
      {order === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
    </button>
  );
}
