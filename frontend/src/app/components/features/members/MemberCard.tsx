"use client";

import Card from "../../Card"

// 🔴 อัปเดต Interface ให้รับค่าใหม่ๆ จาก Backend
interface Member {
    Member_ID: number;
    FirstName: string;
    LastName: string;
    PackName: string;
    PackPrice?: number;       // ราคาแพ็กเกจ
    PromoCode?: string;       // โปรโมชั่นที่ใช้
    DiscountRate?: number;    // ส่วนลด (เช่น 0.1)
    P_method: string;
    MedRec: string;
    TrainerName?: string;     // ชื่อเทรนเนอร์
    PaymentStatus: string;
}

interface Props {
    member: Member;
    selected?: boolean;
    onClick?: () => void;
    onDelete?: () => void; 
}

export default function MemberCard({ member, selected, onClick, onDelete }: Props) {
    // 🔴 คำนวณราคาสุทธิ
    const basePrice = member.PackPrice || 0;
    const discount = member.DiscountRate || 0;
    const totalPayment = basePrice * (1 - discount);

    return (
        <Card onClick={onClick} selected={selected}>
            <div className="flex items-center w-full p-5 gap-4">

                {/* 1. ข้อมูลส่วนตัว & Trainer (25%) */}
                <div className="w-[25%]">
                    <p className="text-sm text-[#202022]">
                        {String(member.Member_ID).padStart(5, "0")}
                    </p>
                    <h2 className="text-xl font-bold text-[#202022]">
                        {member.FirstName} {member.LastName}
                    </h2>
                    {member.TrainerName ? (
                        <p className="text-sm text-[#5F33E1] font-semibold mt-1">Trainer: {member.TrainerName}</p>
                    ) : (
                        <p className="text-sm text-gray-400 mt-1">No Trainer</p>
                    )}
                </div>

                {/* 2. Package & Promotion (25%) */}
                <div className="w-[25%]">
                    <p className="text-lg font-bold text-[#202022]">{member.PackName || "-"}</p>
                    {member.PromoCode ? (
                        <p className="text-sm text-green-600 font-semibold mt-1">
                            Promo: {member.PromoCode} (-{member.DiscountRate! * 100}%)
                        </p>
                    ) : (
                        <p className="text-sm text-gray-400 mt-1">No Promo</p>
                    )}
                </div>

                {/* 3. Payment Method (15%) */}
                <div className="w-[15%] text-lg text-[#202022]">
                    <p>{member.P_method || "-"}</p>
                </div>

                {/* 4. Total Payment (สีแดง) (15%) */}
                <div className="w-[15%] text-xl font-bold text-[#FF3B3B]">
                    <p>฿{totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>

                {/* 5. Status & Delete Button (20%) */}
                <div className="w-[20%] flex items-center justify-end gap-4 ml-auto">
                    <span
                        className={`text-lg px-5 py-1 rounded-full font-semibold
                                ${member.PaymentStatus === "Paid"
                                ? "bg-purple-100 text-purple-600"
                                : "bg-red-100 text-red-600"
                            }`}
                    >
                        {member.PaymentStatus}
                    </span>

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