import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Launderly App",
  description: "A laundry service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
      </head>
      <body className="font-sans">
        <Toaster />
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
