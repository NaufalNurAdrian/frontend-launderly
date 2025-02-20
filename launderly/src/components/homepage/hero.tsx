
"use client"

import { useState } from "react";
import Image from "next/image";

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  const images = [
    { src: "/carousel1.jpeg", text: "Why us?" },
    { src: "/carousel2.jpeg", text: "We'll Pick Up Your Laundry, So You Don’t Have To!" },
    { src: "/carousel3.gif", text: "We Deliver the Best Service, Just for You!" },
    { src: "/carousel4.jpeg", text: "So Just Relax with a cup of tea while we deliver your freshly cleaned laundry to your doorstep!" },
  ];

  return (
    <section className="bg-[#00CCDD] py-16 md:py-0 md:px-48 text-black">
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between px-4 md:h-screen">
        {/* Bagian kiri: Teks */}
        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-4xl md:text-7xl font-bold mb-4">
            Effortless Laundry <br />
            at Your Doorstep!
          </h1>
          <p className="md:text-xl mb-6">
            Experience the convenience of our professional laundry service with
            pickup and delivery. Save time and enjoy fresh, clean clothes
            without the hassle!
          </p>
        </div>

        {/* Bagian kanan: Grid 3 gambar */}
        <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {/* Gambar pertama */}
          <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px]">
            <Image
              src="/homepage.jpeg"
              alt="Fashion 1"
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </div>
          {/* Gambar kedua */}
          <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px]">
            <Image
              src="/homepage1.jpeg"
              alt="Fashion 2"
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </div>
          {/* Gambar ketiga, melebar di 2 kolom */}
          <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] sm:col-span-2">
            <Image
              src="/sign-in.jpeg"
              alt="Fashion 3"
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
