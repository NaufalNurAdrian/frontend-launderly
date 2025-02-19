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

  useEffect(() => {
    const getOutlet = async () => {
      try {
        const { data } = await getOutletAddress();
        setOutlets(data);
      } catch (error) {
        console.error("Error fetching outlets:", error);
      }
    };
    getOutlet();
  }, []);

  return (
    <div className="w-full bg-cyan-50">
      <main className="relative flex flex-col md:flex-row gap-4 p-4 h-screen max-w-screen-lg mx-auto ">
        {/* List of Outlets */}
        <div className="w-full md:w-1/3 bg-white p-4 shadow-md rounded-lg overflow-auto flex-1">
          <h2 className="text-xl font-bold mb-4">Our Outlets</h2>
          <ul>
            {outlets.map((outlet) => (
              <li
                key={outlet.id}
                className="p-2 border-b cursor-pointer hover:bg-gray-100"
                onClick={() =>
                  setSelectedOutlet([
                    outlet.address[0].latitude,
                    outlet.address[0].longitude,
                  ])
                }
              >
                <p className="font-semibold">{outlet.outletName}</p>
                <p className="text-sm text-gray-500">
                  {toTitleCase(outlet.outletType)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Map */}
        <div className="w-full md:w-2/3 h-[500px] md:h-full flex-1">
          <Map outlets={outlets} selectedOutlet={selectedOutlet} />
        </div>
      </main>
    </div>
  );
}
