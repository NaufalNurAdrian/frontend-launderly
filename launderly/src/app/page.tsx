import { Footer } from "@/components/homepage/footer";
import { Carousel } from "@/components/homepage/carousel";
import { LaundryServices } from "@/components/homepage/laundryService";
import { Navbar } from "@/components/homepage/navbar";
import { WhyUs } from "@/components/homepage/whyUs";
import { Hero } from "@/components/homepage/hero";
import { Promo } from "@/components/homepage/promo";

export default function Home() {
  return (
    <div className="bg-white w-full h-auto">
      <Navbar />
      <Hero />
      <WhyUs />
      <LaundryServices />
      <Promo/>
      <Carousel />
      <Footer />
    </div>
  );
}
