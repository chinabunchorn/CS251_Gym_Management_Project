"use client";

import { useEffect, useState } from "react";
import AuthGuard from "../../components/AuthGuard";

type Equipment = {
  id: number;
  name: string;
  total: number;
  available: number;
};

export default function Member_dashboard() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // mock data >< fetch later
    const mockData: Equipment[] = [
      { id: 1, name: "Treadmill", total: 5, available: 5 },
      { id: 2, name: "Smith Machine", total: 2, available: 2 },
      { id: 3, name: "Leg Press", total: 1, available: 1 },
      { id: 4, name: "Lat Pulldown", total: 2, available: 1 },
      { id: 5, name: "Stair Climber", total: 2, available: 2 },
      { id: 6, name: "Cable Row", total: 2, available: 2 },
    ];
    const fetchEquipment = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/equipment", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

    setTimeout(() => {
      setEquipment(mockData);
      setLoading(false);
    }, 500);
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();

        const formatted = data.map((item: any) => ({
          id: item.Equipment_ID,
          name: item.Equipment,
          total: 1,
          available: item.STATUS === "Available" ? 1 : 0,
        }));

        setEquipment(formatted);
      } catch (error) {
        console.error("Error fetching equipment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  return (
    //<AuthGuard>
      <div className="min-h-screen bg-white p-4">
        
        {/* Header */}
        {/* <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-800">
            Equipment
          </h1>
          <div className="text-2xl">≡</div>
        </div> */}

        <h2 className="text-sm font-bold text-black mb-4">
          Check Equipment Availability
        </h2>

        {/* Loading */}
        {loading && <p>Loading...</p>}

        {/* Equipment List */}
        <div className="space-y-4">
          {equipment.map((item) => {
            const isAvailable = item.available > 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-extrabold text-black">
                    {item.name}
                  </h3>
                  <p className="text-sm font-semibold text-black">
                    {item.total} Machines
                  </p>
                </div>

                {/* Status */}
                <div
                  className={`px-3 py-1 rounded-xl text-sm font-medium ${
                    isAvailable
                      ? "bg-[#EDE8FF] text-[#5F33E1]"
                      : "bg-[#FFD6EB] text-[#F579AD]"
                  }`}
                >
                  {isAvailable
                    ? "Available"
                    : `${item.total - item.available} Maintenance`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    //</AuthGuard>
  );
}