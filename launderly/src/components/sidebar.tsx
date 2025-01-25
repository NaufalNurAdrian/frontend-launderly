import Image from "next/image";
import { IoStorefrontSharp } from "react-icons/io5";


function Sidebar() {
  return (
    <div className="container mx-auto h-screen w-[50px] md:w-[200px] flex flex-col justify-between bg-zinc-100 p-2 ">
      <div>

      </div>
      <div className="gap-10 flex flex-col items-start pl-2">
        <div className="flex flex-row gap-4">
          
            <Image
            alt="dashboard"
            src="/dashboard Layout.svg"
            width={30}
            height={30}
            />
            <div className="text-xl font-bold text-gray-700 hidden md:block">
              Dashboard
            </div>
        </div>
        <div className="flex flex-row gap-4">
            <Image
            alt="dashboard"
            src="/Online Store.svg"
            width={30}
            height={30}
            />
            <div className="text-xl font-bold text-gray-700 hidden md:block">
              Outlet
            </div>
        </div>
        <div className="flex flex-row gap-4">
            <Image
            alt="customer"
            src="/customer.svg"
            width={30}
            height={30}
            />
            <div className="text-xl font-bold text-gray-700 hidden md:block">
              Employee
            </div>
        </div>
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
        <div className="flex flex-row gap-4">
            <Image
            alt="settings"
            src="/Settings.svg"
            width={30}
            height={30}
            />
            <div className="text-xl font-bold text-gray-700 hidden md:block">
              Settings
            </div>
        </div>
      </div>
      <div className="gap-7 pb-10 flex items-start flex-col pl-2">
        <div className="flex flex-row gap-4">
            <Image
            alt="profile"
            src="/Male User.svg"
            width={30}
            height={30}
            />
            <div className="text-xl font-bold text-gray-700 hidden md:block">
              Profile
            </div>
        </div>
        <div className="flex flex-row gap-4">
            <Image
            alt="profile"
            src="/Export.svg"
            width={30}
            height={30}
            />
            <div className="text-xl font-bold text-red-600 hidden md:block">
              Log Out
            </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;