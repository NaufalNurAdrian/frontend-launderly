"use client";

import { getOutletAddress } from "@/api/address";
import { IOutletAddress } from "@/types/address";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { toTitleCase } from "@/helpers/toTitleCase";

const Map = dynamic(() => import("@/components/feat-1/map"), { ssr: false });

export default function OutletPage() {
  const [outlets, setOutlets] = useState<IOutletAddress[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<[number, number] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getOutlet = async () => {
      try {
        const { data } = await getOutletAddress();
        setOutlets(data);
      } catch (error) {
        console.error("Error fetching outlets:", error);
        setError("Failed to load outlets. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    getOutlet();
  }, []);

  return (
    <div className="w-full min-h-screen bg-cyan-50">
      <main className="relative flex flex-col md:flex-row gap-4 p-4 max-w-screen-lg mx-auto h-full">
        {/* List of Outlets */}
        <div className="w-full md:w-1/3 bg-white p-6 shadow-lg rounded-lg overflow-auto flex-1">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Our Outlets</h2>

          {loading && "loading"}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <ul className="divide-y divide-gray-200">
              {outlets.map((outlet) => (
                <li
                  key={outlet.id}
                  className="p-3 cursor-pointer hover:bg-gray-100 transition rounded-md"
                  onClick={() =>
                    setSelectedOutlet([
                      outlet.address[0].latitude,
                      outlet.address[0].longitude,
                    ])
                  }
                >
                  <p className="font-semibold text-lg text-gray-900">
                    {outlet.outletName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {toTitleCase(outlet.outletType)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Map */}
        <div className="w-full md:w-2/3 h-[400px] md:h-[500px] flex-1 rounded-lg overflow-hidden">
          <Map outlets={outlets} selectedOutlet={selectedOutlet} />
        </div>
      </main>
    </div>
  );
}
