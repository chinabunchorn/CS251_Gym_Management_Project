"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthGuard from "../../components/AuthGuard";

type Locker = {
  id: string;
  zone: string;
  status: string;
  startDate: string;
  endDate: string;
};

export default function LockerPage() {
  const [locker, setLocker] = useState<Locker | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //  mock data >< fetch later
    const mockLocker: Locker = {
      id: "Locker 1A",
      zone: "Zone A",
      status: "Active",
      startDate: "1 Apr 2026",
      endDate: "1 May 2026",
    };

    setTimeout(() => {
      setLocker(mockLocker);
      setLoading(false);
    }, 500);
  }, []);

  return (
    //<AuthGuard>
    <div className="min-h-screen bg-white p-4">
      
      {/* Header */}
      {/* <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-black">Locker</h1>
      </div> */}

      {/* Title */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-2xl">🗄️</span>
        <h2 className="text-lg font-extrabold text-black">Your Locker</h2>
      </div>

        <div className="border-t border-[#000000] w-full mt-2 mb-2"></div>

      {/* Divider */}
      

      {/* Locker pic */}
        <img
          src="/locker/locker.png"
          alt="gym"
          className="block mx-auto w-[32px] h-[32px] object-cover  p-4"
        />

      {/* Bottom line */}
      <div className="w-full h-[4px] bg-black mb-6"></div>

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Locker Card */}
      {locker && (
        <div className="bg-white rounded-2xl shadow p-5 text-center max-w-sm mx-auto mb-5">
          <h3 className="font-bold text-lg text-gray-800 mb-1">
            {locker.id}
          </h3>

          <p className="text-sm font-semibold text-black">{locker.zone}</p>

          <p className="text-sm font-semibold text-black mt-2">
            Status :{" "}
            <span className="font-semibold text-black">
              {locker.status}
            </span>
          </p>

          <p className="text-sm font-semibold text-black mt-2">
            Rent Duration : 1 Month
          </p>

          <div className="w-full h-[1px] bg-gray-300 my-2"></div>

          {/* Dates */}
          <div className="border-t border-[#000000] w-full mt-2 mb-2"></div>
          <div className="text-sm font-semibold text-black">
            <p> Start Date : {locker.startDate}</p>
            <p className="mt-2"> Expires : {locker.endDate}</p>
          </div>

          {/* back to home */}
          <Link href="/member">
            <button className="mt-4 w-full bg-[#EDE8FF] text-[#5F33E1] py-2 rounded-xl font-medium">
              Back to Home
            </button>
          </Link>
        </div>
      )}

      {/* Footer text */}
      <p className="text-xs text-gray-500 text-center ">
        if you'd like to extend your locker, please contact your gym’s manager
      </p>
    </div>
    //</AuthGuard>
  );
}