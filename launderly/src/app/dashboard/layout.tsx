"use client"

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import "../../app/globals.css";
import "leaflet/dist/leaflet.css";
import Sidebar from "@/components/dashboard/sidebar";
import { GiWashingMachine } from "react-icons/gi";
import useSession from "@/hooks/useSession";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  
  // Handle redirect if not authenticated (after loading completes)
  useEffect(() => {
    if (!session.isLoading && !session.isAuth) {
      router.push("/sign-in");
    }
  }, [session.isLoading, session.isAuth, router]);
  
  // Show loading screen while session is loading
  if (session.isLoading) {
    return (
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
    );
  }
  
  // After loading, show proper content based on auth state
  return (
    <>
      {session.isAuth ? (
        <main className="flex flex-row w-full h-full font-sans">
          <Sidebar currentPath={pathname} />
          <div className="ml-[60px] md:ml-[250px] w-full">
            {children}
          </div>
        </main>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Akses Ditolak</h1>
            <p className="mb-4">Anda harus login untuk mengakses halaman ini</p>
            <p className="text-sm">Mengalihkan ke halaman login...</p>
          </div>
        </div>
      )}
    </>
  );
}