"use client";

import { ArrowUp, ArrowDown } from "lucide-react";

interface SortButtonProps {
  sortBy: string; 
  order: "asc" | "desc";
  onSort: (sortBy: string, order: "asc" | "desc") => void; 
}

export default function SortButton({ sortBy, order, onSort }: SortButtonProps) {
  const handleClick = () => {
    const newOrder = order === "asc" ? "desc" : "asc"; 
    onSort(sortBy, newOrder); 
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      <span className="mr-2">Sort by {sortBy}</span>
      {order === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
    </button>
  );
}