"use client";

import AuthGuard from "../../components/AuthGuard";
import Navbar from "../../components/manager_navbar";
import PromotionCard from "../../components/features/promotions/PromotionCard";
import DetailSidebar from "../../components/DetailSidebar";
import FormField from "../../components/FormField";
import AddButton from "../../components/AddButton";

import { useEffect, useState } from "react";

interface Package {
    packageID: string;
    packName: string;
}

export default function Manager_promotions() {
    const [promotions, setPromotions] = useState<any[]>([]);
    const [selectedPromotion, setSelectedPromotion] = useState<any | null>(null);
    const [form, setForm] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addFormData, setAddFormData] = useState({
        promotion_code: "",
        discount_rate: "",
        package_id: "",
        start_date: "",
        end_date: ""
    });

    const [packages, setPackages] = useState<Package[]>([]);

    useEffect(() => {
        fetchPromotions();
        fetchPackages();
    }, []);

    const fetchPromotions = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://127.0.0.1:8000/promotions", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setPromotions(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPromotionDetail = async (promo_code: string) => {
        const token = localStorage.getItem("token");

        try {
            setSelectedPromotion(null);
            setForm(null);

            const res = await fetch(
                `http://127.0.0.1:8000/promotion/${promo_code}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
            setSelectedPromotion(data);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!selectedPromotion) return;

        setForm({
            promo_code: selectedPromotion.PromoCode,
            discount_rate: selectedPromotion.DiscountRate * 100,
            package_id: selectedPromotion.packageID || "",
            start_date: selectedPromotion.StartDate,
            end_date: selectedPromotion.EndDate,
        });
    }, [selectedPromotion]);

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
            const payload = {
                ...form,
                discount_rate: Number(form.discount_rate) / 100,
            };

            const query = new URLSearchParams(payload).toString();

            const res = await fetch(
                `http://127.0.0.1:8000/manager/promotion/update?${query}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            await res.json();

            const refresh = await fetch("http://127.0.0.1:8000/promotions", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setPromotions(await refresh.json());

        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setSelectedPromotion(null);
        setForm(null);
    };

    const handleChangeAddForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAddFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setAddFormData({ promotion_code: "", discount_rate: "", package_id: "", start_date: "", end_date: "" });
    };

    const handleAddPromotionSubmit = async () => {
        // เช็ก Validation พื้นฐาน
        if (!addFormData.promotion_code || !addFormData.discount_rate || !addFormData.package_id) {
            alert("Please fill in Promotion Code, Discount rate, and Package.");
            return;
        }

        const token = localStorage.getItem("token");
        setSaving(true);

        try {
            const payloadData: any = {
                promo_code: addFormData.promotion_code,
                discount_rate: Number(addFormData.discount_rate) / 100,
                package_id: addFormData.package_id,
                start_date: addFormData.start_date,
                end_date: addFormData.end_date,
            };

            if (addFormData.package_id) payloadData.package_id = addFormData.package_id;

            const query = new URLSearchParams(payloadData).toString();

            // 3. ยิง API
            const res = await fetch(`http://127.0.0.1:8000/promotion/create?${query}`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.log("Backend error:", errorData);

                const message =
                    typeof errorData.detail === "string"
                        ? errorData.detail
                        : typeof errorData.message === "string"
                            ? errorData.message
                            : errorData.detail?.msg ||
                            errorData.message?.msg ||
                            JSON.stringify(errorData);

                throw new Error(message);
            }

            alert("Promotion created successfully!");
            handleCloseModal();
            setLoading(true);
            fetchPromotions();

        } catch (err: any) {
            console.error("Error creating promotion:", err);
            alert(`Error: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDeletePromotion = async (promoId: number) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this promotion?");
        if (!isConfirmed) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://127.0.0.1:8000/manager/promotion/delete/${promoId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to delete member");

            alert("Promotion deleted successfully!");
            setLoading(true);
            fetchPromotions();
        } catch (err: any) {
            console.error(err);
            alert(`Error: ${err.message}`);
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


    return (
        <AuthGuard>
            <div className="h-screen flex flex-col bg-[#f6f6f6]">

                <Navbar />

                <div className="flex h-full w-full">

                    {/* LEFT SIDE */}
                    <div className="flex-col w-[70%] h-[full]">

                        <div className="flex h-[15%] w-[100%] justify-between items-center bg-[#ffffff] border-b-2 border-[#939393] px-8">
                            <div className="ml-8 font-bold text-[#202022] text-3xl">
                                Promotions
                            </div>
                            <AddButton text="Add Promotion" onClick={() => setIsModalOpen(true)} className="px-6" />
                        </div>

                        <div className="h-[85%] p-8 flex flex-col gap-4 overflow-y-auto">
                            {promotions.length === 0 ? (
                                <div className="text-center text-gray-500 font-semibold mt-10">No promotions found.</div>
                            ) : (
                                promotions.map((promo) => (
                                    <PromotionCard
                                        key={promo.PromoCode}
                                        promotion={promo}
                                        selected={selectedPromotion?.PromoCode === promo.PromoCode}
                                        onClick={() => fetchPromotionDetail(promo.PromoCode)}
                                        onDelete={() => handleDeletePromotion(promo.PromoCode)}
                                    />
                                ))
                            )}

                        </div>

                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex-col w-[30%] h-[full] bg-[#ffffff] border-l-1 border-gray-500">

                        <div className="flex w-[full] h-[10%] items-center">
                            <h1 className="text-[#202022] font-bold pl-8 text-3xl">
                                Promotion Details
                            </h1>
                        </div>

                        {selectedPromotion && form ? (
                            <div className="w-full h-[90%]">
                                <DetailSidebar
                                    onCancel={handleCancel}
                                    onSave={handleSave}
                                    saving={saving}
                                >

                                    <FormField label="Promo Code">
                                        <input
                                            value={form.promo_code}
                                            disabled
                                            className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-gray-400 border border-black"
                                        />
                                    </FormField>

                                    <FormField label="Discount Rate (%)">
                                        <input
                                            type="number"
                                            value={form.discount_rate}
                                            onChange={(e) =>
                                                handleChange("discount_rate", e.target.value)
                                            }
                                            className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border border-black"
                                        />
                                    </FormField>

                                    <FormField label="Start Date">
                                        <input
                                            type="date"
                                            value={form.start_date}
                                            onChange={(e) =>
                                                handleChange("start_date", e.target.value)
                                            }
                                            className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border border-black"
                                        />
                                    </FormField>

                                    <FormField label="End Date">
                                        <input
                                            type="date"
                                            value={form.end_date}
                                            onChange={(e) =>
                                                handleChange("end_date", e.target.value)
                                            }
                                            className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-[#202022] border border-black"
                                        />
                                    </FormField>

                                    <FormField label="Package">
                                        <select
                                            value={form.package_id || ""}
                                            onChange={(e) => handleChange("package_id", e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg bg-white outline-none text-[#202022] border border-black focus:border-[#5F33E1] appearance-none"
                                        >
                                            {packages.map(p => (
                                                <option key={p.packageID} value={p.packageID}>{p.packName}</option>
                                            ))}
                                        </select>
                                    </FormField>

                                </DetailSidebar>
                            </div>
                        ) : (
                            <div className="w-full h-[90%] flex items-center justify-center text-gray-400">
                                No promotion selected
                            </div>
                        )}

                    </div>

                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300">
                        <div className="bg-white rounded-3xl p-8 w-[700px] shadow-2xl relative flex flex-col gap-6">

                            <div className="flex justify-between items-center border-b pb-4">
                                <h2 className="text-3xl font-bold text-[#202022]">Add New Promotion</h2>
                                <button onClick={handleCloseModal} className="text-gray-500 hover:text-black text-2xl font-bold transition-colors cursor-pointer">
                                    &#x2715;
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                {/* ฝั่งซ้าย */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold text-lg text-[#202022]">Promotion Code</label>
                                        <input type="text" name="promotion_code" value={addFormData.promotion_code} onChange={handleChangeAddForm} placeholder="Enter Promotion Code" className="border border-[#a584ff] rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c]" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold text-lg text-[#202022]">Discount Rate</label>
                                        <input type="number" name="discount_rate" value={addFormData.discount_rate} onChange={handleChangeAddForm} placeholder="Enter Discount Rate" className="border border-[#a584ff] rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c]" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold text-lg text-[#202022]">Use with Package</label>
                                        <select name="package_id" value={addFormData.package_id || ""} onChange={handleChangeAddForm} className="border border-[#a584ff] rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c] appearance-none bg-white">
                                            <option value="">Select package</option>
                                            {packages.map(p => (
                                                <option key={p.packageID} value={p.packageID}>{p.packName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold text-lg text-[#202022]">Start Date</label>
                                        <input type="date" name="start_date" value={addFormData.start_date} onChange={handleChangeAddForm} className="border border-[#a584ff] rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c]" />
                                    </div>

                                </div>

                                {/* ฝั่งขวา */}
                                <div className="flex flex-col gap-4 mt-auto">
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold text-lg text-[#202022]">End Date</label>
                                        <input type="date" name="end_date" value={addFormData.end_date} onChange={handleChangeAddForm} className="border border-[#a584ff] rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c]" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 mt-2">
                                <button onClick={handleCloseModal} className="border border-gray-300 text-black font-semibold rounded-xl px-8 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddPromotionSubmit}
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