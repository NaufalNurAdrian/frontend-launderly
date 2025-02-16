import { About } from "@/components/homepage/about";
import { Footer } from "@/components/homepage/footer";
import { Hero } from "@/components/homepage/hero";
import { LaundryServices } from "@/components/homepage/laundryService";
import { Navbar } from "@/components/homepage/navbar";
import { WhyUs } from "@/components/homepage/whyUs";


export default function Home() {
  return (
    <div className="bg-white w-full h-auto">
      <Navbar/>
      <About/>
      <WhyUs/>
      <LaundryServices/>
      <Hero/>
      <Footer/>
    </div>
  );
}
