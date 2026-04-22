"use client";

import AuthGuard from "../../components/AuthGuard";
import { useEffect, useState } from "react";


type Promotion = {
  id: number;
  title: string;
  image: string;
  startDate: string;
  endDate: string;
};

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  useEffect(() => {
  const fetchPromotions = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/promotions");

      if (!res.ok) throw new Error("Failed to fetch promotions");

      const data = await res.json();

      const formatted: Promotion[] = data.map((item: any) => ({
        id: item.Promotion_ID,
        title: item.Title,
        image: item.Image_URL,
        startDate: formatDate(item.StartDate),
        endDate: formatDate(item.EndDate),
      }));

      setPromotions(formatted);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchPromotions();
}, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white p-4">
        
        {/* Header */}
        {/* <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-black">
            Promotions
          </h1>

        </div> */}

        {/* Title */}
        <h2 className="text-center text-black font-semibold mb-2">
          All Available Promotions
        </h2>

        <div className="border-t border-[#000000] w-full mb-6"></div>

        {/* Loading */}
        {loading && <p>Loading...</p>}

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="bg-white rounded-2xl shadow p-2"
            >
              {/* Image */}
              <img
                src={promo.image}
                //src={promo.image}
                alt={promo.title}
                className="w-full object-cover rounded-xl"
              />

              {/* Content */}
              <div className="p-2">
                <h3 className="font-semibold text-black text-sm">
                  {promo.title}
                </h3>

                <p className="text-xs font-semibold text-black mt-1">
                  {promo.startDate} - {promo.endDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    //</AuthGuard>
  );
}