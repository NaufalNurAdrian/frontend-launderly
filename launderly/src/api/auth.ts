import { RegisterValues } from "@/types/auth";
import axios from "axios";
import { toast } from "react-toastify";

const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

export async function registerUser(values: RegisterValues): Promise<any> {
  try {
    const res = await axios.post(`${base_url}/auth/register`, values, {});
    toast.success("Registration successful!");
    return res.data;
  } catch (err: unknown) {
    console.error("Registration failed:", err);
    throw err;
  }
}

export async function loginUser(values: { email: string; password: string }) {
  try {
    const payload = { email: values.email, password: values.password };
    const res = await axios.post(`${base_url}/auth/login`, payload);

    // Menyimpan token di localStorage
    localStorage.setItem("token", res.data.token);
    console.log("Token saved to localStorage:", res.data.token);

    return res.data;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
}

// 🆕 Fungsi login dengan Google
export async function loginWithGoogle(googleToken: string) {
  try {
    const res = await fetch(`${base_url}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: googleToken }),
    });

    if (!res.ok) {
      throw new Error(`Google login failed: ${res.statusText}`);
    }

    const data = await res.json(); 

    localStorage.setItem("token", data.token);
    toast.success("Login successful with Google!");
    return data;
  } catch (error) {
    console.error("Google Login failed:", error);
    toast.error("Google login failed. Please try again.");
    throw error;
  }
}