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


    const fetchMemberDetail = async (id: number) => {
        const token = localStorage.getItem("token");

        try {
            setSelectedMember(null);
            setForm(null);

            const res = await fetch(`http://127.0.0.1:8000/profile/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            setSelectedMember(data);

        } catch (err) {
            console.error(err);
        }
    };

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
                fetchMemberDetail(data[0].Member_ID);
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
                package_id: selectedMember.packageID || "",
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

                    <div className="flex-col w-[70%] h-[full]">

                        <div className="flex h-[15%] w-[100%] justify-between items-center bg-[#ffffff] border-b-2 border-[#939393]">
                            <div className="ml-8 font-bold text-[#202022] text-3xl">Members</div>
                        </div>

                        <div className="h-[85%] p-8 flex flex-col gap-4">
                            {members.map((member) => (
                                <MemberCard
                                    key={member.Member_ID}
                                    member={member}
                                    selected={selectedMember?.Member_ID === member.Member_ID}
                                    onClick={() => fetchMemberDetail(member.Member_ID)}
                                />
                            ))}
                        </div>

                    </div>

                    <div className="flex-col w-[30%] h-[full] bg-[#ffffff] border-l-1 border-gray-500">
                        <div className="flex w-[full] h-[10%] items-center">
                            <h1 className="text-[#202022] font-bold pl-8 text-3xl">Member Details</h1>
                        </div>
                        {selectedMember && form ? (
                            <div className="w-full h-[90%]">
                                <DetailSidebar
                                    onCancel={handleCancel}
                                    onSave={handleSave}
                                    saving={saving}
                                >
                                    <>
                                        <FormField label="Member ID">
                                            <input
                                                value={form.member_id}
                                                disabled
                                                className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-gray-400 border border-black"
                                            />
                                        </FormField>

                                        <FormField label="First Name">
                                            <input
                                                value={form.firstname}
                                                onChange={(e) => handleChange("firstname", e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border border-black"
                                            />
                                        </FormField>

                                        <FormField label="Last Name">
                                            <input
                                                value={form.lastname}
                                                onChange={(e) => handleChange("lastname", e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border border-black"
                                            />
                                        </FormField>

                                        <FormField label="Birthday">
                                            <input
                                                type="date"
                                                value={form.bdate}
                                                onChange={(e) => handleChange("bdate", e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border border-black"
                                            />
                                        </FormField>

                                        <FormField label="Medical Record">
                                            <input
                                                value={form.medrec}
                                                onChange={(e) => handleChange("medrec", e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border border-black"
                                            />
                                        </FormField>

                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <FormField label="Height">
                                                    <input
                                                        value={form.height}
                                                        onChange={(e) => handleChange("height", e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border border-black"
                                                    />
                                                </FormField>
                                            </div>

                                            <div className="flex-1">
                                                <FormField label="Weight">
                                                    <input
                                                        value={form.weight}
                                                        onChange={(e) => handleChange("weight", e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border border-black"
                                                    />
                                                </FormField>
                                            </div>
                                        </div>

                                        <FormField label="Package">
                                            <input
                                                value={form.package_id}
                                                onChange={(e) => handleChange("package_id", e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border border-black"
                                            />
                                        </FormField>

                                        <FormField label="Trainer">
                                            <input
                                                value={form.trainer_id}
                                                onChange={(e) => handleChange("trainer_id", e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border border-black"
                                            />
                                        </FormField>
                                    </>
                                </DetailSidebar>
                            </div>
                        ) : (
                            <div className="w-full h-[90%] flex items-center justify-center text-gray-400">
                                No member selected
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </AuthGuard>
    )
}