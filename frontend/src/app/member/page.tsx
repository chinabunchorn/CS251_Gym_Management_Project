/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Actions from "./components/Actions";
import dayjs from "dayjs";

type Member = {
  FirstName: string;
  LastName: string;
};

type Package = {
  packName: string;
  Enddate: string;
  PackPrice: number;
};

type Locker = {
  EndDate: string;
} | null;

type Trainer = any; // refine later if needed

type UpcomingClass = {
  ClassName: string;
  ClassDate: string;
  ClassTime: string;
};

type DashboardData = {
  member: Member | null;
  package: Package | null;
  locker: Locker;
  trainer: Trainer;
  upcoming_classes: UpcomingClass[];
  checked_today: boolean;
};

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

        console.log("Status:", res.status);

        if (!res.ok) {
          throw new Error("Failed to fetch dashboard");
        }

        const result: DashboardData = await res.json();
        console.log("Dashboard data:", result); 
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

  const member = data.member;
  const pkg = data.package;
  const locker = data.locker;
  const upcoming = data.upcoming_classes ?? [];

  return (
    <div className="space-y-4">
      console.log(data);
      {/* User Info */}
      <div className="flex items-center gap-3">
        <img
          src="/member/Profile.jpg"
          alt="avatar"
          width={50}
          height={50}
          className="rounded-full"
        />
        <div>
          <p className="text-sm text-gray-500">Hello!</p>
          <p className="font-semibold text-gray-800">
            {member
              ? `${member.FirstName} ${member.LastName}`
              : "Guest"}
          </p>
        </div>
      </div>

      {/* Membership */}
      <div className="bg-linear-to-r from-purple-600 to-indigo-500 text-white p-4 rounded-2xl shadow-md">
        <p className="text-sm">{pkg?.packName}</p>

        <p className="text-xs opacity-80 mt-1">
          {pkg?.Enddate
            ? `Next payment on ${dayjs(pkg.Enddate).format(
                "DD MMMM, YYYY"
              )}`
            : "No billing info"}
        </p>

        <div className="mt-3 text-sm">
          <p>
            {pkg
              ? `${pkg.PackPrice}/month • Recurring`
              : "No active plan"}
          </p>
          <p className="text-xs opacity-80">
            {pkg?.Enddate
              ? `Till ${dayjs(pkg.Enddate).format(
                  "DD MMM YYYY"
                )}`
              : ""}
          </p>
        </div>
      </div>

      {/* Actions */}
      {/* <div className="grid grid-cols-2 gap-2">
        {["Book Class", "My Locker", "My Bookings", "Trainers"].map(
          (item) => (
            <button
              key={item}
              className="border rounded-xl py-2 text-sm font-medium hover:bg-gray-100"
            >
              {item}
            </button>
          )
        )}
      </div> */}
      <Actions />

      {/* Upcoming Classes */}
      {/* <div>
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">Upcoming Classes</h2>
          <button className="text-sm text-purple-600">View All</button>
        </div>

        <div className="flex gap-2 mt-2">
          <div className="flex-1 bg-gray-100 p-3 rounded-xl text-sm">
            <p className="text-gray-500">Instructor John</p>
            <p className="font-medium">Yoga</p>
            <p className="text-purple-600 text-xs">10:00 AM</p>
          </div>
          <div className="flex-1 bg-gray-100 p-3 rounded-xl text-sm">
            <p className="text-gray-500">Instructor Amy</p>
            <p className="font-medium">HIIT</p>
            <p className="text-purple-600 text-xs">12:00 PM</p>
          </div>
        </div>
      </div> */}
      <div>
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">Upcoming Classes</h2>
        </div>

        <div className="flex gap-2 mt-2">
          {upcoming.length === 0 ? (
            <p className="text-sm text-gray-500">
              No upcoming classes
            </p>
          ) : (
            upcoming.map((c, i) => (
              <div
                key={i}
                className="flex-1 bg-gray-100 p-3 rounded-xl text-sm"
              >
                <p className="font-medium">{c.ClassName}</p>
                <p className="text-purple-600 text-xs">
                  {c.ClassDate} {c.ClassTime}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Expiry */}
      <div>
        <h2 className="font-semibold text-gray-700">Expiry Dates</h2>
        <div className="flex gap-2 mt-2">
          {/* Locker */}
          <div className="flex-1 bg-yellow-100 p-3 rounded-xl text-sm text-black">
            <p className="font-medium">Locker</p>
            {locker ? (
              <p className="text-xs">
                {dayjs(locker.EndDate).format("DD MMM YYYY")}
              </p>
            ) : (
              <p className="text-xs">No locker</p>
            )}
          </div>
          {/* Package */}
          <div className="flex-1 bg-pink-100 p-3 rounded-xl text-sm text-black">
            <p className="font-medium">Package</p>
            {pkg ? (
              <p className="text-xs">
                {dayjs(pkg.Enddate).format("DD MMM YYYY")}
              </p>
            ) : (
              <p className="text-xs">No package</p>
            )}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-blue-100 text-center p-4 rounded-xl text-sm text-gray-700">
        You&apos;ve checked in today!
      </div>
    </div>
  );
}
