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
}

export default function PromotionCard({ promotion, selected, onClick }: Props) {
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
            <div className="grid grid-cols-3 items-center w-full p-5">

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

            </div>
        </Card>
    );
}