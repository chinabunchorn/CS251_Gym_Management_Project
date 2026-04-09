"use client";

import AuthGuard from "../../components/AuthGuard";
import Navbar from "../../components/trainer_navbar";
import Date_changer from "../../components/Date_changer";
import Calendar from "../../components/Calendar";

import { useEffect, useState } from "react";

interface GymClass {
    ClassName: string;
    InstructorName: string;
    ClassDate: string;
    ClassTime: number;
    Capacity: number;
    ReservedCount: number;
}

export default function Trainer_classes() {
    const [classes, setClasses] = useState<GymClass[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch("http://127.0.0.1:8000/classes", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch classes");
            }

            const data = await response.json();
            setClasses(data);
        } catch (error) {
            console.error("Error fetching classes:", error);
        } finally {
            setLoading(false);
        }
    };

    //seconds to time
    function secondsToTime(seconds: string | number): string {
        const totalSeconds = Number(seconds);

        let hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        const period = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;

        if (hours === 0) {
            hours = 12;
        }

        return `${hours}:${minutes
            .toString()
            .padStart(2, "0")} ${period}`;
    }

    //filter only today's class
    const filteredClasses = classes.filter((gymClass) => {
        const classDate = new Date(gymClass.ClassDate);

        return (
            classDate.toDateString() === selectedDate.toDateString()
        );
    });

    //Get classname and amount this week
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const weeklyClassCounts = classes
        .filter((gymClass) => {
            const classDate = new Date(gymClass.ClassDate);
            return classDate >= startOfWeek && classDate <= endOfWeek;
        })
        .reduce((acc: Record<string, number>, gymClass) => {
            acc[gymClass.ClassName] = (acc[gymClass.ClassName] || 0) + 1;
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
                            <div className="flex w-full text-[#202022] font-bold text-3xl">Class this week</div>
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
                                setSelectedDate={setSelectedDate} />
                        </div>
                        <div className="flex-col w-full h-[80%] p-3">
                            {filteredClasses.length === 0 ? (
                                <div className="flex justify-center items-center w-full h-full m-auto rounded-3xl text-[#202022] text-5xl font-bold">No Classes today</div>
                            ) : (
                                filteredClasses.map((gymClass, index) => (
                                    <div key={index} className="flex w-full h-[25%] mb-8 rounded-4xl bg-white text-[#202022]">
                                        <div className="flex w-[15%] p-2 justify-center items-center">
                                            <p className="font-bold text-xl">{secondsToTime(gymClass.ClassTime)}</p>
                                        </div>
                                        <div className="flex h-[80%] border-1 border-[#000000] m-auto"></div>
                                        <div className="flex-col justify-center items-center p-5 w-[65%] ml-5 m-auto">
                                            <h2 className="text-3xl mb-2 font-bold">{gymClass.ClassName}</h2>
                                            <p className="text-[#736A6A] mb-2">Instructor: {gymClass.InstructorName}</p>
                                            <p className="text-[#736A6A] mb-2">
                                                Capacity : {gymClass.ReservedCount}/{gymClass.Capacity}
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

