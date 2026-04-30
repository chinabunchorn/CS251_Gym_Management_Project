"use client";

import { useEffect, useState } from "react";
// import AuthGuard from "../../components/AuthGuard";

type GroupedEquipment = {
  name: string;
  total: number;
  available: number;
};

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<GroupedEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // เติม Error State ให้คุมโทน

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        const res = await fetch("http://127.0.0.1:8000/equipment", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Failed to fetch: ${errText || res.status}`);
        }

        const data = await res.json();

        const groupedData = data.reduce((acc: Record<string, GroupedEquipment>, item: any) => {
          const name = item.Equipment;
          if (!acc[name]) {
            acc[name] = { name: name, total: 0, available: 0 };
          }
          acc[name].total += 1;
          if (item.STATUS === "Available") {
            acc[name].available += 1;
          }
          return acc;
        }, {});

        setEquipment(Object.values(groupedData));
      } catch (error: any) {
        console.error("Error fetching equipment:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  return (
    // <AuthGuard>
    <div className="min-h-screen bg-[#F8F9FC] p-4 flex flex-col items-center">
      
      {/* Title Section คุมโทน */}
      <div className="w-full max-w-md mt-6 mb-8 flex flex-col items-center">
        <h2 className="text-2xl font-extrabold text-gray-900">Equipment</h2>
        <div className="border-t-2 border-gray-900 w-16 mt-3 mb-2"></div>
        <p className="text-sm text-gray-500 font-medium">Check machine availability</p>
      </div>

      {/* Loading & Error States */}
      {loading && <p className="text-gray-500 font-medium text-sm mb-4">Loading equipment...</p>}
      {error && (
        <div className="w-full max-w-md bg-red-50 text-red-500 p-3 rounded-xl border border-red-200 text-sm text-center mb-4">
          {error}
        </div>
      )}

      {/* Equipment List */}
      <div className="w-full max-w-md flex flex-col gap-4">
        {!loading && equipment.length === 0 && !error && (
          <p className="text-center text-gray-500 text-sm">No equipment found.</p>
        )}
        
        {equipment.map((item) => {
          const isAvailable = item.available > 0;
          const underMaintenance = item.total - item.available;

          return (
            <div
              key={item.name} 
              className="bg-white rounded-2xl shadow-sm p-4 flex justify-between items-center border border-gray-100"
            >
              <div>
                <h3 className="font-extrabold text-gray-900">{item.name}</h3>
                <p className="text-sm font-semibold text-gray-500 mt-0.5">
                  {item.total} Machines
                </p>
              </div>

              {/* Status Badge */}
              <div
                className={`px-3 py-1.5 rounded-xl text-sm font-bold ${
                  isAvailable
                    ? "bg-[#EDE8FF] text-[#5F33E1]"
                    : "bg-[#FFD6EB] text-[#F579AD]"
                }`}
              >
                {isAvailable
                  ? `${item.available} Available`
                  : `${underMaintenance} Maintenance`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}