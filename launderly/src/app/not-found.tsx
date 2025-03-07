import NotFound from "@/components/feat-3/notFound";
import { Footer } from "@/components/homepage/footer";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="bg-blue-white w-full min-h-screen ">
      <div className="py-20 flex flex-col gap-7 justify-center items-center">
    <NotFound text="404 Not Found"/>
    <button className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-xl">
      <Link href={"/"}>
      Back to Landing page
      </Link>
    </button>
      </div>
    <Footer/>
    </div>
  );
}
