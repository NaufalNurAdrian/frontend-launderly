import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import "leaflet/dist/leaflet.css";


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
      <body
        className="font-sans"
      >
        <Toaster/>
        {children}
        <ToastContainer
            draggable
            closeOnClick
            autoClose={5000}
            theme="dark"
            position="bottom-right"
          />
      </body>
    </html>
  );
}
