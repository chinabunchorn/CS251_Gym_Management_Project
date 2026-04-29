/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Member } from "../type";
import HomeIcon from "./icons/HomeIcon";
import ClassesIcon from "./icons/ClassesIcon";
import StarIcon from "./icons/StarIcon";
import LockerIcon from "./icons/LockerIcon";
import JumpRopeIcon from "./icons/JumpRopeIcon";
import DiscountIcon from "./icons/DiscountIcon";
import TicketIcon from "./icons/TicketIcon";
import CogIcon from "./icons/CogIcon";
import CreditCardIcon from "./icons/CreditCardIcon";
import SignOutIcon from "./icons/SignOutIcon";

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
      icon: HomeIcon,
    },
    {
      name: "Classes",
      path: "/member/classes",
      icon: ClassesIcon,
    },
    {
      name: "Trainers",
      path: "/member/trainer",
      icon: StarIcon,
    },
    {
      name: "Lockers",
      path: "/member/locker",
      icon: LockerIcon,
    },
    {
      name: "Equipment",
      path: "/member/equipment",
      icon: JumpRopeIcon,
    },
    {
      name: "Promotions",
      path: "/member/promotions",
      icon: DiscountIcon,
    },
    {
      name: "My Bookings",
      path: "/member/booking",
      icon: TicketIcon,
    },
  ];

  const profileItems = [
    { name: "Settings", icon: CogIcon },
    { name: "Membership", icon: CreditCardIcon },
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
      localStorage.removeItem("role");
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
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 py-2 px-3 rounded-lg ${
                  pathName === item.path
                    ? "bg-purple-100 text-purple-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="border-t pt-4">
            <p className="text-gray-400 mb-2">Profile</p>
            {profileItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.name}
                  className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <Icon className="w-5 h-5 text-gray-500" />
                  <span>{item.name}</span>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex gap-3 text-left border-t pt-4 mt-4 text-red-500 hover:text-red-600 cursor-pointer"
          >
            <SignOutIcon className="text-red-500 w-5 h-5" />
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
