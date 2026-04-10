"use client";

import Card from "../../Card"

interface Member {
    Member_ID: number;
    FirstName: string;
    LastName: string;
    PackName: string;
    P_method: string;
    MedRec: string;
    PaymentStatus: string;
}

interface Props {
    member: Member;
    selected?: boolean;
    onClick?: () => void;
}

export default function MemberCard({ member, selected, onClick }: Props) {
    return (
        <Card onClick={onClick} selected={selected}>
            <div className="grid grid-cols-5 items-center w-full p-5">

                <div>
                    <p className="text-sm text-[#202022]">
                        {String(member.Member_ID).padStart(5, "0")}
                    </p>

                    <h2 className="text-xl font-bold text-[#202022]">
                        {member.FirstName} {member.LastName}
                    </h2>
                </div>


                <div className="mt-2 text-lg text-[#202022]">
                    <p>{member.PackName}</p>
                </div>

                <div className="mt-2 text-lg text-[#202022]">
                    <p>{member.P_method}</p>
                </div>
                <div className="mt-2 text-lg text-[#202022]">
                    <p>{member.MedRec || "-"}</p>
                </div>

                <span
                    className={`text-lg px-5 py-1 ml-auto rounded-full
                            ${member.PaymentStatus === "Paid"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-red-100 text-red-600"
                        }`}
                >
                    {member.PaymentStatus}
                </span>
            </div>
        </Card>
    );
}