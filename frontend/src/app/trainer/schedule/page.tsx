"use client";

import AuthGuard from "../../components/AuthGuard";
import Navbar from "../../components/trainer_navbar";
import Date_changer from "../../components/Date_changer";
import Calendar from "../../components/Calendar";

import { useEffect, useState } from "react";

interface GymClass {
    class_name: string;
    class_date: string;
    class_time: string;
    capacity: number;
    applied: number;
}

export default function Trainer_schedule() {
    const [classes, setClasses] = useState<GymClass[]>([]);
    const [trainer, setTrainer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const token = localStorage.getItem("token");

            const [trainerRes, classesRes] = await Promise.all([
                fetch("http://localhost:8000/trainer/me", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch("http://localhost:8000/trainer/classes", {
                    headers: { Authorization: `Bearer ${token}` },
                })
            ]);

            if (!classesRes.ok || !trainerRes.ok) {
                throw new Error("Failed to fetch");
            }

            const classes_data = await classesRes.json();
            setClasses(classes_data);
            const trainer_data = await trainerRes.json();
            setTrainer(trainer_data);

        } catch (error) {
            console.error("Error fetching", error);
        } finally {
            setLoading(false);
        }
    };

    // normalize helper
    const normalizeDate = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    // filter only selected day classes
    const filteredClasses = classes.filter((gymClass) => {
        const classDate = normalizeDate(new Date(gymClass.class_date));
        const selected = normalizeDate(selectedDate);

        return classDate.getTime() === selected.getTime();
    });

    // get week range
    const selected = normalizeDate(selectedDate);

    const day = selected.getDay() || 7;

    const startOfWeek = new Date(selected);
    startOfWeek.setDate(selected.getDate() - day + 1);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // weekly class counts
    const weeklyClassCounts = classes
        .filter((gymClass) => {
            const classDate = normalizeDate(new Date(gymClass.class_date));

            return classDate >= startOfWeek && classDate <= endOfWeek;
        })
        .reduce((acc: Record<string, number>, gymClass) => {
            acc[gymClass.class_name] = (acc[gymClass.class_name] || 0) + 1;
            return acc;
        }, {});

    //Different color card
    const cardColors = [
        "#FFEDD1",
        "#BFDBFE",
        "#E7F3FF",
        "#FED9EC",
        "#A7F3D0",
        "#DDD6FE",
        "#FED7AA",
    ];

    if (loading) {
        return <p>Loading classes...</p>;
    }
    return (
        <AuthGuard>
            <div className="h-screen flex flex-col bg-[#f6f6f6]">

                <Navbar />

                <div className="flex h-full w-full">

                    <div className="flex-col w-[30%] h-[full] justify-center items-center bg-[#ffffff] p-5 border-2 border-r-[#939393]">
                        <div className="flex w-full h-[40%] justify-center items-center">
                            <Calendar
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                            />
                        </div>
                        <div className="flex-col w-full h-[60%] justify-center items-center p-3">
                            <div className="flex w-full text-[#202022] font-bold text-3xl">Your schedule this week</div>
                            <div className="flex flex-col w-[80%] p-6 gap-5 m-auto">
                                {Object.keys(weeklyClassCounts).length === 0 ? (
                                    <h3 className="flex justify-center items-center text-xl font-bold text-[#202022]">
                                        No classes this week
                                    </h3>
                                ) : (
                                    Object.entries(weeklyClassCounts).map(
                                        ([className, count], index) => (
                                            <div
                                                key={index}
                                                className="flex h-[100px] rounded-3xl p-5 items-center justify-between"
                                                style={{
                                                    backgroundColor:
                                                        cardColors[index % cardColors.length],
                                                }}
                                            >
                                                <h3 className="text-2xl font-bold text-[#202022]">
                                                    {className}
                                                </h3>
                                                <p className="text-[#202022] text-lg font-bold mt-2 mr-5">
                                                    {count}
                                                </p>
                                            </div>
                                        ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex-col w-[70%] h-[full]">
                        <div className="flex w-full h-[20%] bg-[#ffffff] border-2 border-b-[#939393]">
                            <Date_changer
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                title="Schedule" />
                        </div>
                        <div className="flex-col w-full h-[80%] p-3">
                            {filteredClasses.length === 0 ? (
                                <div className="flex justify-center items-center w-full h-full m-auto rounded-3xl text-[#202022] text-5xl font-bold">No Classes today</div>
                            ) : (
                                filteredClasses.map((gymClass, index) => (
                                    <div key={index} className="flex w-full h-[25%] mb-8 rounded-4xl bg-white text-[#202022]">
                                        <div className="flex w-[15%] p-2 justify-center items-center">
                                            <p className="font-bold text-xl">{(gymClass.class_time)}</p>
                                        </div>
                                        <div className="flex h-[80%] border-1 border-[#000000] m-auto"></div>
                                        <div className="flex-col justify-center items-center p-5 w-[65%] ml-5 m-auto">
                                            <h2 className="text-3xl mb-2 font-bold">{gymClass.class_name}</h2>
                                            <p className="text-[#736A6A] mb-2">Instructor: {trainer?.first_name} {trainer?.last_name}</p>
                                            <p className="text-[#736A6A] mb-2">
                                                Capacity : {gymClass.applied}/{gymClass.capacity}
                                            </p>
                                        </div>
                                        <div className="flex w-[20%] justify-center items-center">
                                            <div className="flex w-[70%] h-[40%] bg-[#5F33E1] justify-center items-center rounded-2xl text-[#ffffff] font-bold text-lg">View Details</div>
                                        </div>
                                    </div>
                                )
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    )
}

