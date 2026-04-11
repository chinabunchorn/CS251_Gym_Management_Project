"use client";

import AuthGuard from "../../components/AuthGuard";
import Navbar from "../../components/manager_navbar";
import TrainerCard from "../../components/features/trainers/TrainerCard";
import DetailSidebar from "../../components/DetailSidebar";
import FormField from "../../components/FormField";
import AddButton from "../../components/AddButton";

import { useEffect, useState } from "react";

export default function Manager_trainers() {
    const [trainers, setTrainers] = useState<any[]>([]);
    const [selectedTrainer, setSelectedTrainer] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addFormData, setAddFormData] = useState({
        firstName: "",
        lastName: "",
        specialty: "",
        contract_type: "",
        start_date: "",
        salary: "",
    });

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
                salary: selectedTrainer.Salary || 0,
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

    const handleChangeAddForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAddFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setAddFormData({ firstName: "", lastName: "", specialty: "", contract_type: "", start_date: "", salary: "" });
    };

    const handleAddMemberSubmit = async () => {
        if (!addFormData.firstName || !addFormData.lastName || !addFormData.specialty) {
            alert("Please fill in First Name, Last Name, and Specialty.");
            return;
        }

        const token = localStorage.getItem("token");
        setSaving(true);

        try {
            const payloadData: any = {
                firstname: addFormData.firstName,
                lastname: addFormData.lastName,
                salary: addFormData.salary,
                username: `${addFormData.firstName.toLowerCase()}`,
                password: addFormData.start_date,
                start_date: addFormData.start_date,
                contract_type: addFormData.contract_type || "Full-time",
                specialty: addFormData.specialty || null,
            };

            const query = new URLSearchParams(payloadData).toString();

            const res = await fetch(`http://127.0.0.1:8000/employee/create?${query}`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Failed to create trainer");
            }

            alert("Trainer created successfully!");
            handleCloseModal();
            fetchTrainers();

        } catch (err: any) {
            console.error("Error creating trainer:", err);
            alert(`Error: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteTrainer = async (trainerId: number) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this trainer?");
        if (!isConfirmed) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://127.0.0.1:8000/manager/trainer/delete/${trainerId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to delete member");

            alert("Trainer deleted successfully!");
            setLoading(true);
            fetchTrainers();
        } catch (err: any) {
            console.error(err);
            alert(`Error: ${err.message}`);
        }
    };

    return (
        <AuthGuard>
            <div className="h-screen flex flex-col bg-[#f6f6f6]">
                <Navbar />

                <div className="flex h-full w-full">
                    {/* LEFT */}
                    <div className="flex-col w-[70%] h-full">

                        <div className="flex h-[15%] w-[100%] justify-between items-center bg-[#ffffff] border-b-2 border-[#939393] px-8">
                            <div className="ml-8 font-bold text-[#202022] text-3xl">
                                Trainers
                            </div>
                            <AddButton text="Add Trainer" onClick={() => setIsModalOpen(true)} className="px-6" />
                        </div>

                        <div className="h-[85%] p-8 flex flex-col gap-4 overflow-y-auto">
                            {trainers.length === 0 ? (
                                <div className="text-center text-gray-500 font-semibold mt-10">No trainers found.</div>
                            ) : (

                                trainers.map((trainer) => (
                                    <TrainerCard
                                        key={trainer.EmployeeID}
                                        trainer={trainer}
                                        selected={
                                            selectedTrainer?.EmployeeID === trainer.EmployeeID
                                        }
                                        onClick={() =>
                                            fetchTrainerDetail(trainer.EmployeeID)
                                        }
                                        onDelete={() => handleDeleteTrainer(trainer.EmployeeID)}
                                    />
                                ))
                            )}
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
                                            <select
                                                value={form.contract_type}
                                                onChange={(e) =>
                                                    handleChange("contract_type", e.target.value)
                                                }
                                                className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border border-black"
                                            >
                                                <option value="" disabled>
                                                    Select contract type
                                                </option>
                                                <option value="Full-time">Full-time</option>
                                                <option value="Part-time">Part-time</option>
                                            </select>
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

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300">
                        <div className="bg-white rounded-3xl p-8 w-[700px] shadow-2xl relative flex flex-col gap-6">

                            <div className="flex justify-between items-center border-b pb-4">
                                <h2 className="text-3xl font-bold text-[#202022]">Add New Trainer</h2>
                                <button onClick={handleCloseModal} className="text-gray-500 hover:text-black text-2xl font-bold transition-colors cursor-pointer">
                                    &#x2715;
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                {/* ฝั่งซ้าย */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold text-lg text-[#202022]">First Name</label>
                                        <input type="text" name="firstName" value={addFormData.firstName} onChange={handleChangeAddForm} placeholder="Enter first name" className="border border-[#a584ff] rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c]" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold text-lg text-[#202022]">Specialty</label>
                                        <input
                                            name="specialty"
                                            value={addFormData.specialty}
                                            onChange={handleChangeAddForm}
                                            className="border border-[#a584ff] rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c] appearance-none bg-white"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold text-lg text-[#202022]">Contract type</label>
                                        <select name="contract_type" value={addFormData.contract_type} onChange={handleChangeAddForm} className="border border-[#a584ff] rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c]" >
                                            <option value="" disabled>
                                                Select contract type
                                            </option>
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                        </select>
                                    </div>
                                </div>

                                {/* ฝั่งขวา */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold text-lg text-[#202022]">Last Name</label>
                                        <input type="text" name="lastName" value={addFormData.lastName} onChange={handleChangeAddForm} placeholder="Enter last name" className="border border-[#a584ff] rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c]" />
                                    </div>
                                    <div className="flex flex-col gap-1 h-full">
                                        <label className="font-bold text-lg text-[#202022]">Start Date</label>
                                        <input
                                            type="date"
                                            name="start_date"
                                            value={addFormData.start_date}
                                            onChange={handleChangeAddForm}
                                            className="border border-[#a584ff] rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c]"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold text-lg text-[#202022]">Salary</label>
                                        <input
                                            type="number"
                                            name="salary"
                                            value={addFormData.salary}
                                            onChange={handleChangeAddForm}
                                            placeholder="Enter salary"
                                            className="border border-[#a584ff] rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c]"
                                        />
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
        </AuthGuard >
    );
}