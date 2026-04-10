"use client";

import { useEffect, useState } from "react";
import MobileHeader from "./components/MobileHeader";
import MobileNavbar from "./components/MobileNavbar";
import { Member } from "./type";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8000/member/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) return;

        const data = await res.json();
              console.log("ClientLayout member:", data);
        setMember(data.member);
      } catch (err) {
        console.error("Failed to fetch member:", err);
      }
    };

    fetchMember();
  }, []);

  return (
    <>
      <MobileNavbar open={open} setOpen={setOpen} member={member} />

      <div className="w-full max-w-sm mx-auto min-h-screen bg-white shadow">
        <div className="p-4">
          <MobileHeader onMenuClick={() => setOpen(true)} />
        </div>

        <div className="p-4">{children}</div>
      </div>
    </>
  );
}