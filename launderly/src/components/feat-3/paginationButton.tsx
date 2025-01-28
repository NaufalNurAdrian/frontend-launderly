"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex justify-center mt-4">
      <button
        className="px-3 h-[40px] flex justify-center items-center bg-blue-300/60 border-blue-500 w-[40px] rounded-full text-blue-700"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft />
      </button>
      <span className="mx-4 flex items-center">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="px-3 h-[40px] flex justify-center items-center bg-blue-300/60 border-blue-500 w-[40px] rounded-full text-blue-700"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight />
      </button>
    </div>
  );
}