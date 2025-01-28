import Sidebar from "@/components/feat-3/sidebar";


export default function History() {
  return (
    <div className="flex bg-white w-screen">
      <Sidebar />

      <div className="w-screen flex flex-col justify-center mt-10">
        <h1 className="m-4 text-2xl font-bold text-center"> History </h1>
      </div>
    </div>
  );
}
