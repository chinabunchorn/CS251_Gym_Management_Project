"use client";

import { useEffect, useState, useCallback } from "react";import Link from "next/link";

type GymClass = {
  scheduleID: number;
  className: string;
  instructorName: string;
  classDate: string; 
  classTime: string; 
  capacity: number;
  reservedCount: number;
};

const getLocalYMD = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatClassTime = (timeData: string | number | null | undefined) => {
  if (timeData === null || timeData === undefined) return "N/A";

  if (typeof timeData === "number") {
    const hours = Math.floor(timeData / 3600);
    const minutes = Math.floor((timeData % 3600) / 60);
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  if (typeof timeData === "string") {
    const timeParts = timeData.split(":");
    if (timeParts.length < 2) return timeData; 
    const hours = parseInt(timeParts[0], 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${timeParts[1]} ${ampm}`;
  }

  return "N/A";
};

const generateDateRange = (days: number) => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
};

export default function ClassesPage() {
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false); 
  
  const [selectedDate, setSelectedDate] = useState<string>(
    getLocalYMD(new Date())
  );
  const [calendarDates] = useState<Date[]>(generateDateRange(14));

  const fetchClasses = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      const res = await fetch("http://127.0.0.1:8000/classes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch classes");

      const data = await res.json();
      const formatted: GymClass[] = data.map((item: any) => ({
        scheduleID: item.Schedule_ID,
        className: item.ClassName, 
        instructorName: item.InstructorName || "Staff", 
        classDate: item.ClassDate,
        classTime: formatClassTime(item.ClassTime), 
        capacity: item.Capacity || 20,
        reservedCount: item.ReservedCount || 0,
      }));

      setClasses(formatted);
    } catch (err: any) {
      console.error("Error fetching classes:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleBookClass = async (scheduleID: number) => {
    if (isBooking) return;
    setIsBooking(true);

    try {
      const token = localStorage.getItem("token");
      const memberId = localStorage.getItem("member_id"); 

      if (!token || !memberId) {
        alert("Please log in to book a class.");
        return;
      }

      const res = await fetch(`http://127.0.0.1:8000/reserve?member_id=${memberId}&schedule_id=${scheduleID}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to book class");
      }

      alert("Class booked successfully!");
      await fetchClasses(); 

    } catch (err: any) {
      alert(`Booking Failed: ${err.message}`);
    } finally {
      setIsBooking(false);
    }
  };

  const filteredClasses = classes.filter((c) => c.classDate === selectedDate);

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 flex flex-col items-center">
      
      {/* Title Section */}
      <div className="w-full max-w-md mt-6 mb-6 flex flex-col items-center">
        <h2 className="text-2xl font-extrabold text-gray-900">Today's Classes</h2>
        <div className="border-t-2 border-gray-900 w-16 mt-3"></div>
      </div>

      {/* Horizontal Calendar Slider */}
      <div className="w-full max-w-md mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-3 px-1">
            {calendarDates.map((date, index) => {
            const dateString = getLocalYMD(date); 
            const isSelected = selectedDate === dateString;
            const month = date.toLocaleDateString("en-US", { month: "short" });
            const dayNum = date.getDate();
            const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

            return (
              <button
                key={index}
                onClick={() => setSelectedDate(dateString)}
                className={`flex flex-col items-center justify-center min-w-[70px] h-24 rounded-2xl transition-all shadow-sm border 
                  ${isSelected 
                    ? "bg-[#5F33E1] text-white border-[#5F33E1] scale-105" 
                    : "bg-white text-gray-800 border-gray-100 hover:border-gray-300"
                  }`}
              >
                <span className={`text-xs font-semibold ${isSelected ? "text-gray-200" : "text-gray-500"}`}>
                  {month}
                </span>
                <span className="text-2xl font-black my-0.5">{dayNum}</span>
                <span className={`text-xs font-semibold ${isSelected ? "text-gray-200" : "text-gray-500"}`}>
                  {dayName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full max-w-md mb-4">
        <h3 className="text-lg font-bold text-gray-900">All Available Classes</h3>
      </div>

      {/* States */}
      {loading && <p className="text-gray-500 text-sm">Loading classes...</p>}
      {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</p>}
      
      {!loading && !error && filteredClasses.length === 0 && (
        <div className="w-full max-w-md bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
          <span className="text-4xl">😴</span>
          <p className="text-gray-500 mt-2 font-medium">No classes scheduled for this date.</p>
        </div>
      )}

      {/* Classes List */}
      <div className="w-full max-w-md flex flex-col gap-4">
        {filteredClasses.map((gymClass) => {
          const isFull = gymClass.reservedCount >= gymClass.capacity;
          
          return (
            <div
              key={gymClass.scheduleID}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex justify-between items-center"
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-500 mb-1">
                  Instructor {gymClass.instructorName.split(" ")[0]}
                </span>
                <h3 className="font-extrabold text-gray-900 text-lg">
                  {gymClass.className}
                </h3>
                
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[#5F33E1] text-sm">🕒</span>
                  <span className="text-sm font-semibold text-[#5F33E1]">
                    {gymClass.classTime}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-xs font-bold text-gray-500">
                  {gymClass.reservedCount}/{gymClass.capacity}
                </span>
                
                <button
                  disabled={isFull || isBooking}
                  onClick={() => handleBookClass(gymClass.scheduleID)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-bold w-24 transition-transform active:scale-95
                    ${isFull 
                      ? "bg-[#FFD6EB] text-[#F579AD] cursor-not-allowed opacity-80" 
                      : "bg-[#EDE8FF] text-[#5F33E1] hover:bg-[#E3DCFF]"
                    }`}
                >
                  {isFull ? "Full" : isBooking ? "..." : "Book"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}