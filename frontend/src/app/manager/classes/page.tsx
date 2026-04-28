"use client";

import AuthGuard from "../../components/AuthGuard";
import Navbar from "../../components/manager_navbar";
import Date_changer from "../../components/Date_changer";
import Calendar from "../../components/Calendar";
import AddButton from "../../components/AddButton";

import { useEffect, useState } from "react";

interface GymClass {
    Schedule_ID: number;
    EmployeeID: number;
    Description: string;
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
}

export default function Trainer_classes() {
    const [classes, setClasses] = useState<GymClass[]>([]);
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // State สำหรับควบคุม Modal และ โหมด Edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingScheduleId, setEditingScheduleId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        className: "",
        instructor: "",
        capacity: "",
        description: "",
        date: "",
        time: ""
    });

    useEffect(() => {
        fetchClasses();
        fetchTrainers();
    }, []);

    const fetchClasses = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch classes");
            const data = await response.json();
            setClasses(data);
        } catch (error) {
            console.error("Error fetching classes:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrainers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trainers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setTrainers(Array.isArray(data) ? data : [data]);
            }
        } catch (error) {
            console.error("Error fetching trainers:", error);
        }
    };

    // ฟังก์ชันเปิด Modal สำหรับ "สร้างใหม่"
    const handleAddClassClick = () => {
        setEditingScheduleId(null); // เคลียร์ State Edit
        setFormData({ className: "", instructor: "", capacity: "", description: "", date: "", time: "" });
        setIsModalOpen(true);
    };

    // ฟังก์ชันเปิด Modal สำหรับ "แก้ไข"
    const handleEditClick = (gymClass: GymClass) => {
        setEditingScheduleId(gymClass.Schedule_ID); // จำว่ากำลังแก้ Schedule ไหน
        setFormData({
            className: gymClass.ClassName,
            instructor: gymClass.EmployeeID.toString(),
            capacity: gymClass.Capacity.toString(),
            description: gymClass.Description || "-",
            date: gymClass.ClassDate,
            time: secondsToInputTime(gymClass.ClassTime) // แปลงเวลากลับไปใส่ Input
        });
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (scheduleId: number) => {
        // ใช้ Confirm Dialog ดักไว้ก่อน เผื่อกดพลาด
        const isConfirmed = window.confirm("Are you sure you want to delete this schedule? This action cannot be undone.");

        if (!isConfirmed) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/manager/schedule/delete/${scheduleId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to delete schedule");
            }

            alert("Schedule deleted successfully!");
            setLoading(true);
            fetchClasses(); // ดึงข้อมูลใหม่เพื่อรีเฟรชหน้าจอ

        } catch (error) {
            console.error("Error deleting schedule:", error);
            alert(`Error: ${error instanceof Error ? error.message : "Something went wrong"}`);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingScheduleId(null);
        setFormData({ className: "", instructor: "", capacity: "", description: "", date: "", time: "" });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (!formData.className || !formData.date || !formData.time || !formData.capacity || !formData.instructor) {
                alert("Please fill in all required fields");
                return;
            }

            const token = localStorage.getItem("token");

            // เช็กโหมดว่ากำลัง Add หรือ Edit
            const isEditing = editingScheduleId !== null;
            const endpoint = isEditing
                ? `${process.env.NEXT_PUBLIC_API_URL}/manager/class/update`
                : `${process.env.NEXT_PUBLIC_API_URL}/class/create-full`;
            const method = isEditing ? "PUT" : "POST";

            const queryParams = new URLSearchParams({
                ...(isEditing && { schedule_id: editingScheduleId.toString() }), // ส่ง Schedule_ID ไปด้วยเฉพาะตอนแก้
                class_name: formData.className,
                description: formData.description || "-",
                capacity: formData.capacity.toString(),
                class_date: formData.date,
                class_time: formData.time,
                employee_id: formData.instructor
            });

            const response = await fetch(`${endpoint}?${queryParams.toString()}`, {
                method: method,
                headers: {
                    "Accept": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to process class");
            }

            alert(`Class ${isEditing ? "updated" : "created"} successfully!`);
            handleCloseModal();
            setLoading(true);
            fetchClasses();

        } catch (error) {
            console.error("Error processing class:", error);
            alert(`Error: ${error instanceof Error ? error.message : "Something went wrong"}`);
        }
    };

    // ตัวแปลงเวลาสำหรับแสดงผล (HH:MM AM/PM)
    function secondsToTime(seconds: string | number): string {
        const totalSeconds = Number(seconds);
        let hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const period = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        if (hours === 0) hours = 12;
        return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
    }

    // ตัวแปลงเวลาสำหรับ Input Type="time" (HH:mm 24H)
    function secondsToInputTime(seconds: string | number): string {
        const totalSeconds = Number(seconds);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }

    if (loading) {
        return <div className="h-screen flex justify-center items-center font-bold text-2xl">Loading...</div>;
    }

    // normalize helper
    const normalizeDate = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    // filter only selected day classes
    const filteredClasses = classes.filter((gymClass) => {
        const classDate = normalizeDate(new Date(gymClass.ClassDate));
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
            const classDate = normalizeDate(new Date(gymClass.ClassDate));

            return classDate >= startOfWeek && classDate <= endOfWeek;
        })
        .reduce((acc: Record<string, number>, gymClass) => {
            acc[gymClass.ClassName] = (acc[gymClass.ClassName] || 0) + 1;
            return acc;
        }, {});

    const cardColors = ["#FFEDD1", "#BFDBFE", "#E7F3FF", "#FED9EC", "#A7F3D0", "#DDD6FE", "#FED7AA"];

    const isEditingMode = editingScheduleId !== null;

    return (
        <AuthGuard>
            <div className="h-screen flex flex-col bg-[#f6f6f6] relative">
                <Navbar />

                <div className="flex h-full w-full">
                    <div className="flex-col w-[30%] h-[full] justify-center items-center bg-[#ffffff] p-5 border-2 border-r-[#939393]">
                        <div className="flex flex-col w-full h-[40%] justify-center items-center gap-4">
                            <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                            <AddButton text="Add class" onClick={handleAddClassClick} className="w-[80%]" />
                        </div>
                        <div className="flex-col w-full h-[60%] justify-center items-center p-3 mt-4">
                            <div className="flex w-full text-[#202022] font-bold text-3xl">Class this week</div>
                            <div className="flex flex-col w-[80%] p-6 gap-5 m-auto">
                                {Object.keys(weeklyClassCounts).length === 0 ? (
                                    <h3 className="flex justify-center items-center text-xl font-bold text-[#202022]">No classes this week</h3>
                                ) : (
                                    Object.entries(weeklyClassCounts).map(([className, count], index) => (
                                        <div key={index} className="flex h-[100px] rounded-3xl p-5 items-center justify-between" style={{ backgroundColor: cardColors[index % cardColors.length] }}>
                                            <h3 className="text-2xl font-bold text-[#202022]">{className}</h3>
                                            <p className="text-[#202022] text-lg font-bold mt-2 mr-5">{count}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex-col w-[70%] h-[full]">
                        <div className="flex w-full h-[20%] bg-[#ffffff] border-2 border-b-[#939393]">
                            <Date_changer selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                        </div>
                        <div className="flex-col w-full h-[80%] p-3 overflow-y-auto">
                            {filteredClasses.length === 0 ? (
                                <div className="flex justify-center items-center w-full h-full m-auto rounded-3xl text-[#202022] text-5xl font-bold">No Classes today</div>
                            ) : (
                                filteredClasses.map((gymClass, index) => (
                                    <div key={index} className="flex w-full h-[25%] mb-8 rounded-4xl bg-white text-[#202022] shadow-sm">
                                        <div className="flex w-[15%] p-2 justify-center items-center">
                                            <p className="font-bold text-xl">{secondsToTime(gymClass.ClassTime)}</p>
                                        </div>
                                        <div className="flex h-[80%] border-l-2 border-[#000000] m-auto"></div>
                                        <div className="flex-col justify-center items-center p-5 w-[65%] ml-5 m-auto">
                                            <h2 className="text-3xl mb-2 font-bold">{gymClass.ClassName}</h2>
                                            <p className="text-[#736A6A] mb-2">Instructor: {gymClass.InstructorName}</p>
                                            <p className="text-[#736A6A] mb-2">Capacity : {gymClass.ReservedCount}/{gymClass.Capacity}</p>
                                        </div>
                                        <div className="flex w-[20%] justify-center items-center gap-3">
                                            {/* ปุ่ม Edit */}
                                            <button
                                                onClick={() => handleEditClick(gymClass)}
                                                className="flex w-[60%] h-[40%] bg-[#5F33E1] justify-center items-center rounded-2xl text-[#ffffff] font-bold text-lg hover:bg-[#4d28b8] transition-colors cursor-pointer"
                                            >
                                                Edit
                                            </button>

                                            {/* ปุ่ม Delete*/}
                                            <button
                                                onClick={() => handleDeleteClick(gymClass.Schedule_ID)}
                                                className="flex w-[40px] h-[40px] bg-[#FFE0E0] justify-center items-center rounded-xl text-[#FF3B3B] hover:bg-[#FF3B3B] hover:text-white transition-colors cursor-pointer"
                                                title="Delete Schedule"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
                        <div className="bg-white rounded-3xl p-8 w-[800px] shadow-2xl relative flex flex-col gap-6">

                            <div className="flex justify-between items-center border-b pb-4">
                                <h2 className="text-3xl font-bold text-[#202022]">
                                    {isEditingMode ? "Edit Class Schedule" : "Add New Class"}
                                </h2>
                                <button onClick={handleCloseModal} className="text-gray-500 hover:text-black text-2xl font-bold transition-colors cursor-pointer">
                                    &#x2715;
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="font-bold text-lg text-[#202022]">Class Name</label>
                                        <input
                                            type="text"
                                            name="className"
                                            value={formData.className}
                                            onChange={handleChange}
                                            placeholder="Enter class name"
                                            disabled={isEditingMode}
                                            className={`border rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm ${isEditingMode ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'border-[#a584ff] text-[#8c8c8c]'}`}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="font-bold text-lg text-[#202022]">Instructor</label>
                                        <select
                                            name="instructor"
                                            value={formData.instructor}
                                            onChange={handleChange}
                                            className="border border-[#a584ff] rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c] appearance-none bg-white"
                                        >
                                            <option value="" disabled>Select an instructor</option>
                                            {trainers.map((t) => (
                                                <option key={t.EmployeeID} value={t.EmployeeID}>
                                                    {t.FirstName} {t.LastName} ({t.Specialty})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="font-bold text-lg text-[#202022]">Capacity</label>
                                        <select
                                            name="capacity"
                                            value={formData.capacity}
                                            onChange={handleChange}
                                            disabled={isEditingMode}
                                            className={`border rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm appearance-none ${isEditingMode ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white border-[#a584ff] text-[#8c8c8c]'}`}
                                        >
                                            <option value="" disabled>Class capacity</option>
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                            <option value="30">30</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 h-full">
                                    <label className="font-bold text-lg text-[#202022]">Class Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter class description"
                                        disabled={isEditingMode}
                                        className={`border rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#5F33E1] h-full resize-none text-sm ${isEditingMode ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'border-[#a584ff] text-[#8c8c8c]'}`}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 w-full mt-2">
                                <label className="font-bold text-lg text-[#202022]">Date and Time</label>
                                <div className="flex gap-4">
                                    <div className="w-1/2 relative">
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            className="w-full border border-[#a584ff] rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c]"
                                        />
                                    </div>
                                    <div className="w-1/2 relative">
                                        <input
                                            type="time"
                                            name="time"
                                            value={formData.time}
                                            onChange={handleChange}
                                            className="w-full border border-[#a584ff] rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button onClick={handleCloseModal} className="border border-gray-300 text-black font-semibold rounded-xl px-8 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
                                    Cancel
                                </button>
                                <button onClick={handleSubmit} className="bg-[#5F33E1] text-white font-semibold rounded-xl px-12 py-2.5 hover:bg-[#4d28b8] transition-colors cursor-pointer">
                                    {isEditingMode ? "Save" : "Add"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthGuard>
    );
}