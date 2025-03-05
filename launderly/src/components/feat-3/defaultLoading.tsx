import { PuffLoader } from "react-spinners";

export default function DefaultLoading() {
  return (
    <div className="flex justify-center items-center my-4">
      <PuffLoader color="#3B82F6" size={100} />
    </div>
  );
}
