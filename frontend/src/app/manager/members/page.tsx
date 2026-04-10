"use client";

import AuthGuard from "../../components/AuthGuard";
import Navbar from "../../components/manager_navbar";
import MemberCard from "../../components/features/members/MemberCard";
import DetailSidebar from "../../components/DetailSidebar";
import FormField from "../../components/FormField";
import AddButton from "../../components/AddButton";

import { useEffect, useState } from "react";

interface Trainer {
    EmployeeID: number;
    FirstName: string;
    LastName: string;
}

interface Package {
    packageID: string;
    packName: string;
}

export default function Manager_members() {
    const [members, setMembers] = useState<any[]>([]);
    const [selectedMember, setSelectedMember] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [packages, setPackages] = useState<Package[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addFormData, setAddFormData] = useState({
        firstName: "",
        lastName: "",
        package_id: "",
        trainer_id: "",
        birthdate: "",
        weight: "",
        height: "",
        medicalRecord: ""
    });

    useEffect(() => {
        fetchMembers();
        fetchTrainers(); 
        fetchPackages(); 
    }, []);

    const fetchTrainers = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://127.0.0.1:8000/trainers", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTrainers(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Failed to fetch trainers", err);
        }
    };

    const fetchPackages = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://127.0.0.1:8000/packages", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPackages(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Failed to fetch packages", err);
        }
    };

    const fetchMemberDetail = async (id: number) => {
        const token = localStorage.getItem("token");
        try {
            setSelectedMember(null);
            setForm(null);
            const res = await fetch(`http://127.0.0.1:8000/profile/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch detail");
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
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch members");
            const data = await res.json();
            setMembers(data);

            if (data.length > 0) {
                fetchMemberDetail(data[0].Member_ID);
            } else {
                setSelectedMember(null);
                setForm(null);
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
                firstname: selectedMember.FirstName || "",
                lastname: selectedMember.LastName || "",
                bdate: selectedMember.Bdate || "",
                medrec: selectedMember.MedRec || "",
                weight: selectedMember.Weight || "",
                height: selectedMember.Height || "",
                package_id: selectedMember.packageID || "",
                trainer_id: selectedMember.TrainerID || "", 
            });
        }
    }, [selectedMember]);

    const handleChangeEditForm = (field: string, value: any) => {
        setForm((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSaveEdit = async () => {
        const token = localStorage.getItem("token");
        setSaving(true);
        try {
            const cleanForm = { ...form };
            
            if (!cleanForm.trainer_id) delete cleanForm.trainer_id;
            if (!cleanForm.package_id) delete cleanForm.package_id;

            const query = new URLSearchParams(cleanForm).toString();
            
            const res = await fetch(`http://127.0.0.1:8000/manager/member/update?${query}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to update");
            
            alert("Member updated successfully!");
            fetchMembers(); 
        } catch (err: any) {
            console.error(err);
            alert(`Error: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        if (selectedMember) {
            fetchMemberDetail(selectedMember.Member_ID);
        }
    };

    const handleChangeAddForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAddFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setAddFormData({ firstName: "", lastName: "", package_id: "", trainer_id: "", birthdate: "", weight: "", height: "", medicalRecord: "" });
    };

    const handleAddMemberSubmit = async () => {
        // เช็ก Validation พื้นฐาน
        if (!addFormData.firstName || !addFormData.lastName || !addFormData.birthdate) {
            alert("Please fill in First Name, Last Name, and Birthdate.");
            return;
        }

        const token = localStorage.getItem("token");
        setSaving(true); 

        try {
            const payloadData: any = {
                firstname: addFormData.firstName,
                lastname: addFormData.lastName,
                bdate: addFormData.birthdate,
                medrec: addFormData.medicalRecord || "-",
                weight: addFormData.weight || "0",
                height: addFormData.height || "0",
            };

            if (addFormData.package_id) payloadData.package_id = addFormData.package_id;
            if (addFormData.trainer_id) payloadData.trainer_id = addFormData.trainer_id;

            const query = new URLSearchParams(payloadData).toString();

            // 3. ยิง API
            const res = await fetch(`http://127.0.0.1:8000/member/create?${query}`, {
                method: "POST",
                headers: { 
                    "Accept": "application/json",
                    Authorization: `Bearer ${token}` 
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Failed to create member");
            }

            alert("Member created successfully!");
            handleCloseModal(); 
            setLoading(true);
            fetchMembers(); 
            
        } catch (err: any) {
            console.error("Error creating member:", err);
            alert(`Error: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteMember = async (memberId: number) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this member?");
        if (!isConfirmed) return;
        
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://127.0.0.1:8000/manager/member/delete/${memberId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to delete member");

            alert("Member deleted successfully!");
            setLoading(true);
            fetchMembers();
        } catch (err: any) {
            console.error(err);
            alert(`Error: ${err.message}`);
        }
    };

    if (loading) {
        return <div className="h-screen flex justify-center items-center font-bold text-2xl">Loading...</div>;
    }

    return (
        <AuthGuard>
            <div className="h-screen flex flex-col bg-[#f6f6f6] relative">
                <Navbar />

                <div className="flex h-full w-full">
                    {/* --- ฝั่งซ้าย: List Members --- */}
                    <div className="flex-col w-[70%] h-[full]">
                        <div className="flex h-[15%] w-[100%] justify-between items-center bg-[#ffffff] border-b-2 border-[#939393] px-8">
                            <div className="font-bold text-[#202022] text-3xl">Members</div>
                            <AddButton text="Add Member" onClick={() => setIsModalOpen(true)} className="px-6" />
                        </div>

                        <div className="h-[85%] p-8 flex flex-col gap-4 overflow-y-auto">
                            {members.length === 0 ? (
                                <div className="text-center text-gray-500 font-semibold mt-10">No members found.</div>
                            ) : (
                                members.map((member) => (
                                    <MemberCard
                                        key={member.Member_ID}
                                        member={member}
                                        selected={selectedMember?.Member_ID === member.Member_ID}
                                        onClick={() => fetchMemberDetail(member.Member_ID)}
                                        onDelete={() => handleDeleteMember(member.Member_ID)} 
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* --- ฝั่งขวา: Detail & Edit Sidebar --- */}
                    <div className="flex-col w-[30%] h-[full] bg-[#ffffff] border-l-1 border-gray-500">
                        <div className="flex w-[full] h-[10%] items-center">
                            <h1 className="text-[#202022] font-bold pl-8 text-3xl">Member Details</h1>
                        </div>
                        
                        {selectedMember && form ? (
                            <div className="w-full h-[90%]">
                                <DetailSidebar
                                    onCancel={handleCancelEdit}
                                    onSave={handleSaveEdit}
                                    saving={saving}
                                >
                                    <>
                                        <FormField label="Member ID">
                                            <input value={form.member_id} disabled className="w-full px-3 py-2 rounded-lg bg-gray-100 outline-none text-gray-500 border border-gray-300" />
                                        </FormField>
                                        <FormField label="First Name">
                                            <input value={form.firstname} onChange={(e) => handleChangeEditForm("firstname", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border border-black focus:border-[#5F33E1]" />
                                        </FormField>
                                        <FormField label="Last Name">
                                            <input value={form.lastname} onChange={(e) => handleChangeEditForm("lastname", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border border-black focus:border-[#5F33E1]" />
                                        </FormField>
                                        <FormField label="Birthday">
                                            <input type="date" value={form.bdate} onChange={(e) => handleChangeEditForm("bdate", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border border-black focus:border-[#5F33E1]" />
                                        </FormField>
                                        <FormField label="Medical Record">
                                            <input value={form.medrec} onChange={(e) => handleChangeEditForm("medrec", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border border-black focus:border-[#5F33E1]" />
                                        </FormField>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <FormField label="Height">
                                                    <input type="number" value={form.height} onChange={(e) => handleChangeEditForm("height", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border border-black focus:border-[#5F33E1]" />
                                                </FormField>
                                            </div>
                                            <div className="flex-1">
                                                <FormField label="Weight">
                                                    <input type="number" value={form.weight} onChange={(e) => handleChangeEditForm("weight", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border border-black focus:border-[#5F33E1]" />
                                                </FormField>
                                            </div>
                                        </div>
                                        
                                        <FormField label="Package">
                                            <select 
                                                value={form.package_id || ""} 
                                                onChange={(e) => handleChangeEditForm("package_id", e.target.value)} 
                                                className="w-full px-3 py-2 rounded-lg bg-white outline-none text-[#202022] border border-black focus:border-[#5F33E1] appearance-none"
                                            >
                                                {packages.map(p => (
                                                    <option key={p.packageID} value={p.packageID}>{p.packName}</option>
                                                ))}
                                            </select>
                                        </FormField>

                                        <FormField label="Trainer">
                                            <select 
                                                value={form.trainer_id || ""} 
                                                onChange={(e) => handleChangeEditForm("trainer_id", e.target.value)} 
                                                className="w-full px-3 py-2 rounded-lg bg-white outline-none text-[#202022] border border-black focus:border-[#5F33E1] appearance-none"
                                            >
                                                <option value="">None (No Trainer)</option>
                                                {trainers.map(t => (
                                                    <option key={t.EmployeeID} value={t.EmployeeID}>{t.FirstName} {t.LastName}</option>
                                                ))}
                                            </select>
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

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300">
                        <div className="bg-white rounded-3xl p-8 w-[700px] shadow-2xl relative flex flex-col gap-6">
                            
                            <div className="flex justify-between items-center border-b pb-4">
                                <h2 className="text-3xl font-bold text-[#202022]">Add New Member</h2>
                                <button onClick={handleCloseModal} className="text-gray-500 hover:text-black text-2xl font-bold transition-colors cursor-pointer">
                                    &#x2715;
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                {/* ฝั่งซ้าย */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold text-lg text-[#202022]">First Name</label>
                                        <input type="text" name="firstName" value={addFormData.firstName} onChange={handleChangeAddForm} placeholder="Enter first name" className="border border-[#a584ff] rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c]"/>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold text-lg text-[#202022]">Package</label>
                                        <select name="package_id" value={addFormData.package_id || ""} onChange={handleChangeAddForm} className="border border-[#a584ff] rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c] appearance-none bg-white">
                                            {packages.map(p => (
                                                <option key={p.packageID} value={p.packageID}>{p.packName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold text-lg text-[#202022]">Birthdate</label>
                                        <input type="date" name="birthdate" value={addFormData.birthdate} onChange={handleChangeAddForm} className="border border-[#a584ff] rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c]"/>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold text-lg text-[#202022]">Weight</label>
                                        <input type="number" name="weight" value={addFormData.weight} onChange={handleChangeAddForm} placeholder="Weight in kg" className="border border-[#a584ff] rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c]"/>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold text-lg text-[#202022]">Height</label>
                                        <input type="number" name="height" value={addFormData.height} onChange={handleChangeAddForm} placeholder="Height in cm" className="border border-[#a584ff] rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c]"/>
                                    </div>
                                </div>

                                {/* ฝั่งขวา */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold text-lg text-[#202022]">Last Name</label>
                                        <input type="text" name="lastName" value={addFormData.lastName} onChange={handleChangeAddForm} placeholder="Enter last name" className="border border-[#a584ff] rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c]"/>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold text-lg text-[#202022]">Assign Trainer</label>
                                        <select name="trainer_id" value={addFormData.trainer_id || ""} onChange={handleChangeAddForm} className="border border-[#a584ff] rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c] appearance-none bg-white">
                                            {/* 🔴 ตัวเลือก None */}
                                            <option value="">None (No Trainer)</option>
                                            {trainers.map(t => (
                                                <option key={t.EmployeeID} value={t.EmployeeID}>{t.FirstName} {t.LastName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1 h-full">
                                        <label className="font-bold text-lg text-[#202022]">Medical Record</label>
                                        <textarea name="medicalRecord" value={addFormData.medicalRecord} onChange={handleChangeAddForm} placeholder="Add medical records" className="border border-[#a584ff] rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#5F33E1] h-full resize-none text-sm text-[#8c8c8c]"></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 mt-2">
                                <button onClick={handleCloseModal} className="border border-gray-300 text-black font-semibold rounded-xl px-8 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleAddMemberSubmit} 
                                    disabled={saving}
                                    className="bg-[#5F33E1] text-white font-semibold rounded-xl px-12 py-2.5 hover:bg-[#4d28b8] disabled:opacity-50 transition-colors cursor-pointer"
                                >
                                    {saving ? "Adding..." : "Add"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthGuard>
    );
}