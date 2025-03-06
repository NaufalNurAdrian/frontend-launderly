"use client";

import { getOutletAddress } from "@/api/address";
import { IOutletAddress } from "@/types/address";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { toTitleCase } from "@/helpers/toTitleCase";
import { MapPinIcon } from "@heroicons/react/24/solid";

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
    <div className="w-full min-h-screen bg-gradient-to-b from-cyan-100 to-cyan-50 flex items-center justify-center p-4">
      <main className="relative flex flex-col md:flex-row gap-6 p-6 bg-white shadow-xl rounded-xl max-w-screen-lg w-full">
        {/* List of Outlets */}
        <div className="w-full md:w-1/3 p-6 bg-gray-100 rounded-lg shadow-md overflow-auto flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Outlets</h2>

          {loading ? (
            <p className="text-gray-600 animate-pulse">Loading outlets...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : outlets.length === 0 ? (
            <p className="text-gray-500">No outlets available.</p>
          ) : (
            <ul className="divide-y divide-gray-300">
              {outlets.map((outlet) => (
                <li
                  key={outlet.id}
                  className="p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-200 transition rounded-lg"
                  onClick={() =>
                    setSelectedOutlet([
                      outlet.address[0].latitude,
                      outlet.address[0].longitude,
                    ])
                  }
                >
                  <MapPinIcon className="h-6 w-6 text-cyan-600" />
                  <div>
                    <p className="font-semibold text-lg text-gray-900">
                      {outlet.outletName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {toTitleCase(outlet.outletType)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Map Section */}
        <div className="w-full md:w-2/3 h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-md">
          <Map outlets={outlets} selectedOutlet={selectedOutlet} />
        </div>
      </main>
    </div>
  );
}
