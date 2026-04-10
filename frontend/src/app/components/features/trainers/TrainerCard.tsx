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
}

export default function TrainerCard({ trainer, selected, onClick }: Props) {
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
                <div className="text-lg text-[#202022] text-right">
                    {trainer.Contract_Type || "-"}
                </div>

            </div>
        </Card>
    );
}