import { PuffLoader } from "react-spinners";

export default function SpinnerLoader() {
  return (
    <div className="flex justify-center items-center h-screen">
      <PuffLoader color="#3B82F6" size={100} />
    </div>
  );
}