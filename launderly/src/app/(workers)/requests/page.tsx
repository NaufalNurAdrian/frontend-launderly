"use client";
import DriverRequestLists from "@/components/feat-3/driver/requestsLists";
import Navbar from "@/components/feat-3/navbar";
import WorkerRequestLists from "@/components/feat-3/worker/requestsLists";
import { useRole } from "@/hooks/useRole";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { useRef, useState } from "react";
import SwiperButton from "@/components/feat-3/swipperButton";
import WorkerSidebar from "@/components/feat-3/workerSidebar";
import ProtectedPage from "@/hoc/protectedRoutes";

export default function RequestsPage() {
  const role = useRole();
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <ProtectedPage allowedRoles={["DRIVER", "WORKER"]}>
          <div className="flex bg-[url('/LaundryPattern.jpeg')] bg-repeat w-full min-h-screen">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-300 opacity-40 z-0"></div>
        <div className="relative z-30">
          <div>
            <span className="hidden lg:block">
              <WorkerSidebar />
            </span>
            <span className="max-md:block lg:hidden">
              <Navbar />
            </span>
          </div>
        </div>

        <div className="w-full flex flex-col items-center lg:mt-0 mt-10 lg:mx-0 mx-4 z-20">
          <h1 className="lg:mt-8 mb-6 text-3xl text-blue-500 font-bold text-start lg:text-center">Requests Waiting for You...</h1>

          {role === "DRIVER" ? (
            <div className="max-sm:w-full">
              <div className="hidden lg:flex lg:flex-row justify-between gap-16">
                <DriverRequestLists type="pickup" />
                <DriverRequestLists type="delivery" />
              </div>

              <div className="lg:hidden">
                <Swiper spaceBetween={15} slidesPerView={1} centeredSlides={true} onSwiper={(swiper) => (swiperRef.current = swiper)} onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)} className="w-full overflow-visible">
                  <SwiperSlide className="h-auto min-h-[200px] w-full">
                    <DriverRequestLists type="pickup" />
                  </SwiperSlide>
                  <SwiperSlide className="h-auto min-h-[200px] w-full">
                    <DriverRequestLists type="delivery" />
                  </SwiperSlide>
                </Swiper>
                {activeIndex === 1 && <SwiperButton direction="prev" onClick={() => swiperRef.current?.slidePrev()} />}
                {activeIndex === 0 && <SwiperButton direction="next" onClick={() => swiperRef.current?.slideNext()} />}
              </div>
            </div>
          ) : (
            <WorkerRequestLists />
          )}
        </div>
      </div>
    </ProtectedPage>
  );
}
