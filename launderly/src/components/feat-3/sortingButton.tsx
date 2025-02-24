"use client";

import { ArrowUp, ArrowDown } from "lucide-react";

interface SortButtonProps {
  sortBy: string;
  order: "asc" | "desc";
  onSort: (sortBy: string, order: "asc" | "desc") => void;
<<<<<<< HEAD
<<<<<<< HEAD
  label: string
}

export default function SortButton({ sortBy, order, onSort, label }: SortButtonProps) {
=======
}

export default function SortButton({ sortBy, order, onSort }: SortButtonProps) {
>>>>>>> 7afafe299959dee23977742ab24b05cc9f039793
=======
  label: string;
}

export default function SortButton({ sortBy, order, onSort, label }: SortButtonProps) {
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3
  const handleClick = () => {
    const newOrder = order === "asc" ? "desc" : "asc";
    onSort(sortBy, newOrder);
  };

  return (
<<<<<<< HEAD
<<<<<<< HEAD
    <button onClick={handleClick} className="flex justify-center items-center px-4 py-2 w-[180px] text-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
      <span className="mr-2">{label}</span>
=======
    <button onClick={handleClick} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
      <span className="mr-2">Sort by {sortBy}</span>
>>>>>>> 7afafe299959dee23977742ab24b05cc9f039793
=======
    <button onClick={handleClick} className="flex justify-center items-center px-4 py-2 max-w-[200px] text-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
      <span className="mr-2">{label}</span>
>>>>>>> ea41255c277fa321e8825de19f6805bcd436b3d3
      {order === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
    </button>
  );
}
