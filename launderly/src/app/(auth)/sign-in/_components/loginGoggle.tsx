"use client";

import { useEffect } from "react";
import { loginWithGoogle } from "@/app/api/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const LoginGoogle = () => {
  const router = useRouter();

  const handleGoogleLogin = async (response: { credential?: string }) => {
    //console.log("Google Login Success:", response);

    try {
      if (!response.credential) {
        throw new Error("Google login credential not found.");
      }

      const data = await loginWithGoogle(response.credential);

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        router.replace("/dashboardCustomer");
      } else {
        console.error("Login failed:", data.message);
        toast.error(data.message || "Google login failed.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Google Login Error:", error.message);
        toast.error(error.message);
      } else {
        console.error("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client?hl=en";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        //console.log("Google SDK Loaded:", window.google);

        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: handleGoogleLogin,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-login-btn")!,
          { theme: "outline", size: "large" }
        );
      }
    };
  }, []);

  return (
    <div>
      <div id="google-login-btn"></div>
    </div>
  );
};

export default LoginGoogle;
