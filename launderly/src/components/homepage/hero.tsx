"use client"

import Image from "next/image";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="bg-[#00CCDD] py-16 md:py-0 md:px-48 text-black">
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between px-4 md:h-screen">
        {/* Bagian kiri: Teks */}
        <motion.div
          className="md:w-1/2 text-center md:text-left mb-8 md:mb-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-7xl font-bold mb-4">
            Effortless Laundry <br />
            at Your Doorstep!
          </h1>
          <p className="md:text-xl mb-6">
            Experience the convenience of our professional laundry service with
            pickup and delivery. Save time and enjoy fresh, clean clothes
            without the hassle!
          </p>
        </motion.div>

        {/* Bagian kanan: Grid 3 gambar */}
        <motion.div
          className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Gambar pertama */}
          <motion.div
            className="relative w-full h-[200px] sm:h-[250px] md:h-[300px]"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src="/homepage.jpeg"
              alt="Fashion 1"
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </motion.div>
          {/* Gambar kedua */}
          <motion.div
            className="relative w-full h-[200px] sm:h-[250px] md:h-[300px]"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src="/homepage1.jpeg"
              alt="Fashion 2"
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </motion.div>
          {/* Gambar ketiga, melebar di 2 kolom */}
          <motion.div
            className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] sm:col-span-2"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src="/sign-in.jpeg"
              alt="Fashion 3"
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}