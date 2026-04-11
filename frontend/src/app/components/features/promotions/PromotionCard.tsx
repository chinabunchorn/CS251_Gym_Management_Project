"use client";

import Card from "../../Card";

interface Promotion {
    PromoCode: string;
    DiscountRate: number;
    StartDate: string;
    EndDate: string;
}

interface Props {
    promotion: Promotion;
    selected?: boolean;
    onClick?: () => void;
    onDelete?: () => void;
}

export default function PromotionCard({ promotion, selected, onClick, onDelete}: Props) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <Card onClick={onClick} selected={selected}>
            <div className="grid grid-cols-4 items-center w-full p-5">

                {/* Column 1: Promo Code */}
                <div>
                    <p className="text-sm text-[#202022]">Promo Code</p>
                    <h2 className="text-xl font-bold text-[#202022]">
                        {promotion.PromoCode}
                    </h2>
                </div>

                {/* Column 2: Discount */}
                <div className="text-lg text-[#202022] font-semibold">
                    {promotion.DiscountRate * 100}% OFF
                </div>

                {/* Column 3: Date Range */}
                <div className="text-lg text-[#202022]">
                    {formatDate(promotion.StartDate)} - {formatDate(promotion.EndDate)}
                </div>

                <div className="ml-auto">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onDelete) onDelete();
                        }}
                        className="flex w-[35px] h-[35px] bg-[#FFE0E0] justify-center items-center rounded-lg text-[#FF3B3B] hover:bg-[#FF3B3B] hover:text-white transition-colors cursor-pointer"
                        title="Delete Member"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>

            </div>
        </Card>
    );
}