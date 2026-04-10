"use client";

import AuthGuard from "../../components/AuthGuard";
import Navbar from "../../components/trainer_navbar";
import { useEffect, useState } from "react";

export default function Trainer_equipment() {
    const [equipment, setEquipment] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEquipment, setSelectedEquipment] = useState<string>("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://127.0.0.1:8000/equipment", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch equipment");
            }

            const data = await response.json();
            setEquipment(data);

            if (data.length > 0) {
                setSelectedEquipment(data[0].Equipment);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const equipmentTypes = Array.from(
        new Set(equipment.map((item) => item.Equipment))
    );

    const filteredEquipment = equipment.filter(
        (item) => item.Equipment === selectedEquipment
    );

    if (loading) {
        return <p className="p-5">Loading...</p>;
    }

    return (
        <AuthGuard>
            <div className="h-screen flex flex-col bg-[#f6f6f6]">

                <Navbar />

                <div className="flex h-full w-full">

                    <div className="flex-col w-[30%] h-[full] justify-center items-center bg-[#ffffff] pl-5 border-2 border-r-[#939393]">
                        <div className="flex w-full h-[20%] justify-left items-center pl-5">
                            <h1 className="text-3xl text-[#202022] font-bold">Equipments</h1>
                        </div>
                        <div className="flex-col w-full h-[75%] justfiy-left items-center pl-10">
                            {equipment.length === 0 ? (
                                <p className="text-gray-500 text-xl">No equipment available</p>
                            ) : (
                                equipmentTypes.map((type, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedEquipment(type)}
                                        className={`text-xl text-[#202022] font-bold w-[90%] h-[60px] justify-left flex items-center pl-5 rounded-2xl mt-3
                                            ${selectedEquipment === type
                                                ? "bg-gray-100"
                                                : "hover:bg-gray-100"
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="flex-col w-[70%] h-[full]">
                        <div className="flex w-full h-[20%] justify-left items-center pl-8 bg-[#ffffff] border-2 border-b-[#939393]">
                            <h1 className="text-2xl text-[#202022] font-semibold">Equipment Name</h1>
                        </div>

                        <div className="p-6 grid grid-cols-3 gap-6 h-[80%]">
                            {filteredEquipment.length === 0 ? (
                                <p className="text-gray-500 col-span-3">
                                    No equipment found
                                </p>
                            ) : (
                                filteredEquipment.map((item, index) => (
                                    <div key={index} className="flex-col justify-center items-center bg-white rounded-xl shadow p-4 h-[200px]">

                                        <div className="w-full h-[25%] flex justify-left items-center mb-3">
                                            <p className="text-lg font-semibold text-gray-500">
                                                {item.Equipment_ID}
                                            </p>
                                        </div>

                                        <div className="w-full h-[25%] flex justify-center items-center mb-2">
                                            <h2 className="text-3xl font-bold text-[#202022]">
                                                {item.Equipment}
                                            </h2>
                                        </div>

                                        <div className="w-full h-[50%] flex justify-center items-center">
                                            <div className={`text-xl p-2 rounded-xl
                                         ${item.STATUS === "Available"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-red-100 text-red-600"
                                                }`}
                                            >
                                                {item.STATUS}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard >
    )
}

