"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import api from "@/libs/api";
import { Outlet, OutletApiResponse } from "@/types/outlet.type";

export default function OutletTable() {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const router = useRouter();
  const limit = 6; // Jumlah outlet per halaman

  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        setLoading(true);
        const response = await api.get<OutletApiResponse>(`/outlet?page=${page}&limit=${limit}`);
        
        // Pastikan data outlet selalu berupa array
        setOutlets(response.data.outlets ?? []);
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
  

  if (loading) return <div className="text-center p-5">Loading...</div>;
  if (error) return <div className="text-center p-5 text-red-500">{error}</div>;

  return (
    <div className="container mt-5 p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.isArray(outlets) && outlets.length > 0 ? (
  outlets.map((outlet) => (
    <Card key={outlet.id} className="flex flex-col p-2">
      <div className="bg-black rounded-lg h-72 flex items-center justify-center text-white font-bold">
        {outlet.outletType}
      </div>
      <div className="p-2 font-bold text-lg">{outlet.outletName}</div>
      <div className="p-2 text-sm text-gray-700">
        {outlet.address?.[0]?.addressLine || "No address available"}
      </div>
      <button
        className="bg-blue rounded-2xl m-2 h-10 font-medium text-white"
        onClick={() => router.push(`/dashboard/outlet/${outlet.id}`)}
      >
        Detail
      </button>
    </Card>
  ))
) : (
  <div className="text-center p-5 text-gray-500">No outlets available</div>
)}

      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-5 space-x-3">
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span className="py-2">Page {page} of {totalPages}</span>
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
