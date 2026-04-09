"use client";

import { useState } from "react";
import MobileHeader from "./components/MobileHeader";
import MobileNavbar from "./components/MobileNavbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <MobileNavbar open={open} setOpen={setOpen} />

      <div className="w-full max-w-sm mx-auto min-h-screen bg-white shadow">
        <div className="p-4">
          <MobileHeader onMenuClick={() => setOpen(true)} />
        </div>

        <div className="p-4">{children}</div>
      </div>
    </>
  );
}