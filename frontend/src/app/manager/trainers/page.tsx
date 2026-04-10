"use client";

import AuthGuard from "../../components/AuthGuard";
import Navbar from "../../components/manager_navbar";
import TrainerCard from "../../components/features/trainers/TrainerCard";
import DetailSidebar from "../../components/DetailSidebar";
import FormField from "../../components/FormField";

import { useEffect, useState } from "react";

export default function Manager_trainers() {
    const [trainers, setTrainers] = useState<any[]>([]);
    const [selectedTrainer, setSelectedTrainer] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchTrainers();
    }, []);

    const fetchTrainers = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://127.0.0.1:8000/trainers", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setTrainers(data);

            if (data.length > 0) {
                fetchTrainerDetail(data[0].EmployeeID);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrainerDetail = async (id: number) => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(
                `http://127.0.0.1:8000/trainer/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
            setSelectedTrainer(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (selectedTrainer) {
            setForm({
                employee_id: selectedTrainer.EmployeeID,
                firstname: selectedTrainer.FirstName,
                lastname: selectedTrainer.LastName,
                specialty: selectedTrainer.Specialty || "",
                contract_type: selectedTrainer.Contract_Type || "",
            });
        }
    }, [selectedTrainer]);

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
            const query = new URLSearchParams({
                ...form,
                salary: form.salary || "0",
                username: form.username || "default",
                password: form.password || "1234",
            }).toString();

            const res = await fetch(
                `http://127.0.0.1:8000/manager/trainer/update?${query}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
            console.log(data);

            fetchTrainers();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setSelectedTrainer(null);
        setForm(null);
    };

    return (
        <AuthGuard>
            <div className="h-screen flex flex-col bg-[#f6f6f6]">
                <Navbar />

                <div className="flex h-full w-full">
                    {/* LEFT */}
                    <div className="flex-col w-[70%] h-full">

                        <div className="flex h-[15%] w-[100%] justify-between items-center bg-[#ffffff] border-b-2 border-[#939393]">
                            <div className="ml-8 font-bold text-[#202022] text-3xl">
                                Trainers
                            </div>
                        </div>

                        <div className="h-[85%] p-8 flex flex-col gap-4 overflow-y-auto">
                            {trainers.map((trainer) => (
                                <TrainerCard
                                    key={trainer.EmployeeID}
                                    trainer={trainer}
                                    selected={
                                        selectedTrainer?.EmployeeID === trainer.EmployeeID
                                    }
                                    onClick={() =>
                                        fetchTrainerDetail(trainer.EmployeeID)
                                    }
                                />
                            ))}
                        </div>

                    </div>

                    {/* RIGHT */}
                    <div className="flex-col w-[30%] h-full bg-[#ffffff] border-l border-gray-500">

                        <div className="flex w-full h-[10%] items-center">
                            <h1 className="text-[#202022] font-bold pl-8 text-3xl">
                                Trainer Details
                            </h1>
                        </div>

                        {selectedTrainer && form ? (
                            <div className="w-full h-[90%]">
                                <DetailSidebar
                                    onCancel={handleCancel}
                                    onSave={handleSave}
                                    saving={saving}
                                >
                                    <>
                                        <FormField label="Employee ID">
                                            <input
                                                value={form.employee_id}
                                                disabled
                                                className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border border-black"
                                            />
                                        </FormField>

                                        <FormField label="First Name">
                                            <input
                                                value={form.firstname}
                                                onChange={(e) =>
                                                    handleChange("firstname", e.target.value)
                                                }
                                                className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border border-black"
                                            />
                                        </FormField>

                                        <FormField label="Last Name">
                                            <input
                                                value={form.lastname}
                                                onChange={(e) =>
                                                    handleChange("lastname", e.target.value)
                                                }
                                                className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border border-black"
                                            />
                                        </FormField>

                                        <FormField label="Specialty">
                                            <input
                                                value={form.specialty}
                                                onChange={(e) =>
                                                    handleChange("specialty", e.target.value)
                                                }
                                                className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border border-black"
                                            />
                                        </FormField>

                                        <FormField label="Contract Type">
                                            <input
                                                value={form.contract_type}
                                                onChange={(e) =>
                                                    handleChange("contract_type", e.target.value)
                                                }
                                                className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border border-black"
                                            />
                                        </FormField>

                                    </>
                                </DetailSidebar>
                            </div>
                        ) : (
                            <div className="w-full h-[90%] flex items-center justify-center text-gray-400">
                                No trainer selected
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}