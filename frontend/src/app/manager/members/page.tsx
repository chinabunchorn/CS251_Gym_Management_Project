"use client";

import AuthGuard from "../../components/AuthGuard"
import Navbar from "../../components/manager_navbar"
import MemberCard from "../../components/features/members/MemberCard";
import DetailSidebar from "../../components/DetailSidebar";
import FormField from "../../components/FormField";

import { useEffect, useState } from "react";


export default function Manager_members() {

    const [members, setMembers] = useState<any[]>([]);
    const [selectedMember, setSelectedMember] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://127.0.0.1:8000/members", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setMembers(data);

            if (data.length > 0) {
                setSelectedMember(data[0]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedMember) {
            setForm({
                member_id: selectedMember.Member_ID,
                firstname: selectedMember.FirstName,
                lastname: selectedMember.LastName,
                bdate: selectedMember.Bdate || "",
                medrec: selectedMember.MedRec || "",
                weight: selectedMember.Weight || "",
                height: selectedMember.Height || "",
                package_id: selectedMember.PackageID || "",
                trainer_id: selectedMember.TrainerID || "",
            });
        }
    }, [selectedMember]);

    const handleChange = (field: string, value: any) => {
        setForm((prev: any) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        const token = localStorage.getItem("token");

        setSaving(true);

        try {
            const query = new URLSearchParams(form).toString();

            const res = await fetch(
                `http://127.0.0.1:8000/manager/member/update?${query}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
            console.log(data);

            fetchMembers();

        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setSelectedMember(null);
        setForm(null);
    };

    return (
        <AuthGuard>

            <div className="h-screen flex flex-col bg-[#f6f6f6]">

                <Navbar />

                <div className="flex h-full w-full">

                    <div className="flex-col w-[70%] h-[full] border-green-500 border-4">

                        <div className="flex h-[10%] w-[100%] justify-between items-center bg-[#ffffff] border-b-2 border-[#939393]">
                            <div className="ml-8 font-bold text-[#202022] text-3xl">Members</div>
                        </div>

                        <div className="h-[90%] p-8 border-red-500 border-4 flex flex-col gap-4">
                            {members.map((member) => (
                                <MemberCard
                                    key={member.Member_ID}
                                    member={member}
                                    selected={selectedMember?.Member_ID === member.Member_ID}
                                    onClick={() => setSelectedMember(member)}
                                />
                            ))}
                        </div>

                    </div>

                    <div className="flex-col w-[30%] h-[full] border-orange-500 border-4">
                        <div className="flex w-[full] h-[10%] items-center border-4 border-yellow-500">
                            <h1 className="text-[#202022] font-bold pl-8 text-3xl">Member Details</h1>
                        </div>
                        <div className="w-[full] h-[90%] border-4 border-red-500">
                            <DetailSidebar
                                onCancel={handleCancel}
                                onSave={handleSave}
                                saving={saving}
                            >
                                {selectedMember && form ? (
                                    <>
                                        <FormField label="Member ID">
                                            <input
                                                value={form.member_id}
                                                disabled
                                                className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border-1 border-[#000000]"
                                            />
                                        </FormField>

                                        <FormField label="First Name">
                                            <input
                                                value={form.firstname}
                                                onChange={(e) => handleChange("firstname", e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border-1 border-[#000000]"
                                            />
                                        </FormField>

                                        <FormField label="Last Name">
                                            <input
                                                value={form.lastname}
                                                onChange={(e) => handleChange("lastname", e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border-1 border-[#000000]"
                                            />
                                        </FormField>

                                        <FormField label="Birthday">
                                            <input
                                                type="date"
                                                value={form.bdate}
                                                onChange={(e) => handleChange("bdate", e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border-1 border-[#000000]"
                                            />
                                        </FormField>

                                        <FormField label="Medical Record">
                                            <input
                                                value={form.medrec}
                                                onChange={(e) => handleChange("medrec", e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border-1 border-[#000000]"
                                            />
                                        </FormField>

                                        <div className="flex gap-4">
                                            <FormField label="Height">
                                                <input
                                                    value={form.height}
                                                    onChange={(e) => handleChange("height", e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border-1 border-[#000000]"
                                                />
                                            </FormField>

                                            <FormField label="Weight">
                                                <input
                                                    value={form.weight}
                                                    onChange={(e) => handleChange("weight", e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border-1 border-[#000000]"
                                                />
                                            </FormField>
                                        </div>

                                        <FormField label="Package">
                                            <input
                                                value={form.package_id}
                                                onChange={(e) => handleChange("package_id", e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border-1 border-[#000000]"
                                            />
                                        </FormField>

                                        <FormField label="Trainer">
                                            <input
                                                value={form.trainer_id}
                                                onChange={(e) => handleChange("trainer_id", e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border-1 border-[#000000]"
                                            />
                                        </FormField>
                                    </>
                                ) : (
                                    <p className="text-gray-500">No member selected</p>
                                )}
                            </DetailSidebar>
                        </div>
                    </div>

                </div>

            </div>
        </AuthGuard>
    )
}