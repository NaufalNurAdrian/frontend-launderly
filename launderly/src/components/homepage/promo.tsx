"use client";

import { Link } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function Promo() {
  const router = useRouter();
  return (
    <section className="flex flex-col md:flex-row md:h-[300px] items-center text-black bg-[#7CF5FF] md:rounded-lg overflow-hidden shadow-lg py-20 md:px-80 md:py-52">
      {/* Bagian Kiri - Teks */}
      <div className="md:w-1/2 w-full bg-brown-700 p-8 md:p-12 md:h-[300px] bg-black">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Ready to Laundry?
        </h2>
        <p className="text-lg mb-6 text-white">
          Call us and we will make your dirty laundry clean like new again!.
        </p>
        <button
          onClick={() => router.push("/sign-in")}
          className="bg-white text-brown-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Laundry Now
        </button>
      </div>

      {/* Bagian Kanan - Gambar */}
      <div className="relative w-[700px] h-[200px] md:h-[300px]">
        <Image
          src="/us1.jpeg"
          alt="Fashion 1"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </section>
  );
}
