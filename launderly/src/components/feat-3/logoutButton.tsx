"use client";
import { useRouter } from "next/navigation";
import { deleteCookie } from "@/libs/action";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  const onLogout = () => {
    deleteCookie("token");
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <button onClick={onLogout} className="text-red-500  hover:text-red-500 transition">
      <LogOut size={20} />
    </button>
  );
}
