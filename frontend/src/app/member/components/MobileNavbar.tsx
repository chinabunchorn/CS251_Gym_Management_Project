/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Member } from "../type";

type DrawerProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

type Props = DrawerProps & {
  member: Member | null;
};

export default function MobileNavbar({ open, setOpen, member }: Props) {
  const pathName = usePathname();
  const router = useRouter();

  // Link to other pages here
  const menuItems = [
    {
      name: "Home",
      path: "/member",
    },
    {
      name: "Classes",
      path: "/member/classes",
    },
    {
      name: "Trainers",
      path: "/member/trainer",
    },
    {
      name: "Lockers",
      path: "/member/locker",
    },
    {
      name: "Equipment",
      path: "/member/equipment",
    },
    {
      name: "Promotions",
      path: "/member/promotions",
    },
    {
      name: "My Bookings",
      path: "/member/booking",
    },
  ];

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
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const fullName = member
      ? `${member.FirstName} ${member.LastName}`
      : "Loading...";

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="bg-linear-to-b from-purple-700 to-indigo-500 text-white p-6 rounded-b-3xl relative">
          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-xl"
          >
            ✕
          </button>

          {/* Profile + Name */}
          <div className="flex flex-col items-center mt-4">
            <img
              src="/member/Profile.jpg"
              alt="avatar"
              width={70}
              height={70}
              className="rounded-full border-2 border-white"
            />
            <p className="mt-3 font-semibold">{fullName}</p>
          </div>
        </div>

        <div className="p-4 text-sm text-gray-700 space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => setOpen(false)}
              className={`block py-2 px-3 rounded-lg ${
                pathName === item.path
                  ? "bg-purple-100 text-purple-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {item.name}
            </Link>
          ))}

          <div className="border-t pt-4">
            <p className="text-gray-400 mb-2">Profile</p>
            {["Settings", "Membership"].map((item) => (
              <div
                key={item}
                className="py-2 px-2 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                {item}
              </div>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-left border-t pt-4 mt-4 text-red-500 hover:text-red-600 cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 z-40"
        />
      )}
    </>
  );
}
