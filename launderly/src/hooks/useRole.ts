import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  userId: string;
  role: string; 
}

export const useRole = () => {
  const [role, setRole] = useState<string | null>(null); 
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        toast.error("Unauthorized!");
        router.push("/sign-in");
      } else {
        try {
          const decodedToken = jwtDecode<JwtPayload>(storedToken); // Gunakan tipe generic
          const userRole = decodedToken.role; // Ambil role dari token
          setRole(userRole);
        } catch (error) {
          toast.error("Invalid token!");
          router.push("/sign-in");
        }
      }
    }
  }, [router]);

  return role;
};