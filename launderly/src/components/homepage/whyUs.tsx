import Image from "next/image";

export function WhyUs() {
  return (
    <div id="WhyUs" className="bg-cyan-100 py-16 px-6 md:px-12 lg:px-24">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-12">Why us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* PickUp Service */}
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

          {/* Laundry Service */}
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
              Laundry Service
            </h3>
            <p className="text-lg text-gray-600">
              Our services include washing, ironing, and packing—leaving your
              clothes fresh and ready for use!
            </p>
          </div>

          {/* Affordable Prices */}
          <div className="bg-white p-6 rounded-lg shadow-lg transition transform hover:scale-105">
          <div className="relative w-full h-48 mb-4">
              <Image
                src="/wyh2.jpeg"
                alt="Washing Service"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">
              Affordable Prices
            </h3>
            <p className="text-lg text-gray-600">
              Enjoy high-quality laundry services at affordable prices, ensuring
              great value for your money.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
