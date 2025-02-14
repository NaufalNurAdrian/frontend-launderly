"use client";

import { useEffect } from "react";
import { loginWithGoogle } from "@/api/auth";
import { useRouter } from "next/navigation";

const LoginGoogle = () => {
  const router = useRouter();

  const handleGoogleLogin = async (response: any) => {
    console.log("Google Login Success:", response);
    try {
      const data = await loginWithGoogle(response.credential); 
      
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        router.push("/dashboardCustomer");
      } else {
        console.error("Login failed:", data.message);
      }
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };
  

  useEffect(() => {
    if (typeof window !== "undefined" && window.google) {
      console.log("Google SDK Loaded:", window.google);

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleGoogleLogin,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-login-btn")!,
        { theme: "outline", size: "large" }
      );
    }
  }, []);

  return (
    <div>
      <div id="google-login-btn"></div>
    </div>
  );
};

export default LoginGoogle;
