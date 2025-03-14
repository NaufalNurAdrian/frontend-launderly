"use client";

import React from "react";
import { Item } from "@/services/itemService";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Update as UpdateIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useMediaQuery, useTheme } from "@mui/material";

interface ItemListProps {
  items: Item[];
  loading: boolean;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  searchQuery?: string;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const ItemList: React.FC<ItemListProps> = ({
  items,
  loading,
  onEdit,
  onDelete,
  searchQuery = "",
  totalPages = 1,
  currentPage = 1,
  onPageChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Format date in a readable way
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px] w-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="mt-4 text-blue-600 font-medium">Loading items...</div>
        </div>
      </div>
    );
  }

  // Show no results component
  if (searchQuery && items.length === 0) {
    return (
      <div className="m-4 shadow-lg rounded-xl overflow-hidden bg-white border-none animate-fadeIn">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 text-white">
          <h2 className="text-lg font-bold text-center flex items-center justify-center gap-2">
            <span>Items List</span>
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-blue-200 mb-6">
            <SearchIcon sx={{ fontSize: 96 }} />
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            No items found
          </h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
          <button
            onClick={() => handlePageChange(1)}
            className="mt-6 px-6 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium"
          >
            View all items
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="m-4 shadow-lg rounded-xl overflow-hidden bg-white border-none animate-fadeIn">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 text-white">
        <h2 className="text-lg font-bold text-center flex items-center justify-center gap-2">
          <span>Items List</span>
          {searchQuery && (
            <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
              Search: "{searchQuery}"
            </span>
          )}
        </h2>
      </div>
      {/* Desktop view - Table */}
      {!isMobile && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-50">
                <th className="font-semibold text-blue-900 px-4 py-3 text-left">
                  Item Name
                </th>
                <th className="font-semibold text-blue-900 px-4 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {item.itemName}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => item.id && onEdit(item)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition text-sm font-medium"
                      >
                        <EditIcon sx={{ fontSize: 18 }} />
                        Edit
                      </button>
                      <button
                        onClick={() => item.id && onDelete(item.id.toString())}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition text-sm font-medium"
                      >
                        <DeleteIcon sx={{ fontSize: 18 }} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile view - Cards */}
      {isMobile && (
        <div className="px-4 py-3 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-blue-100 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className="p-3 border-b border-blue-100 flex justify-between items-center bg-blue-50">
                <div>
                  <h3 className="font-medium text-gray-900">{item.itemName}</h3>
                  <span className="text-xs text-blue-700">ID: {item.id}</span>
                </div>
                <button
                  onClick={() => item.id && onEdit(item)}
                  className="bg-white p-2 rounded-full hover:bg-blue-100 transition-colors"
                >
                  <EditIcon sx={{ color: "#3b82f6", fontSize: 18 }} />
                </button>
              </div>

              <div className="p-4 space-y-3 text-sm">
                <div className="flex items-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 mr-3 bg-blue-100 rounded-full">
                    <CalendarIcon sx={{ color: "#3b82f6", fontSize: 18 }} />
                  </span>
                  <div>
                    <div className="text-gray-500">Created Date</div>
                    <div className="font-medium">
                      {formatDate(item.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 mr-3 bg-blue-100 rounded-full">
                    <UpdateIcon sx={{ color: "#3b82f6", fontSize: 18 }} />
                  </span>
                  <div>
                    <div className="text-gray-500">Updated Date</div>
                    <div className="font-medium">
                      {formatDate(item.updatedAt)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => item.id && onDelete(item.id.toString())}
                  className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition text-sm font-medium"
                >
                  <DeleteIcon sx={{ fontSize: 18 }} />
                  Delete Item
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {items.length > 0 && onPageChange && (
        <div className="flex justify-between items-center p-4 bg-blue-50 border-t border-blue-100">
          <button
            className="flex items-center gap-1 px-4 py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:hover:bg-white"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} />
            <span className="hidden sm:inline-block">Previous</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md 
                      ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-blue-100"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <span className="text-sm text-blue-700 sm:hidden">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <button
            className="flex items-center gap-1 px-4 py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:hover:bg-white"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span className="hidden sm:inline-block">Next</span>
            <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemList;
