"use client";

import { useEffect, useState } from "react";
import Actions from "./components/Dashboard/Actions";
import UserInfo from "./components/Dashboard/UserInfo";
import MembershipCard from "./components/Dashboard/MembershipCard";
import UpcomingClasses from "./components/Dashboard/UpcomingClasses";
import ExpiryCards from "./components/Dashboard/ExpiryCards";
import CheckinStatus from "./components/Dashboard/CheckinStatus";
import { DashboardData } from "./type";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8000/member/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch dashboard");
        }

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!data) {
    return (
      <div className="text-center mt-10 text-red-500">
        Failed to load dashboard
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* User Info */}
      <UserInfo member={data.member} />

      <MembershipCard pkg={data.package} />

      <Actions />

      <UpcomingClasses classes={data.upcoming_classes} />

      <ExpiryCards locker={data.locker} pkg={data.package} />

      <CheckinStatus checked={data.checked_today} />
    </div>
  );
}
