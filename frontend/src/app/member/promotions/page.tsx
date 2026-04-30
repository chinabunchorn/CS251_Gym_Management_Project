"use client";

import { useEffect, useState } from "react";

type Promotion = {
  promoCode: string;
  discountRate: number;
  startDate: string;
  endDate: string;
  packageID: string;
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
        const token = localStorage.getItem("token");
        const headers: HeadersInit = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch("http://127.0.0.1:8000/promotions", {
          headers: headers, 
        });

        if (!res.ok) {
          const errorText = await res.text(); 
          throw new Error(`Backend Error (Status ${res.status}): ${errorText}`);
        }

        const data = await res.json();

        const formatted: Promotion[] = data.map((item: any) => ({
          promoCode: item.PromoCode,
          discountRate: item.DiscountRate,
          startDate: formatDate(item.StartDate),
          endDate: formatDate(item.EndDate),
          packageID: item.packageID,
        }));

        setPromotions(formatted);
      } catch (error: any) {
        console.error("Error fetching promotions:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 flex flex-col items-center">
      
      <div className="w-full max-w-md mt-6 mb-6 flex flex-col items-center">
        <h2 className="text-2xl font-extrabold text-gray-900">Promotions</h2>
        <div className="border-t-2 border-gray-900 w-16 mt-3"></div>
      </div>

      {loading && <p className="text-gray-500 font-medium">Loading deals...</p>}

      {!loading && promotions.length === 0 && (
        <p className="text-gray-500">No active promotions right now.</p>
      )}

      <div className="w-full max-w-md flex flex-col gap-4">
        {promotions.map((promo) => (
          <div
            key={promo.promoCode}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-row items-center relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#5F33E1]"></div>
            
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-[#5F33E1] bg-[#EDE8FF] px-2 py-1 rounded-md uppercase tracking-wider">
                    For Package: {promo.packageID}
                  </span>
                  
                  <h3 className="font-black text-gray-900 text-3xl mt-2">
                    {promo.discountRate * 100}% OFF
                  </h3>
                </div>

                <div className="bg-gray-50 border-2 border-dashed border-gray-300 px-3 py-1.5 rounded-lg text-center">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Use Code</p>
                  <p className="text-sm font-black text-[#5F33E1] tracking-wide">{promo.promoCode}</p>
                </div>
              </div>

              <div className="w-full border-t border-dashed border-gray-200 my-4"></div>

              <p className="text-xs font-medium text-gray-500">
                Valid: {promo.startDate} - {promo.endDate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
    // </AuthGuard>
  );
}