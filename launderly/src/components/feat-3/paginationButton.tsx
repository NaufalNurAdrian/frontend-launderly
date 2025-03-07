import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex justify-center mt-4 gap-2">
      <button
        className={`px-3 h-[40px] flex justify-center items-center border w-[40px] rounded-full text-blue-700 
          ${currentPage === 1 || totalPages === 0 ? "cursor-not-allowed opacity-50 bg-gray-300" : "bg-blue-300/60 border-blue-500"}
        `}
        disabled={currentPage === 1 || totalPages === 0}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      >
        <ChevronLeft />
      </button>

      <span className="mx-4 flex items-center py-2 rounded-md">
        {totalPages > 0 ? `Page ${currentPage} of ${totalPages}` : "No pages available"}
      </span>

      <button
        className={`px-3 h-[40px] flex justify-center items-center border w-[40px] rounded-full text-blue-700 
          ${currentPage >= totalPages || totalPages === 0 ? "cursor-not-allowed opacity-50 bg-gray-300" : "bg-blue-300/60 border-blue-500"}
        `}
        disabled={currentPage >= totalPages || totalPages === 0}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      >
        <ChevronRight />
      </button>
    </div>
  );
}
