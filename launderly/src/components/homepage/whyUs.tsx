import Image from "next/image";

export function WhyUs() {
  return (
    <section id="WhoWeAre" className="bg-[#7CF5FF] py-16 md:py-0 md:px-48 text-black">
      <div className="mx-auto flex flex-col md:flex-row md:gap-10 items-center justify-between px-4 md:h-screen">
        {/* Bagian kiri: Foto */}
        <div className="md:w-1/2  w-full">
          {/* Gambar pertama */}
          <div className="relative w-full h-[200px] md:h-[700px]">
            <Image
              src="/us1.jpeg"
              alt="Fashion 1"
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </div>
        </div>

        {/* Bagian kanan: Teks */}
        <div className="md:w-1/2 text-center md:text-start mb-8 md:mb-0 mt-4">
          <h1 className="text-4xl md:text-7xl font-bold mb-4">Who We Are</h1>
          <p className="md:text-xl mb-6">
            We are a trusted and professional laundry service dedicated to
            making your life easier. With our premium washing and ironing
            services, we ensure your clothes are fresh, clean, and neatly
            pressed every time.
          </p>
          <p className="md:text-xl mb-6">
            Plus, enjoy affordable delivery fees! If you're within 5km of our
            location, the delivery fee is only 5K, making it more convenient
            than ever to get your laundry done without leaving home.
          </p>
        </div>
      </div>
    </section>
  );
}
