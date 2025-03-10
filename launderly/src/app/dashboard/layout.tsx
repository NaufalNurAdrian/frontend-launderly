"use client"

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "../../app/globals.css";
import "leaflet/dist/leaflet.css";
import Sidebar from "@/components/dashboard/sidebar";
import { GiWashingMachine } from "react-icons/gi";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, [pathname]);
  
  return (
    <main className="flex flex-row w-full h-full font-sans">
      <Sidebar currentPath={pathname} />
      <div className="ml-[60px] md:ml-[250px] w-full">
        {loading ? (
          <div className="launderly-loader">
            <div className="loading-container">
              <GiWashingMachine className="washing-machine-icon" />
              <div className="loading-text">
                <span className="text-char">L</span>
                <span className="text-char">a</span>
                <span className="text-char">u</span>
                <span className="text-char">n</span>
                <span className="text-char">d</span>
                <span className="text-char">e</span>
                <span className="text-char">r</span>
                <span className="text-char">l</span>
                <span className="text-char">y</span>
              </div>
              <div className="loading-bar">
                <div className="loading-progress"></div>
              </div>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </main>
  );
}