/* eslint-disable @next/next/no-img-element */
"use client";

export default function Dashboard() {
  return (
    <div className="space-y-4">

      {/* User Info */}
      <div className="flex items-center gap-3">
        <img
          src="https://i.pravatar.cc/100"
          alt="avatar"
          width={50}
          height={50}
          className="rounded-full"
        />
        <div>
          <p className="text-sm text-gray-500">Hello!</p>
          <p className="font-semibold text-gray-800">Samantha Jones</p>
        </div>
      </div>

      {/* Membership */}
      <div className="bg-linear-to-r from-purple-600 to-indigo-500 text-white p-4 rounded-2xl shadow-md">
        <p className="text-sm">Monthly Basic Membership</p>
        <p className="text-xs opacity-80 mt-1">
          Next payment on the 3rd of May 2026
        </p>
        <div className="mt-3 text-sm">
          <p>999.00/month • Recurring</p>
          <p className="text-xs opacity-80">Till 3 April, 2027</p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
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
      </div>

      {/* Upcoming Classes */}
      <div>
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">
            Upcoming Classes
          </h2>
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
      </div>

      {/* Expiry */}
      <div>
        <h2 className="font-semibold text-gray-700">Expiry Dates</h2>
        <div className="flex gap-2 mt-2">
          <div className="flex-1 bg-yellow-100 p-3 rounded-xl text-sm">
            <p className="font-medium">Locker</p>
            <p className="text-xs">23rd May 2026</p>
          </div>
          <div className="flex-1 bg-pink-100 p-3 rounded-xl text-sm">
            <p className="font-medium">Package</p>
            <p className="text-xs">3rd April 2027</p>
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