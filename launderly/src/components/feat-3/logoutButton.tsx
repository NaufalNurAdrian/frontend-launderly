"use client";
import { IoLogOutOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { deleteCookie } from "@/libs/action";

export default function LogoutButton() {
  const router = useRouter();

  const onLogout = () => {
    deleteCookie("token");
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <button onClick={onLogout} className="text-[#1678F2] hover:text-red-500 transition">
      <IoLogOutOutline size={30} />
    </button>
  );
}
