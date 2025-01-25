import type { Metadata } from "next";
import "../../app/globals.css";
import Sidebar from "@/components/sidebar";
export const metadata: Metadata = {
  title: "launderly",
  description: "A laundry service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="container flex flex-row w-full h-full">
          <div>
            <Sidebar />
          </div>
          <div className="container">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
