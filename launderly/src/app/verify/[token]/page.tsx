"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
<<<<<<< HEAD
import { toast } from "react-toastify";
=======
import { toast } from "react-hot-toast";
>>>>>>> b39ac95dc8d9d7c3f32bc72b1219fc7b8d7b713f

const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

export default function VerifyPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const { token } = params;

  const onVerify = async () => {
    try {
      const res = await axios.patch(`${base_url}/auth/verify/${token}`);

      const result = res.data;
      toast.success(result.message);
      router.push("/");
    } catch (err) {
      console.error("Error during verification:", err);
      toast.error("An error occurred during verification");
    }
  };

  useEffect(() => {
    onVerify();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Account Verification
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Automatically verify your account. Your token:{" "}
          <span className="block font-mono text-blue-600 text-sm overflow-x-auto whitespace-nowrap break-all">
            {token}
          </span>
        </p>
      </div>
    </div>
  );
}
