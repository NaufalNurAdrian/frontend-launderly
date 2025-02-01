import { LoginResponse, RegisterValues } from "@/types/auth";
import axios from "axios";
import { toast } from "react-toastify";

const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

export async function registerUser(values: RegisterValues): Promise<any> {
  try {
    const res = await axios.post(`${base_url}/auth/register`, values, {});

    toast.success(res.data.message || "Registration successful!");
    return res.data;
  } catch (err: unknown) {
    console.error("Registration failed:", err);
    throw err;
  }
}

export async function loginUser(values: {
  username: string;
  role: string;
  password: string;
}) {
  const payload = {
    data: {
      username: values.username,
      role: values.role,
    },
    password: values.password,
  };

  const res = await axios.post<LoginResponse>(
    `${base_url}/auth/login`,
    payload,
    {
      withCredentials: true,
    }
  );

  return res.data;
}

export async function getUserProfile(role: string, token: string) {
  if (role !== "customer") {
    throw new Error("Invalid role");
  }

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
