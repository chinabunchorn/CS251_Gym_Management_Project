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

  useEffect(() => {
    //  mock data >< fetch later
    const mockData: Promotion[] = [
      {
        id: 1,
        title: "PT Promotion",
        image:
          "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=800",
        startDate: "1 Apr 2026",
        endDate: "30 Apr 2026",
      },
      {
        id: 2,
        title: "Promo 20",
        image:
          "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800",
        startDate: "1 Apr 2026",
        endDate: "5 Apr 2026",
      },
    ];

    setTimeout(() => {
      setPromotions(mockData);
      setLoading(false);
    }, 500);
  }, []);

  return (
    //<AuthGuard>
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