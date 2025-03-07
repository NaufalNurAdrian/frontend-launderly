import {  ChevronLeft, ChevronRight } from "lucide-react";

type SwiperButtonProps = {
    direction: "prev" | "next";
    onClick: () => void;
  };
  
  export default function SwiperButton({ direction, onClick }: SwiperButtonProps) {
    return (
      <button
        onClick={onClick}
        className={`fixed top-1/2 z-20 transform -translate-y-1/2 w-10 h-10 bg-blue-300/60 border border-blue-500 items-center flex justify-center text-3xl  text-white p-2 rounded-full shadow-md ${
          direction === "prev" ? "left-2" : "right-6"
        }`}
      >
        {direction === "prev" ? (<ChevronLeft/> ): (<ChevronRight/>) }
      </button>
    );
  }
  