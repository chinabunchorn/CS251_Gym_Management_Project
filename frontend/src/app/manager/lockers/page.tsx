"use client";

import AuthGuard from "../../components/AuthGuard"
import Navbar from "../../components/manager_navbar"
import LockerCard from "../../components/features/lockers/Lockercard";
import DetailSidebar from "../../components/DetailSidebar";
import FormField from "../../components/FormField";
import AddButton from "../../components/AddButton";

import { useEffect, useState } from "react";

export default function Manager_lockers() {
    const [lockers, setLockers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLocker, setSelectedLocker] = useState<any | null>(null);
    const [form, setForm] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    const [members, setMembers] = useState<any[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addFormData, setAddFormData] = useState({
        locker_id: "",
        zone: ""
    });

    useEffect(() => {
        fetchLockers();
        fetchMembers();
    }, []);

    const fetchLockers = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://127.0.0.1:8000/lockers", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            const formatted = data.map((l: any) => ({
                LockerID: l.LockerID,
                Zone: l.Zone,
                Status: l.STATUS,
                UserName: l.MemberName,
                member_id: l.Member_ID || null,
            }));

            setLockers(formatted);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
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
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!selectedLocker) return;

        setForm({
            LockerID: selectedLocker.LockerID,
            Zone: selectedLocker.Zone,
            member_id: selectedLocker.member_id ?? "",
        });
    }, [selectedLocker]);

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
            const params: Record<string, string> = {
                locker_id: String(form.LockerID),
                zone: form.Zone,
            };

            if (form.member_id !== "" && form.member_id !== null && form.member_id !== undefined) {
                params.member_id = String(form.member_id);
            }

            const query = new URLSearchParams(params).toString();
            const res = await fetch(`http://127.0.0.1:8000/manager/locker/update?${query}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Update failed");
            }

            await fetchLockers();
            setSelectedLocker(null);
            setForm(null);

        } catch (err: any) {
            console.error(err);
            alert(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setSelectedLocker(null);
        setForm(null);
    };

    const fetchLockerDetail = async (LockerID: string) => {
        const token = localStorage.getItem("token");

        try {
            setSelectedLocker(null);
            setForm(null);

            const res = await fetch(
                `http://127.0.0.1:8000/locker/${LockerID}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
            setSelectedLocker(data);

        } catch (err) {
            console.error(err);
        }
    };

    const handleSelect = (locker: any) => {
        setSelectedLocker(locker);
    };

    const handleChangeAddForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAddFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setAddFormData({ locker_id: "", zone: "" });
    };

    const handleAddLockerSubmit = async () => {
        if (!addFormData.locker_id || !addFormData.zone) {
            alert("Please fill Locker ID and Zone.");
            return;
        }

        const token = localStorage.getItem("token");
        setSaving(true);

        try {
            const payload = {
                locker_id: addFormData.locker_id,
                zone: addFormData.zone,
            };

            const query = new URLSearchParams(payload).toString();

            const res = await fetch(
                `http://127.0.0.1:8000/locker/create?${query}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Failed to create locker");
            }

            alert("Locker created successfully!");
            handleCloseModal();
            fetchLockers();

        } catch (err: any) {
            console.error(err);
            alert(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteLocker = async (LockerId: number) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this locker?");
        if (!isConfirmed) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://127.0.0.1:8000/manager/locker/delete/${LockerId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to delete member");

            alert("Promotion deleted successfully!");
            setLoading(true);
            fetchLockers();
        } catch (err: any) {
            console.error(err);
            alert(`Error: ${err.message}`);
        }
    };

    if (loading) return <div>Loading...</div>;
    return (
        <AuthGuard>
            <div className="h-screen flex flex-col bg-[#f6f6f6]">

                <Navbar />

                <div className="flex h-full w-full">

                    {/*LEFT SIDE*/}
                    <div className="flex-col w-[70%] h-[full]">
                        <div className="flex h-[15%] w-[100%] justify-between items-center bg-[#ffffff] border-b-2 border-[#939393] px-8">
                            <div className="ml-8 font-bold text-[#202022] text-3xl">
                                Lockers
                            </div>
                            <AddButton text="Add Locker" onClick={() => setIsModalOpen(true)} className="px-6" />
                        </div>
                        <div className="h-[85%] p-8 flex flex-col gap-4 overflow-y-auto">
                            {lockers.map((locker) => (
                                <LockerCard
                                    key={locker.LockerID}
                                    locker={locker}
                                    selected={selectedLocker?.LockerID === locker.LockerID}
                                    onClick={() => handleSelect(locker)}
                                    onDelete={() => handleDeleteLocker(locker.LockerID)}
                                />
                            ))}
                        </div>
                    </div>

                    {/*RIGHT SIDE*/}
                    <div className="flex-col w-[30%] h-[full] bg-[#ffffff] border-l-1 border-gray-500">

                        <div className="flex w-[full] h-[10%] items-center">
                            <h1 className="text-[#202022] font-bold pl-8 text-3xl">
                                Lockers Details
                            </h1>
                        </div>

                        {selectedLocker && form ? (
                            <div className="w-full h-[90%]">
                                <DetailSidebar
                                    onCancel={handleCancel}
                                    onSave={handleSave}
                                    saving={saving}
                                >

                                    <FormField label="Locker ID">
                                        <input
                                            value={form.LockerID}
                                            disabled
                                            className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-gray-400 border border-black"
                                        />
                                    </FormField>

                                    <FormField label="Zone">
                                        <input
                                            type="text"
                                            value={form.Zone}
                                            onChange={(e) =>
                                                handleChange("Zone", e.target.value)
                                            }
                                            className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border border-black"
                                        />
                                    </FormField>

                                    <FormField label="Assign Member">
                                        <select
                                            value={form.member_id || ""}
                                            onChange={(e) => handleChange("member_id", e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg text-[#202022] border border-black"
                                        >
                                            <option value="">-- None --</option>

                                            {members.map((m) => (
                                                <option key={m.Member_ID} value={m.Member_ID}>
                                                    {m.FirstName} {m.LastName}
                                                </option>
                                            ))}
                                        </select>
                                    </FormField>

                                </DetailSidebar>
                            </div>
                        ) : (
                            <div className="w-full h-[90%] flex items-center justify-center text-gray-400">
                                No locker selected
                            </div>
                        )}

                    </div>

                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
                        <div className="bg-white rounded-3xl p-8 w-[700px] shadow-2xl flex flex-col gap-6">

                            <div className="flex justify-between items-center border-b pb-4">
                                <h2 className="text-3xl font-bold text-[#202022]">
                                    Add New Locker
                                </h2>

                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-500 hover:text-black text-2xl font-bold"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Locker ID */}
                            <div className="flex flex-col gap-1">
                                <label className="font-bold text-lg text-[#202022]">
                                    Locker ID
                                </label>

                                <input
                                    type="text"
                                    name="locker_id"
                                    value={addFormData.locker_id}
                                    onChange={handleChangeAddForm}
                                    placeholder="Enter Locker ID"
                                    className="border border-[#a584ff] rounded-lg p-2.5 text-[#202022] outline-none focus:ring-2 focus:ring-[#5F33E1]"
                                />
                            </div>

                            {/* Zone */}
                            <div className="flex flex-col gap-1">
                                <label className="font-bold text-lg text-[#202022]">
                                    Zone
                                </label>

                                <input
                                    type="text"
                                    name="zone"
                                    value={addFormData.zone}
                                    onChange={handleChangeAddForm}
                                    placeholder="Enter Zone"
                                    className="border border-[#a584ff] rounded-lg p-2.5 text-[#202022] outline-none focus:ring-2 focus:ring-[#5F33E1]"
                                />
                            </div>

                            <button
                                onClick={handleAddLockerSubmit}
                                className="bg-[#5F33E1] text-white py-3 rounded-lg font-bold hover:opacity-90"
                            >
                                Create Locker
                            </button>

                        </div>
                    </div>
                )}
            </div>
        </AuthGuard>
    );
}
