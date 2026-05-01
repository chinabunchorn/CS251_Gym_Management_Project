"use client";

import { useEffect, useState } from "react";

type BookingStatus = "Upcoming" | "Completed" | "Canceled";

interface Booking {
  Schedule_ID: number;
  TrainerName: string;
  ClassName: string;
  ClassDate: string;
  ClassTime: string;
  Status: BookingStatus; 
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<BookingStatus>("Upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const res = await fetch("http://127.0.0.1:8000/member/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to fetch: ${errText || res.status}`);
      }

      const data = await res.json();
      
      setBookings(data);

    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (scheduleId: number) => {
    const isConfirm = window.confirm("Are you sure you want to cancel this class?");
    if (!isConfirm) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/reserve/${scheduleId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to cancel class");
      }

      alert("Class cancelled successfully!");
      
      fetchBookings();
      
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const filteredBookings = bookings.filter((b) => b.Status === activeTab);

  return (
    // <AuthGuard>
    <div className="min-h-screen bg-[#F8F9FC] p-4 flex flex-col items-center font-sans">
      
      {/* Title Section */}
      <div className="w-full max-w-md mt-6 mb-6 flex flex-col items-center">
        <h2 className="text-2xl font-extrabold text-gray-900">My Bookings</h2>
        <div className="border-t-2 border-gray-900 w-16 mt-3 mb-2"></div>
        <p className="text-sm text-gray-500 font-medium">Manage your class schedule</p>
      </div>

      {/* Tabs */}
      <div className="w-full max-w-md flex justify-between gap-2 mb-6">
        {(["Upcoming", "Completed"] as BookingStatus[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab
                ? "bg-[#5F33E1] text-white shadow-md"
                : "bg-[#EDE8FF] text-[#5F33E1] hover:bg-[#D9C9FF]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading & Error States */}
      {loading && <p className="text-gray-500 font-medium text-sm mb-4">Loading your bookings...</p>}
      {error && (
        <div className="w-full max-w-md bg-red-50 text-red-500 p-3 rounded-xl border border-red-200 text-sm text-center mb-4">
          {error}
        </div>
      )}

      {/* Booking List */}
      <div className="w-full max-w-md flex flex-col gap-4">
        {!loading && filteredBookings.length === 0 && !error && (
          <p className="text-center text-gray-500 text-sm py-4">No {activeTab.toLowerCase()} classes found.</p>
        )}

        {filteredBookings.map((booking) => (
          <div 
            key={booking.Schedule_ID} 
            className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex flex-col"
          >
            <div className="flex justify-between items-start mb-2">
              <p className="text-gray-500 text-xs font-semibold">{booking.TrainerName}</p>
              
              {/* Status Badge */}
              <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                booking.Status === "Upcoming" ? "bg-[#EDE8FF] text-[#5F33E1]" :
                booking.Status === "Completed" ? "bg-green-100 text-green-700" :
                "bg-[#FFD6EB] text-[#F579AD]"
              }`}>
                {booking.Status}
              </span>
            </div>

            <h3 className="text-lg font-extrabold text-gray-900 mb-3">{booking.ClassName}</h3>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <span className="text-[#5F33E1] text-sm">📅</span> {booking.ClassDate}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <span className="text-[#5F33E1] text-sm">🕒</span> {booking.ClassTime}
              </div>
            </div>

            <div className="flex gap-2">
              {booking.Status === "Upcoming" && (
                <button 
                  onClick={() => handleCancel(booking.Schedule_ID)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}