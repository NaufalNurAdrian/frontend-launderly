import { ResetPassword } from "@/types/auth";
import axios from "axios";
import { toast } from "react-toastify";

const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

export async function getUserProfile(token: string) {
  try {
    const res = await axios.get(`${base_url}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function resetPassword(values: ResetPassword) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in again.");
      throw new Error("No token found.");
    }

    const payload = {
      password: values.password,
      confirmPassword: values.confirmPassword,
    };

    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL_BE}/user/resetpassword`,
      payload,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(response.data.message || "Password reset successfully!");
    return response.data;
  } catch (err) {
    toast.error("Failed to reset password. Please try again.");
    console.error("Error resetting password:", err);
    throw err;
  }
}
