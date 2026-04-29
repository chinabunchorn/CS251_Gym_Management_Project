"use client";

import Link from "next/link";
import SignOutIcon from "../member/components/icons/SignOutIcon";

export default function Navbar() {

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch("http://localhost:8000/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

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
      <div className="h-full flex gap-[20px]">
        <img
          src="/trainer/profile.jpg"
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />

        <button
          onClick={handleLogout}
          className="cursor-pointer w-10 h-10"
        >
          <SignOutIcon className="text-red-500 w-5 h-5" />
        </button>
      </div>

    </div>
  );
}