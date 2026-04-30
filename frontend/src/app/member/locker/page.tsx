"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type MyLocker = {
  LockerID: string;
  Zone: string;
  STATUS: string;
} | null;

export default function YourLockerPage() {
  const [locker, setLocker] = useState<MyLocker>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyLocker = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const res = await fetch("http://127.0.0.1:8000/member/my-locker", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 404) {
          setLocker(null);
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch locker");

        const data = await res.json();
        setLocker(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyLocker();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 flex flex-col items-center">
      {/* Title */}
      <div className="w-full max-w-md mt-6 mb-8 flex flex-col items-center">
        <h2 className="text-2xl font-extrabold text-gray-900">Your Locker</h2>
        <div className="border-t-2 border-gray-900 w-16 mt-3"></div>
      </div>

      {loading ? (
        <p className="text-gray-500 font-medium">Loading your locker...</p>
      ) : locker ? (
        
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center">
          <h3 className="text-3xl font-black text-gray-900">{locker.LockerID}</h3>
          
          <div className="flex gap-2 mt-3">
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
              {locker.Zone}
            </span>
            <span className="bg-[#EDE8FF] text-[#5F33E1] px-3 py-1 rounded-full text-sm font-bold">
              {locker.STATUS}
            </span>
          </div>

          <div className="w-full border-t border-dashed border-gray-300 my-6"></div>

          <p className="text-xs text-gray-500">
            To extend your rental period or change lockers, please contact the gym manager.
          </p>
          
          <Link href="/member" className="w-full mt-4">
            <button className="w-full bg-[#F3F4F6] text-gray-700 hover:bg-gray-200 py-3 rounded-xl font-bold transition">
              Back to Dashboard
            </button>
          </Link>
        </div>

      ) : (

        <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-gray-200 p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-3xl opacity-50">
            🔒
          </div>
          <h3 className="text-lg font-bold text-gray-900">No Active Locker</h3>
          <p className="text-sm text-gray-500 mt-2 mb-6">
            You currently don't have a locker assigned to your account.
          </p>
          
          <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-xl p-4 w-full">
            <p className="text-sm text-[#F57F17] font-semibold">
              Want to rent a locker? <br/>
              <span className="font-normal text-xs mt-1 block text-[#FF6F00]">
                Please contact the gym reception or the manager at the front desk to reserve your space.
              </span>
            </p>
          </div>

          <Link href="/member" className="w-full mt-6">
            <button className="w-full bg-[#EDE8FF] text-[#5F33E1] py-3 rounded-xl font-bold transition">
              Back to Dashboard
            </button>
          </Link>
        </div>

      )}
    </div>
  );
}