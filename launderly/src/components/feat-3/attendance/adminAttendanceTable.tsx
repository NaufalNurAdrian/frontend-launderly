import { formatTime } from "@/helpers/timeFormatter";

interface IAttendanceTable {
    date: string;
    workHour: number;
    checkIn: Date;
    checkOut: Date;
    id: number;
    username: string
}
export default function AttendanceTable({date, workHour, checkIn, checkOut, id, username}: IAttendanceTable) {
    return(
        <div>
          <table className="table-fixed">
  <thead>
    <tr>
      <th>Date</th>
      <th>Id</th>
      <th>Name</th>
      <th>Check In</th>
      <th>Check Out</th>
      <th>Total Work Hour</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{date}</td>
    </tr>
    <tr>
      <td>{id}</td>
    </tr>
    <tr>
      <td>{username}</td>
    </tr>
    <tr>
      <td>{workHour}</td>
    </tr>
    <tr>
      <td>{formatTime(checkIn)}</td>
    </tr>
    <tr>
      <td>{formatTime(checkOut)}</td>
    </tr>
  </tbody>
</table>
        </div>
    )
}