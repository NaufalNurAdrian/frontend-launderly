"use client"

import Image from "next/image";
import { motion } from "framer-motion";

export function WhyUs() {
  return (
    <section
      id="WhoWeAre"
      className="bg-[#7CF5FF] py-16 px-4 md:px-48 text-black"
    >
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between md:gap-16 md:h-screen">
        {/* Bagian kiri: Foto */}
        <motion.div
          className="md:w-1/2 w-full"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative w-full h-[300px] md:h-[500px]">
            <Image
              src="/us1.jpeg"
              alt="Who We Are"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
          </div>
        </motion.div>

        {/* Bagian kanan: Teks */}
        <motion.div
          className="md:w-1/2 text-center md:text-start mt-8 md:mt-0"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800">
            Who We Are
          </h1>
          <p className="md:text-lg text-gray-700 leading-relaxed mb-4">
            We are a trusted and professional laundry service dedicated to
            making your life easier. With our premium washing and ironing
            services, we ensure your clothes are fresh, clean, and neatly
            pressed every time.
          </p>
          <p className="md:text-lg text-gray-700 leading-relaxed mb-4">
            Plus, enjoy affordable delivery fees! If you're within 5km of our
            location, the delivery fee is only{" "}
            <span className="font-bold text-cyan-600">Rp. 5000</span>. You can
            easily use our laundry service from the comfort of your home.
          </p>
          <p className="md:text-lg text-gray-700 leading-relaxed">
            Don't worry! If your home is within{" "}
            <span className="font-bold text-cyan-600">5km</span>, our service is
            available for you!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
