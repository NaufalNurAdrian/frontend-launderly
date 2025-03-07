"use client"

import { useState } from "react";
import { usePathname } from "next/navigation";
import "../../app/globals.css";
import "leaflet/dist/leaflet.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Sidebar from "@/components/dashboard/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  
  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex flex-row w-full h-full font-sans">
        <Sidebar currentPath={pathname} />
        <div className="ml-[60px] md:ml-[250px] w-full">
          {children}
        </div>
      </main>
    </QueryClientProvider>
  );
}