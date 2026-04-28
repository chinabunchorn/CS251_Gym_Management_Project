"use client";

import AuthGuard from "../../components/AuthGuard";
import Navbar from "../../components/manager_navbar";
import DetailSidebar from "../../components/DetailSidebar";
import FormField from "../../components/FormField";
import AddButton from "../../components/AddButton";

import { useEffect, useState } from "react";
import EquipmentCard from "@/app/components/features/equipments/EquipmentCard";

export default function Manager_equipment() {
    const [equipment, setEquipment] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedEquipment, setSelectedEquipment] = useState<any | null>(null);
    const [form, setForm] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addFormData, setAddFormData] = useState({
        equipment_id: "",
        equipment_name: "",
        import_date: ""
    });

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            const formatted = data.map((e: any) => ({
                EquipmentID: e.Equipment_ID,
                Name: e.Equipment,
                Status: e.STATUS,
                ImportDate: e.Import_Date,
            }));

            setEquipment(formatted);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchEquipmentDetail = async (equipment_id: string) => {
        const token = localStorage.getItem("token");

        try {
            setSelectedEquipment(null);
            setForm(null);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/equipment/${equipment_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            setSelectedEquipment({
                EquipmentID: data.Equipment_ID,
                Name: data.Equipment,
                Status: data.STATUS,
                ImportDate: data.Import_Date,
            });

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!selectedEquipment) return;

        setForm({
            equipment_id: selectedEquipment.EquipmentID,
            equipment_name: selectedEquipment.Name,
            import_date: selectedEquipment.ImportDate,
            status: selectedEquipment.Status,
        });
    }, [selectedEquipment]);

    const handleChange = (field: string, value: any) => {
        setForm((prev: any) => ({
            ...prev,
            [field]: value,
        }));
    };

    // UPDATE
    const handleSave = async () => {
        const token = localStorage.getItem("token");
        setSaving(true);

        try {
            const payload = {
                equipment_id: form.equipment_id,
                equipment_name: form.equipment_name,
                import_date: form.import_date,
                status: form.status,
            };

            const query = new URLSearchParams(payload).toString();

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/manager/equipment/update?${query}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            fetchEquipment();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleSelect = (equipment: any) => {
        setSelectedEquipment(equipment);
    };

    const handleCancel = () => {
        setSelectedEquipment(null);
        setForm(null);
    };

    // CREATE
    const handleAddEquipmentSubmit = async () => {
        if (!addFormData.equipment_id || !addFormData.equipment_name || !addFormData.import_date) {
            alert("Please fill all fields");
            return;
        }

        const token = localStorage.getItem("token");
        setSaving(true);

        try {
            const payload = {
                equipment_id: addFormData.equipment_id,
                equipment_name: addFormData.equipment_name,
                import_date: addFormData.import_date,
            };

            const query = new URLSearchParams(payload).toString();

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment/create?${query}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to create equipment");

            setIsModalOpen(false);
            setAddFormData({ equipment_id: "", equipment_name: "", import_date: "" });
            fetchEquipment();

        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteEquipment = async (EquipmentID: number) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this equipment?");
        if (!isConfirmed) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/manager/equipment/delete/${EquipmentID}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to delete equipment");

            alert("Equipment deleted successfully!");
            setLoading(true);
            fetchEquipment();
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

                    {/* LEFT SIDE */}
                    <div className="flex-col w-[70%] h-[full]">

                        <div className="flex h-[15%] w-[100%] justify-between items-center bg-[#ffffff] border-b-2 border-[#939393] px-8">
                            <div className="ml-8 font-bold text-[#202022] text-3xl">
                                Equipment
                            </div>

                            <AddButton
                                text="Add Equipment"
                                onClick={() => setIsModalOpen(true)}
                                className="px-6"
                            />
                        </div>

                        <div className="h-[85%] p-8 flex flex-col gap-4 overflow-y-auto">

                            {equipment.map((item) => (
                                <EquipmentCard
                                    key={item.EquipmentID}
                                    equipment={item}
                                    selected={selectedEquipment?.EquipmentID === item.EquipmentID}
                                    onClick={() => handleSelect(item)}
                                    onDelete={() => handleDeleteEquipment(item.EquipmentID)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex-col w-[30%] h-[full] bg-[#ffffff] border-l-1 border-gray-500">

                        <div className="flex w-[full] h-[10%] items-center">
                            <h1 className="text-[#202022] font-bold pl-8 text-3xl">
                                Equipment Details
                            </h1>
                        </div>

                        {selectedEquipment && form ? (
                            <div className="w-full h-[90%]">
                                <DetailSidebar
                                    onCancel={handleCancel}
                                    onSave={handleSave}
                                    saving={saving}
                                >

                                    <FormField label="Equipment ID">
                                        <input
                                            value={form.equipment_id}
                                            disabled
                                            className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-gray-400 border border-black"
                                        />
                                    </FormField>

                                    <FormField label="Name">
                                        <input
                                            value={form.equipment_name}
                                            onChange={(e) => handleChange("equipment_name", e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-black text-[#202022]"
                                        />
                                    </FormField>

                                    <FormField label="Import Date">
                                        <input
                                            type="date"
                                            value={form.import_date}
                                            onChange={(e) => handleChange("import_date", e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-black text-[#202022]"
                                        />
                                    </FormField>

                                    <FormField label="Status">
                                        <select
                                            value={form.status}
                                            onChange={(e) => handleChange("status", e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-black text-[#202022]"
                                        >
                                            <option value="Available">Available</option>
                                            <option value="Broken">Broken</option>
                                            <option value="Maintenance">Maintenance</option>
                                        </select>
                                    </FormField>

                                </DetailSidebar>
                            </div>
                        ) : (
                            <div className="w-full h-[90%] flex items-center justify-center text-gray-400">
                                No equipment selected
                            </div>
                        )}

                    </div>

                </div>

                {/* MODAL */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
                        <div className="bg-white rounded-3xl p-8 w-[700px] shadow-2xl flex flex-col gap-6">

                            <div className="flex justify-between items-center border-b pb-4">
                                <h2 className="text-3xl font-bold text-[#202022]">
                                    Add New Equipment
                                </h2>

                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-500 hover:text-black text-2xl font-bold"
                                >
                                    ✕
                                </button>
                            </div>

                            <input
                                placeholder="Equipment ID"
                                value={addFormData.equipment_id}
                                onChange={(e) =>
                                    setAddFormData(prev => ({ ...prev, equipment_id: e.target.value }))
                                }
                                className="border p-2 rounded-lg text-[#202022]"
                            />

                            <input
                                placeholder="Name"
                                value={addFormData.equipment_name}
                                onChange={(e) =>
                                    setAddFormData(prev => ({ ...prev, equipment_name: e.target.value }))
                                }
                                className="border p-2 rounded-lg text-[#202022]"
                            />

                            <input
                                type="date"
                                value={addFormData.import_date}
                                onChange={(e) =>
                                    setAddFormData(prev => ({ ...prev, import_date: e.target.value }))
                                }
                                className="border p-2 rounded-lg text-[#202022]"
                            />

                            <button
                                onClick={handleAddEquipmentSubmit}
                                className="bg-[#5F33E1] text-white py-3 rounded-lg font-bold"
                            >
                                Create Equipment
                            </button>

                        </div>
                    </div>
                )}

            </div>
        </AuthGuard>
    );
}