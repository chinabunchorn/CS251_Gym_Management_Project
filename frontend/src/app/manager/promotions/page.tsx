"use client";

import AuthGuard from "../../components/AuthGuard";
import Navbar from "../../components/manager_navbar";
import PromotionCard from "../../components/features/promotions/PromotionCard";
import DetailSidebar from "../../components/DetailSidebar";
import FormField from "../../components/FormField";

import { useEffect, useState } from "react";

export default function Manager_promotions() {
    const [promotions, setPromotions] = useState<any[]>([]);
    const [selectedPromotion, setSelectedPromotion] = useState<any | null>(null);
    const [form, setForm] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        fetchPromotions();
    }, []);

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

    return (
        <AuthGuard>
            <div className="h-screen flex flex-col bg-[#f6f6f6]">

                <Navbar />

                <div className="flex h-full w-full">

                    {/* LEFT SIDE */}
                    <div className="flex-col w-[70%] h-[full]">

                        <div className="flex h-[15%] w-[100%] justify-between items-center bg-[#ffffff] border-b-2 border-[#939393]">
                            <div className="ml-8 font-bold text-[#202022] text-3xl">
                                Promotions
                            </div>
                        </div>

                        <div className="h-[85%] p-8 flex flex-col gap-4 overflow-y-auto">

                            {promotions.map((promo) => (
                                <PromotionCard
                                    key={promo.PromoCode}
                                    promotion={promo}
                                    selected={selectedPromotion?.PromoCode === promo.PromoCode}
                                    onClick={() => fetchPromotionDetail(promo.PromoCode)}
                                />
                            ))}

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

                                    <FormField label="Package ID">
                                        <input
                                            value={form.package_id}
                                            onChange={(e) =>
                                                handleChange("package_id", e.target.value)
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-black text-[#202022]"
                                        />
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

            </div>
        </AuthGuard>
    );
}