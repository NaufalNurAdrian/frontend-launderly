"use client";

import { IUser } from "@/types/user";
import axios from "axios";
import { useEffect, useState } from "react";

const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

const useSession = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<IUser | null>(null);

  const checkSession = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const { data } = await axios.get(`${base_url}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("User data received:", data);
      if (data) {
        setUser(data.user);
        setIsAuth(true);
        console.log("User state set:", data.user);
      }
    } catch (err) {
      console.error("Session check failed:", err);
      setIsAuth(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return { user, isAuth, isLoading, setIsAuth, setUser, setIsLoading };
};

export default useSession;
