"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import api from "@/libs/api";
import { Outlet, OutletApiResponse } from "@/types/outlet.type";
import { GiWashingMachine } from "react-icons/gi";
import { MdOutlineStore, MdLocationOn } from "react-icons/md";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";

interface OutletTableProps {
  searchQuery?: string;
}

export default function OutletTable({ searchQuery = "" }: OutletTableProps) {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [allOutlets, setAllOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const router = useRouter();
  const limit = 6; // Outlets per page

  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        setLoading(true);
        const response = await api.get<OutletApiResponse>(`/outlet?page=${page}&limit=${limit}`);
        
        // Ensure outlet data is always an array
        const outletData = response.data.outlets ?? [];
        setOutlets(outletData);
        setAllOutlets(outletData);
        setTotalPages(Number(response.data.totalPages) || 1);
      } catch (err) {
        setError("Failed to fetch outlets");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOutlets();
  }, [page]);
  
  // Filter outlets when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setOutlets(allOutlets);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allOutlets.filter(outlet => 
      outlet.outletName.toLowerCase().includes(query) ||
      outlet.outletType.toLowerCase().includes(query) ||
      (outlet.address?.[0]?.addressLine && 
       outlet.address[0].addressLine.toLowerCase().includes(query))
    );
    
    setOutlets(filtered);
  }, [searchQuery, allOutlets]);

  // Calculate if we show "No results" message
  const showNoResults = useMemo(() => {
    return !loading && outlets.length === 0 && searchQuery.trim() !== "";
  }, [loading, outlets, searchQuery]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center">
            <GiWashingMachine className="w-12 h-12 text-blue-600" />
          </div>
          <div className="mt-4 text-blue-600 font-medium">Loading outlets...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (showNoResults) {
    return (
      <Card className="m-4 shadow-lg rounded-xl overflow-hidden bg-white border-none">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 text-white">
          <h2 className="text-xl font-bold text-center flex items-center justify-center gap-2">
            <MdOutlineStore size={24} />
            <span>Outlet Directory</span>
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-6xl text-blue-200 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">No outlets found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
          <button 
            onClick={() => setPage(1)} 
            className="mt-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            View all outlets
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg rounded-xl overflow-hidden bg-white border-none m-4">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 text-white">
        <h2 className="text-xl font-bold text-center flex items-center justify-center gap-2">
          <MdOutlineStore size={24} />
          <span>Outlet Directory</span>
          {searchQuery && (
            <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
              Search: "{searchQuery}"
            </span>
          )}
        </h2>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(outlets) && outlets.length > 0 ? (
            outlets.map((outlet) => (
              <Card 
                key={outlet.id} 
                className="flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-300 border border-blue-100 hover:border-blue-300"
              >
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 h-48 flex items-center justify-center text-white font-bold relative">
                  <div className="absolute top-3 right-3 bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs">
                    {outlet.outletType}
                  </div>
                  <GiWashingMachine size={64} />
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="font-bold text-lg text-blue-900 mb-2">{outlet.outletName}</h3>
                  <div className="flex items-start text-sm text-gray-700 mb-4">
                    <MdLocationOn className="text-blue-500 mt-1 mr-1 flex-shrink-0" size={16} />
                    <span>{outlet.address?.[0]?.addressLine || "No address available"}</span>
                  </div>
                </div>
                <button
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-4 font-medium transition-colors duration-200"
                  onClick={() => router.push(`/dashboard/outlet/${outlet.id}`)}
                >
                  View Details
                </button>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-gray-500">No outlets available</div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {outlets.length > 0 && (
        <div className="flex justify-between items-center p-4 bg-blue-50 border-t border-blue-100">
          <button
            className="flex items-center gap-1 px-4 py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-100 transition disabled:opacity-50 disabled:hover:bg-white"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            <IoArrowBack size={16} />
            <span className="hidden sm:inline-block">Previous</span>
          </button>
          
          <span className="text-blue-700">
            Page {page} of {totalPages}
          </span>
          
          <button
            className="flex items-center gap-1 px-4 py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-100 transition disabled:opacity-50 disabled:hover:bg-white"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            <span className="hidden sm:inline-block">Next</span>
            <IoArrowForward size={16} />
          </button>
        </div>
      )}
    </Card>
  );
}