import DefaultLoading from "@/components/feat-3/defaultLoading";
import { Footer } from "@/components/homepage/footer";
export default function LoadingPage() {
    
  return (
    <div className="bg-blue-white w-full min-h-screen ">
      <div className="py-20 flex flex-col gap-7 justify-center items-center">
        <DefaultLoading />
      </div>
      <Footer />
    </div>
  );
}
