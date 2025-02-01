// useSession.tsx atau context/useSession.tsx

"use client";

import { getUserProfile } from "@/api/auth";
import { IPromotor, IUser } from "@/types/user";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface SessionContextProps {
  isAuth: boolean;
  user: IUser | IPromotor | null;
  loading: boolean; // Menambahkan loading di sini
  setIsAuth: (isAuth: boolean) => void;
  setUser: (user: IUser | IPromotor | null) => void;
}

const SessionContext = createContext<SessionContextProps | undefined>(
  undefined
);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | IPromotor | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // State loading

  const checkSession = async () => {
    try {
      // Cek apakah berada di sisi klien (untuk akses localStorage)
      if (typeof window !== "undefined") {
        const role = localStorage.getItem("role");
        const token = localStorage.getItem("token");

        if (!role || !token) {
          throw new Error("No session available");
        }

        // Mengambil data pengguna dari API
        const result = await getUserProfile(role, token);

        if (result?.user) {
          setUser(result.user);
          setIsAuth(true);
        } else {
          throw new Error("User not found");
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // Set loading selesai setelah proses selesai
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <SessionContext.Provider
      value={{ isAuth, user, loading, setIsAuth, setUser }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextProps => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
