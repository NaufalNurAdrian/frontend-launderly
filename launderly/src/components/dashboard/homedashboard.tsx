import Image from "next/image";

function HomeDashboard() {
  return (
    <div className="p-5 space-y-5 w-full">
      {/* Top Section: Balance and Report */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Balance Card */}
        <div className="bg-white shadow-lg rounded-xl">
          <div className="flex bg-sky-400 rounded-t-xl p-3 text-lg sm:text-xl justify-between items-center">
            <div className="text-white font-semibold">BALANCE</div>
            <Image alt="balance" src="/Card Wallet.svg" width={30} height={30} />
          </div>
          <div className="p-5">
            <div className="text-2xl sm:text-4xl font-bold text-gray-800">
              Rp. 000.000.000
            </div>
            <div className="text-sm text-gray-500 mt-1">0% This Week</div>
          </div>
        </div>

        {/* Report Card */}
        <div className="bg-white shadow-lg rounded-xl">
          <div className="flex bg-sky-400 rounded-t-xl p-3 text-lg sm:text-xl justify-between items-center">
            <div className="text-white font-semibold">REPORT</div>
            <Image alt="report" src="/Attendance.svg" width={30} height={30} />
          </div>
          <div className="p-5 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Total Order</span>
              <span>0</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Received</span>
              <span>0</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>On Progress</span>
              <span>0</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Completed</span>
              <span>0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Order Section */}
      <div className="bg-white shadow-lg rounded-xl">
        <div className="flex justify-between items-center bg-gray-200 p-3 rounded-t-xl">
          <h2 className="font-semibold text-gray-700 text-lg sm:text-xl">
            Recent Order
          </h2>
          <button className="text-sm text-sky-500 font-medium hover:underline">
            See All
          </button>
        </div>
        <div className="p-5 space-y-3">
          {/* Order Item (Repeatable) */}
          {Array(4)
            .fill(null)
            .map((_, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-sky-400 rounded-full"></div>
                  <div>
                    <h3 className="text-gray-700 font-medium text-sm sm:text-base">
                      Order #{idx + 1}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Status: On Progress
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">Rp. 000.000</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default HomeDashboard;
