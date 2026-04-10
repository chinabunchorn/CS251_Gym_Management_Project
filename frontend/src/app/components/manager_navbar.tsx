"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <div className="w-full bg-[#EDE8FF] flex items-center justify-between px-8 py-4 text-[#1A1A1B]">
      
      {/* Left Logo */}
      <div className="flex items-center gap-2">
        <img src="/trainer/logo.png" className="h-8" />
      </div>

      {/* Center Menu */}
      <div className="flex items-center gap-15 text-gray-800 font-medium">
        
        <div className="flex items-center gap-2 cursor-pointer hover:text-[#896CFE]">
          <img src="/trainer/home.png" className="h-8" />
          <Link href="/manager/dashboard">HOME</Link>
        </div>

        <div className="flex items-center gap-2 cursor-pointer hover:text-[#896CFE]">
          <img src="/trainer/classes.png" className="h-8" />
          <Link href="/manager/classes">CLASSES</Link>
        </div>

        <div className="flex items-center gap-2 cursor-pointer hover:text-[#896CFE]">
          <img src="/members.png" className="h-8" />
          <Link href="/manager/members">MEMBERS</Link>
        </div>

        <div className="flex items-center gap-2 cursor-pointer hover:text-[#896CFE]">
          <img src="/icons/Star.svg" className="h-8" />
          <Link href="/manager/trainers">TRAINERS</Link>
        </div>

        <div className="flex items-center gap-2 cursor-pointer hover:text-[#896CFE]">
          <img src="/icons/Discount.svg" className="h-8" />
          <Link href="/manager/promotions">PROMOTIONS</Link>
        </div>

        <div className="flex items-center gap-2 cursor-pointer hover:text-[#896CFE]">
          <img src="/icons/Locker.svg" className="h-8" />
          <Link href="/manager/lockers">LOCKERS</Link>
        </div>

        <div className="flex items-center gap-2 cursor-pointer hover:text-[#896CFE]">
          <img src="/trainer/equipment.png" className="h-8" />
          <Link href="/manager/equipments">EQUIPMENT</Link>
        </div>

      </div>

      {/* Right Profile */}
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <img
          src="/trainer/profile.jpg"
          alt="Latte"
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  );
}