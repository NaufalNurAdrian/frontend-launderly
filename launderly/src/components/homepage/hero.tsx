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
    <main className="bg-cyan-100 flex flex-col items-center">
      <div className="w-full md:w-[700px] h-72 md:h-96 relative">
        <div className="absolute inset-0 transition-opacity duration-500">
          <Image
            src={images[activeIndex].src}
            alt="Carousel Image"
            fill
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <p className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center px-4">
              {images[activeIndex].text}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 py-4">
        {images.map((_, index) => (
          <button
            key={index}
            className={`btn btn-accent btn-xs ${activeIndex === index ? " text-white" : "bg-gray-300"}`}
            onClick={() => setActiveIndex(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </main>
  );
}
