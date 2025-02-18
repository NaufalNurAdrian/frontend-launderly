"use client";

import { useState } from "react";
import Image from "next/image";

export function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const images = [
    {
      src: "/carousel1.jpeg",
      text: "I quite like doing laundry. I find it quite like relaxing.",
    },
    {
      src: "/carusol2.jpeg",
      text: "I love the smell of clean laundry. Working in the garden and getting my hands dirty. Doing the dishes. These are the things that make me feel normal.",
    },
    {
      src: "/carusol1.jpeg",
      text: "Don't judge. I used to buy underwear because I didn't do my laundry.",
    },
    {
      src: "/carousel4.jpeg",
      text: "We are coming down from our pedestal and up from the laundry room.",
    },
  ];

  return (
    <main id="Quotes" className="bg-[#7CF5FF] flex flex-col items-center justify-center w-full">
      {/* Container Gambar */}
      <div className="relative flex items-center justify-center w-full h-72 md:h-96">
        <div className="relative w-[90%] max-w-[700px] h-[200px] md:h-[300px] md:max-w-[1000px] mx-auto bg-gray-100">
          <Image
            src={images[activeIndex].src}
            alt="Carousel Image"
            fill
            className="object-cover rounded-lg opacity-60" 
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <p className="text-blue-100 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center px-4">
              {images[activeIndex].text}
            </p>
          </div>
        </div>
      </div>

      {/* Navigasi Carousel */}
      <div className="flex justify-center gap-2 py-4">
        {images.map((_, index) => (
          <button
            key={index}
            className={`btn btn-accent btn-xs ${
              activeIndex === index ? "text-white bg-blue-600" : "bg-gray-300"
            }`}
            onClick={() => setActiveIndex(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </main>
  );
}
