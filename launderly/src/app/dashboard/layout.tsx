"use client"

import type { Metadata } from "next";
import "../../app/globals.css";
import Sidebar from "../../components/sidebar";
import "leaflet/dist/leaflet.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>

        <main className="flex flex-row w-full h-full font-sans">
          <Sidebar />
          <div className="ml-[50px] md:ml-[250px] w-full">
          {children}
          </div>
        </main>
    </QueryClientProvider>
  );
}