import Image from "next/image";
import Link from "next/link";

function Sidebar() {
  return (
    <div className="container fixed h-full w-[50px] md:w-[250px] flex flex-col justify-between bg-zinc-200 p-2 z-50 rounded-br-3xl">
      <div></div>
      <div className="container gap-10 flex flex-col items-start pl-2">
        <Link href="/dashboard" className="flex flex-row gap-4">
          <Image
            alt="dashboard"
            src="/dashboard Layout.svg"
            width={30}
            height={30}
          />
          <div className="text-xl font-bold text-gray-700 hidden md:block">
            Dashboard
          </div>
        </Link>
        <Link href="/dashboard/outlet" className="flex flex-row gap-4">
          <Image alt="outlet" src="/Online Store.svg" width={30} height={30} />
          <div className="text-xl font-bold text-gray-700 hidden md:block">
            Outlet
          </div>
        </Link>
        <Link href="/dashboard/employee" className="flex flex-row gap-4">
          <Image alt="customer" src="/customer.svg" width={30} height={30} />
          <div className="text-xl font-bold text-gray-700 hidden md:block">
            Employee
          </div>
        </Link>
        <Link href="/dashboard/order">
          <div className="flex flex-row gap-4">
            <Image
              alt="troley"
              src="/Shopping Trolley.svg"
              width={30}
              height={30}
            />
            <div className="text-xl font-bold text-gray-700 hidden md:block">
              Orders
            </div>
          </div>
        </Link>
          <Link href="/dashboard/bypass">
        <div className="flex flex-row gap-4">
          <Image alt="settings" src="/Settings.svg" width={30} height={30} />
          
          <div className="text-xl font-bold text-gray-700 hidden md:block">
            Bypass
          </div>
        </div>
          </Link>
      </div>
      <div className="gap-7 pb-10 flex items-start flex-col pl-2">
        <div className="flex flex-row gap-4">
          <Image alt="profile" src="/Male User.svg" width={30} height={30} />
          <div className="text-xl font-bold text-gray-700 hidden md:block">
            Profile
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <Image alt="profile" src="/Export.svg" width={30} height={30} />
          <div className="text-xl font-bold text-red-600 hidden md:block">
            Log Out
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
