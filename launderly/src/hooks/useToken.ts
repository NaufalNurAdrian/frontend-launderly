import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export const useToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        toast.error("Unauthorized!");
        router.push("/sign-in");
      } else {
        setToken(storedToken);
      }
    }
  }, [router]);

  return token;
};