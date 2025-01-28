import Image from "next/image";

export function Hero() {
  return (
    <div className="bg-cyan-400" id="Hero">
      <div className="carousel w-full h-60 sm:h-80 md:h-[400px] lg:h-[500px]">
        <div id="item1" className="carousel-item w-full relative">
          <Image
            src="/carousel1.jpeg"
            alt="Why us?"
            fill
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <p className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center px-4">
              Why us?
            </p>
          </div>
        </div>
        <div id="item2" className="carousel-item w-full relative">
          <Image
            src="/carousel2.jpeg"
            alt="Why us?"
            fill
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <p className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center px-4">
              We'll Pick Up Your Laundry, So You Don’t Have To!
            </p>
          </div>
        </div>
        <div id="item3" className="carousel-item w-full relative">
          <Image
            src="/carousel3.gif"
            alt="Why us?"
            fill
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <p className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center px-4">
              We Deliver the Best Service, Just for You!
            </p>
          </div>
        </div>
        <div id="item4" className="carousel-item w-full relative">
          <Image
            src="/carousel4.jpeg"
            alt="Why us?"
            fill
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <p className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center px-4">
              So Just Relax with a cup of tea while we deliver your freshly
              cleaned laundry to your doorstep!
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full justify-center gap-2 py-2">
        <a href="#item1" className="btn btn-xs">
          1
        </a>
        <a href="#item2" className="btn btn-xs">
          2
        </a>
        <a href="#item3" className="btn btn-xs">
          3
        </a>
        <a href="#item4" className="btn btn-xs">
          4
        </a>
      </div>
    </div>
  );
}
