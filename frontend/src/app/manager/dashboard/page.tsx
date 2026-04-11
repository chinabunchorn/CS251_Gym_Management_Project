"use client";

import AuthGuard from "../../components/AuthGuard";
import Navbar from "../../components/manager_navbar";
import Calendar from "../../components/Calendar";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Stats {
    total_members: number;
    active_trainers: number;
}

interface GymClass {
    Schedule_ID: number;
    ClassName: string;
    InstructorName: string;
    ClassDate: string;
    ClassTime: number;
    Capacity: number;
    ReservedCount: number;
}

interface Trainer {
    EmployeeID: number;
    FirstName: string;
    LastName: string;
    Specialty: string;
    STATUS: string;
}

export default function Manager_dashboard() {
    const [stats, setStats] = useState<Stats>({ total_members: 0, active_trainers: 0 });
    const [classes, setClasses] = useState<GymClass[]>([]);
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [managerName, setManagerName] = useState("Manager");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const parts = token.split(".");
                if (parts.length === 3) {
                    const payload = JSON.parse(atob(parts[1]));
                    if (payload.sub) setManagerName(payload.sub);
                }
            } catch (_) { }
        }
        fetchAll();
    }, []);

    const fetchAll = async () => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const [statsRes, classesRes, trainersRes] = await Promise.all([
                fetch("http://127.0.0.1:8000/dashboard/stats", { headers }),
                fetch("http://127.0.0.1:8000/classes", { headers }),
                fetch("http://127.0.0.1:8000/trainers", { headers }),
            ]);
            if (statsRes.ok) setStats(await statsRes.json());
            if (classesRes.ok) {
                const data = await classesRes.json();
                setClasses(Array.isArray(data) ? data : []);
            }
            if (trainersRes.ok) {
                const data = await trainersRes.json();
                setTrainers(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Dashboard fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    function secondsToTime(seconds: number): string {
        let h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const period = h >= 12 ? "PM" : "AM";
        h = h % 12 || 12;
        return `${h}:${m.toString().padStart(2, "0")} ${period}`;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingClass = [...classes]
        .filter(c => {
            const d = new Date(c.ClassDate);
            d.setHours(0, 0, 0, 0);
            return d >= today;
        })
        .sort((a, b) => {
            const da = new Date(a.ClassDate).getTime();
            const db = new Date(b.ClassDate).getTime();
            return da !== db ? da - db : a.ClassTime - b.ClassTime;
        })[0];

    const activeTrainers = trainers.filter(t => t.STATUS === "Active");

    if (loading) {
        return (
            <div className="h-screen flex justify-center items-center font-bold text-2xl text-[#202022]">
                Loading...
            </div>
        );
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-[#f6f6f6] flex flex-col">
                <Navbar />

                <main className="flex-1 px-10 py-8">

                    {/* Welcome Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <p className="text-[#736A6A] text-sm">Welcome Back!</p>
                            <h1 className="text-3xl font-bold text-[#202022]">{managerName}</h1>
                        </div>
                        <div className="flex gap-4">
                            <Link
                                href="/manager/members"
                                className="flex items-center gap-3 bg-[#EDE8FF] text-[#5F33E1] px-6 py-3 rounded-2xl font-bold text-base hover:bg-[#ddd5ff] transition-colors shadow-sm"
                            >
                                <img src="/members.png" className="w-7 h-7 object-contain" alt="Add Member" />
                                Add Member
                            </Link>
                            <Link
                                href="/manager/promotions"
                                className="flex items-center gap-3 bg-[#EDE8FF] text-[#5F33E1] px-6 py-3 rounded-2xl font-bold text-base hover:bg-[#ddd5ff] transition-colors shadow-sm"
                            >
                                <img src="/icons/Discount.svg" className="w-7 h-7 object-contain" alt="Add Promotion" />
                                Add Promotion
                            </Link>
                            <Link
                                href="/manager/equipments"
                                className="flex items-center gap-3 bg-[#EDE8FF] text-[#5F33E1] px-6 py-3 rounded-2xl font-bold text-base hover:bg-[#ddd5ff] transition-colors shadow-sm"
                            >
                                <img src="/trainer/equipment.png" className="w-7 h-7 object-contain" alt="Add Equipment" />
                                Add Equipment
                            </Link>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex gap-6">

                        {/* ── Left Column ── */}
                        <div className="flex flex-col gap-5 w-85 shrink-0">

                            {/* Upcoming Event + Create Class */}
                            <div className="flex gap-4 items-center">

                                {/* Upcoming Event Card */}
                                <div className="flex-1 bg-[#5F33E1] rounded-3xl p-5 text-white relative overflow-hidden min-h-40">
                                    {/* Decorative blobs */}
                                    <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
                                    <div className="absolute -bottom-10 -left-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />

                                    <p className="text-[10px] text-purple-200 font-semibold uppercase tracking-widest mb-3">
                                        Upcoming Event
                                    </p>

                                    {upcomingClass ? (
                                        <>
                                            <div className="flex items-baseline gap-1 mb-1">
                                                <span className="text-5xl font-bold leading-none">
                                                    {new Date(upcomingClass.ClassDate).getDate()}
                                                </span>
                                                <span className="text-base font-semibold text-purple-200 ml-1">
                                                    {new Date(upcomingClass.ClassDate).toLocaleString("en-US", { month: "short" })}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold mt-2 mb-3">
                                                {upcomingClass.ClassName}
                                            </h3>
                                            <div className="flex items-center gap-2 text-purple-200 text-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="12 6 12 12 16 14" />
                                                </svg>
                                                <span>{secondsToTime(upcomingClass.ClassTime)}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-purple-200 text-sm mt-2">
                                            No upcoming classes scheduled.
                                        </p>
                                    )}
                                </div>

                                {/* Create Class */}
                                <Link
                                    href="/manager/classes"
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#896CFE] flex items-center justify-center text-[#896CFE] group-hover:bg-[#5F33E1] group-hover:border-solid group-hover:border-[#5F33E1] group-hover:text-white transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <line x1="12" y1="5" x2="12" y2="19" />
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                    </div>
                                    <span className="text-[11px] text-[#736A6A] font-medium text-center leading-tight">
                                        Create<br />Class
                                    </span>
                                </Link>
                            </div>

                            {/* Calendar */}
                            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                                <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                            </div>
                        </div>

                        {/* ── Right Column ── */}
                        <div className="flex flex-col gap-5 flex-1">

                            {/* Stat Cards */}
                            <div className="flex gap-5">

                                {/* All Members */}
                                <div className="flex-1 bg-[#FFF5E0] rounded-3xl p-7 flex items-center gap-6">
                                    <div className="w-18 h-18 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0 p-3">
                                        <img src="/members.png" className="w-full h-full object-contain" alt="All Members" />
                                    </div>
                                    <div>
                                        <p className="text-[#736A6A] text-base font-medium">All Members</p>
                                        <p className="text-6xl font-bold text-[#202022] leading-tight">{stats.total_members}</p>
                                    </div>
                                </div>

                                {/* All Active Trainers */}
                                <div className="flex-1 bg-[#FFF0F5] rounded-3xl p-7 flex items-center gap-6">
                                    <div className="w-18 h-18 rounded-2xl bg-pink-100 flex items-center justify-center shrink-0 p-3">
                                        <img src="/icons/Star.svg" className="w-full h-full object-contain" alt="All Active Trainers" />
                                    </div>
                                    <div>
                                        <p className="text-[#736A6A] text-base font-medium">All Active Trainers</p>
                                        <p className="text-6xl font-bold text-[#202022] leading-tight">{stats.active_trainers}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Trainers List */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm flex-1">
                                <div className="flex justify-between items-center mb-5">
                                    <h2 className="text-xl font-bold text-[#202022]">Trainers</h2>
                                    <Link
                                        href="/manager/trainers"
                                        className="text-[#5F33E1] text-sm font-semibold hover:text-[#4d28b8] transition-colors"
                                    >
                                        View All ›
                                    </Link>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {activeTrainers.length === 0 ? (
                                        <p className="text-[#736A6A] text-center py-8 text-sm">
                                            No active trainers found
                                        </p>
                                    ) : (
                                        activeTrainers.slice(0, 4).map(trainer => (
                                            <div
                                                key={trainer.EmployeeID}
                                                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[#f8f8f8] transition-colors"
                                            >
                                                <div className="w-12 h-12 rounded-full bg-[#EDE8FF] flex items-center justify-center shrink-0">
                                                    <span className="text-[#5F33E1] font-bold text-sm">
                                                        {trainer.FirstName.charAt(0)}{trainer.LastName.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-[#202022] text-sm">
                                                        Instructor {trainer.FirstName} {trainer.LastName}
                                                    </p>
                                                    <p className="text-[#736A6A] text-xs">
                                                        {trainer.Specialty} Instructor
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}