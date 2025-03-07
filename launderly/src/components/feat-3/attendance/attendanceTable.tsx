import formatDate from "@/helpers/dateFormatter";
import { formatTime } from "@/helpers/timeFormatter";

interface IAttendance {
  date: string;
  workHour: number;
  checkIn: Date;
  checkOut: Date | null;
}

export default function Table({ date, workHour, checkIn, checkOut }: IAttendance) {
  return (
    <div className=" flex w-full justify-between h-[130px] border-2 my-4">
      <div className="flex p-2 flex-col">
        <p className="px-2 rounded-full max-sm:text-sm text-blue-600">{formatDate(date)}</p>
        <div className="px-5 mt-3 py-2 flex flex-col justify-center items-center">
          <h1 className="lg:text-3xl text-2xl">
            {workHour} <span className="text-lg">total hours</span>
          </h1>
        </div>
      </div>

      <div className="flex flex-col p-2 justify-center items-center mx-2 lg:mx-10 gap-1">
        <p className="text-neutral-400">In & Out :</p>
        <h1 className="font-bold text-sm lg:text-xl">
          {formatTime(checkIn)} <span className="font-normal">•••</span> {checkOut ? formatTime(checkOut) : "..."}
        </h1>
      </div>
    </div>
  );
}