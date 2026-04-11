"use client";

import Card from "../../Card";

interface Trainer {
    EmployeeID: number;
    FirstName: string;
    LastName: string;
    Specialty: string;
    StartDate: string;
    STATUS: string;
    Contract_Type: string;
}

interface Props {
    trainer: Trainer;
    selected?: boolean;
    onClick?: () => void;
    onDelete?: () => void;
}

export default function TrainerCard({ trainer, selected, onClick, onDelete }: Props) {
    return (
        <Card onClick={onClick} selected={selected}>
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center w-full p-5">

                {/* 1. ID + Name */}
                <div>
                    <p className="text-sm text-[#202022]">
                        {String(trainer.EmployeeID).padStart(5, "0")}
                    </p>
                    <h2 className="text-xl font-bold text-[#202022]">
                        {trainer.FirstName} {trainer.LastName}
                    </h2>
                </div>

                {/* 2. Specialty */}
                <div className="text-lg text-[#202022]">
                    {trainer.Specialty || "-"}
                </div>

                {/* 3. Start Date */}
                <div className="text-lg text-[#202022]">
                    {trainer.StartDate
                        ? new Date(trainer.StartDate).toLocaleDateString()
                        : "-"}
                </div>

                {/* 4. Status */}
                <div>
                    <span
                        className={`text-lg px-4 py-1 rounded-full
                        ${trainer.STATUS === "Active"
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-200 text-gray-600"
                            }`}
                    >
                        {trainer.STATUS}
                    </span>
                </div>

                {/* 5. Contract Type */}
                <div className="flex justify-center items-center text-lg text-[#202022] text-right">
                    {trainer.Contract_Type || "-"}

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onDelete) onDelete();
                        }}
                        className="flex w-[35px] h-[35px] bg-[#FFE0E0] ml-auto justify-center items-center rounded-lg text-[#FF3B3B] hover:bg-[#FF3B3B] hover:text-white transition-colors cursor-pointer"
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