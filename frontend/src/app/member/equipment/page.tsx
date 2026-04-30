"use client";

import { useEffect, useState } from "react";
// import AuthGuard from "../../components/AuthGuard";

// ตัด id ทิ้งไปเลย เพราะเราจะใช้ชื่อ (name) เป็น key ในการจัดกลุ่ม
type GroupedEquipment = {
  name: string;
  total: number;
  available: number;
};

// เปลี่ยนชื่อ Function ให้สื่อความหมายตรงกับหน้า
export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<GroupedEquipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await fetch("http://127.0.0.1:8000/equipment", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch equipment");

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
      <h2 className="text-sm font-bold text-black mb-4">
        Check Equipment Availability
      </h2>

      {/* Loading */}
      {loading && <p className="text-center text-gray-500 text-sm">Loading...</p>}

      {/* Equipment List */}
      <div className="space-y-4 max-w-md mx-auto">
        {!loading && equipment.length === 0 && (
          <p className="text-center text-gray-500 text-sm">No equipment found.</p>
        )}
        
        {equipment.map((item) => {
          const isAvailable = item.available > 0;
          const underMaintenance = item.total - item.available;

          return (
            <div
              key={item.name} 
              className="bg-white rounded-2xl shadow p-4 flex justify-between items-center border border-gray-100"
            >
              <div>
                <h3 className="font-extrabold text-black">{item.name}</h3>
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
    //</AuthGuard>
  );
}