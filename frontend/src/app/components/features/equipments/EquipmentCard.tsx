"use client";

import Card from "../../Card";

interface Equipment {
    EquipmentID: string;
    Name: string;
    ImportDate: string;
    Status: string;
}

interface Props {
    equipment: Equipment;
    selected?: boolean;
    onClick?: () => void;
    onDelete?: () => void;
}

export default function EquipmentCard({
    equipment,
    selected,
    onClick,
    onDelete
}: Props) {

    const getStatusStyle = (status?: string) => {
        switch (status) {
            case "Available":
                return "bg-green-100 text-green-600";
            case "Broken":
                return "bg-red-100 text-red-600";
            case "Maintenance":
                return "bg-yellow-100 text-yellow-600";
            default:
                return "bg-gray-100 text-gray-500";
        }
    };

    return (
        <Card onClick={onClick} selected={selected}>
            <div className="grid grid-cols-5 items-center w-full p-5">

                {/* ID */}
                <div className="text-xl font-bold text-[#202022]">
                    {equipment.EquipmentID}
                </div>

                {/* Name */}
                <div className="text-lg text-[#202022]">
                    {equipment.Name}
                </div>

                {/* Date */}
                <div className="text-lg text-[#202022]">
                    {equipment.ImportDate}
                </div>

                {/* Status */}
                <div className="flex justify-end">
                    <span
                        className={`px-4 py-1 rounded-full font-semibold ${getStatusStyle(
                            equipment.Status
                        )}`}
                    >
                        {equipment.Status ?? "Available"}
                    </span>
                </div>

                {/* Delete */}
                <div className="flex justify-end">
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