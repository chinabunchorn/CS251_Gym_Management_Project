"use client";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

type HeaderProps = {
    onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: HeaderProps) {
    const pathName = usePathname();

    // Get name of each page to display on top of page :3
    // Change pathname here depending on file structure
    const titles: Record<string, string> = {
    "/member" : "Home",
    "/member/classes" : "Classes",
    "/member/trainers" : "Trainers",
    "/member/bookings" :"My Bookings",
    "/member/promotions" : "Promotions",
    "/member/Lockers": "Lockers"
  }

  const title = titles[pathName] || "App";
    return (
        <header className="relative flex items-center justify-between h-14 px-4">
        <div className="shrink-0">
            <Logo className="w-12 h-8 text-[#F478B8]"/>
        </div>

        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold text-gray-900 text-lg">
            {title}
        </h1>

        <button
            onClick={onMenuClick}
            aria-label="Open menu"
            className="text-3xl font-light text-gray-800"
        >
            ≡
        </button>
        </header>
    );
}