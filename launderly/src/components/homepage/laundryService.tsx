import Image from "next/image";

export function LaundryServices() {
  return (
    <div id="Services" className=" bg-[#7CF5FF] px-6 md:px-48 ">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl md:text-7xl font-bold mb-4">
          Our Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Washing Service */}
          <div className="bg-white p-6 rounded-lg shadow-lg transition transform hover:scale-105">
            <div className="relative w-full h-48 mb-4">
              <Image
                src="/services1.gif" 
                alt="Washing Service"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">
              Washing Service
            </h3>
            <p className="text-lg text-gray-600">
              We provide high-quality washing services, ensuring your clothes
              are clean, fresh, and well-cared for.
            </p>
          </div>

          {/* Ironing Service */}
          <div className="bg-white p-6 rounded-lg shadow-lg transition transform hover:scale-105">
            <div className="relative w-full h-48 mb-4">
              <Image
                src="/carousel3.gif" 
                alt="Ironing Service"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">
              Ironing Service
            </h3>
            <p className="text-lg text-gray-600">
              Our ironing service ensures that your clothes are wrinkle-free and
              ready to wear, giving them a professional finish.
            </p>
          </div>

          {/* Pickup Service */}
          <div className="bg-white p-6 rounded-lg shadow-lg transition transform hover:scale-105">
            <div className="relative w-full h-48 mb-4">
              <Image
                src="/why1.gif"
                alt="Washing Service"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">
              PickUp Service
            </h3>
            <p className="text-lg text-gray-600">
              Check if there's an outlet near your location! If so, enjoy our
              pick-up service, and relax at home while we handle your laundry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
