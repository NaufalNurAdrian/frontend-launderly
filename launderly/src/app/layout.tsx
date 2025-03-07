import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import Script from "next/script";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Launderly App",
  description: "A laundry service",
};

const midtransKey = process.env.NEXT_PUBLIC_MID_CLIENT_KEY || "";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <Toaster />
        <ToastContainer
          draggable
          closeOnClick
          autoClose={5000}
          theme="dark"
          position="bottom-right"
        />
        {children}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
        {midtransKey && (
          <Script
            src="https://app.sandbox.midtrans.com/snap/snap.js"
            data-client-key={midtransKey}
            strategy="beforeInteractive"
          />
        )}
      </body>
    </html>
  );
}