"use client";

import AuthGuard from "../../components/AuthGuard";
import Navbar from "../../components/manager_navbar";
import Date_changer from "../../components/Date_changer";
import Calendar from "../../components/Calendar";
import AddButton from "../../components/AddButton";

import { useEffect, useState } from "react";

interface GymClass {
    ClassName: string;
    InstructorName: string;
    ClassDate: string;
    ClassTime: number;
    Capacity: number;
    ReservedCount: number;
}

// เพิ่ม Interface สำหรับ Trainer
interface Trainer {
    EmployeeID: number;
    FirstName: string;
    LastName: string;
    Specialty: string;
}

export default function Trainer_classes() {
    // 🔴 1. กฎเหล็กของ React: useState ทุกตัวต้องอยู่บนสุด! ห้ามมี return คั่นก่อนหน้า!
    const [classes, setClasses] = useState<GymClass[]>([]);
    const [trainers, setTrainers] = useState<Trainer[]>([]); // ย้ายขึ้นมาตรงนี้
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        className: "",
        instructor: "", // ค่านี้จะเก็บ EmployeeID ของ Trainer
        capacity: "",
        description: "",
        date: "",
        time: ""
    });

    // 🔴 2. useEffect ก็ต้องอยู่ก่อน return เช่นกัน
    useEffect(() => {
        // ดึงทั้ง Class และ Trainer มารอไว้เลยตอนเข้าหน้าเว็บ
        fetchClasses();
        fetchTrainers();
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

            if (!response.ok) throw new Error("Failed to fetch classes");
            const data = await response.json();
            setClasses(data);
        } catch (error) {
            console.error("Error fetching classes:", error);
        } finally {
            // เมื่อดึงข้อมูลเสร็จ ค่อยปิด loading
            setLoading(false); 
        }
    };

    const fetchTrainers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://127.0.0.1:8000/trainers", {
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

    const handleSubmit = async () => {
        try {
            // เช็ก Validation
            if (!formData.className || !formData.date || !formData.time || !formData.capacity || !formData.instructor) {
                alert("Please fill in all required fields");
                return;
            }

            const token = localStorage.getItem("token");

            const queryParams = new URLSearchParams({
                class_name: formData.className,
                description: formData.description || "-", 
                capacity: formData.capacity.toString(),
                class_date: formData.date,
                class_time: formData.time,
                employee_id: formData.instructor
            });

            const response = await fetch(`http://127.0.0.1:8000/class/create-full?${queryParams.toString()}`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to create class");
            }

            alert("Class created successfully!");
            handleCloseModal();
            setLoading(true); // เปิด loading อีกรอบตอนดึงข้อมูลใหม่
            fetchClasses(); // ดึงข้อมูลอัปเดต

        } catch (error) {
            console.error("Error creating class:", error);
            alert(`Error: ${error instanceof Error ? error.message : "Something went wrong"}`);
        }
    };

    function secondsToTime(seconds: string | number): string {
        const totalSeconds = Number(seconds);
        let hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const period = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        if (hours === 0) hours = 12;
        return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
    }

    // 🔴 3. Early Return ต้องอยู่ *ล่างสุด* ของบรรดา Hook ทั้งหมด
    if (loading) {
        return <div className="h-screen flex justify-center items-center font-bold text-2xl">Loading...</div>;
    }

    const filteredClasses = classes.filter((gymClass) => {
        const classDate = new Date(gymClass.ClassDate);
        return classDate.toDateString() === selectedDate.toDateString();
    });

    const startOfWeek = new Date(selectedDate);
    const day = selectedDate.getDay() || 7;
    startOfWeek.setDate(selectedDate.getDate() - day + 1);
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

    const cardColors = ["#FFEDD1", "#BFDBFE", "#E7F3FF", "#FED9EC", "#A7F3D0", "#DDD6FE", "#FED7AA"];

    const handleAddClassClick = () => setIsModalOpen(true);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ className: "", instructor: "", capacity: "", description: "", date: "", time: "" });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

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
                                        <div className="flex w-[20%] justify-center items-center">
                                            <button className="flex w-[70%] h-[40%] bg-[#5F33E1] justify-center items-center rounded-2xl text-[#ffffff] font-bold text-lg hover:bg-[#4d28b8] transition-colors cursor-pointer">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* --- Modal Add New Class --- */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
                        <div className="bg-white rounded-3xl p-8 w-[800px] shadow-2xl relative flex flex-col gap-6">
                            
                            <div className="flex justify-between items-center border-b pb-4">
                                <h2 className="text-3xl font-bold text-[#202022]">Add New Class</h2>
                                <button onClick={handleCloseModal} className="text-gray-500 hover:text-black text-2xl font-bold transition-colors cursor-pointer">
                                    &#x2715;
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="font-bold text-lg text-[#202022]">Class Name</label>
                                        <input type="text" name="className" value={formData.className} onChange={handleChange} placeholder="Enter class name" className="border border-[#a584ff] rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c]"/>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2">
                                        <label className="font-bold text-lg text-[#202022]">Instructor</label>
                                        <select name="instructor" value={formData.instructor} onChange={handleChange} className="border border-[#a584ff] rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c] appearance-none bg-white">
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
                                        <select name="capacity" value={formData.capacity} onChange={handleChange} className="border border-[#a584ff] rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c] appearance-none bg-white">
                                            <option value="" disabled>Class capacity</option>
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                            <option value="30">30</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 h-full">
                                    <label className="font-bold text-lg text-[#202022]">Class Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Enter class description" className="border border-[#a584ff] rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#5F33E1] h-full resize-none text-sm text-[#8c8c8c]"></textarea>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 w-full mt-2">
                                <label className="font-bold text-lg text-[#202022]">Date and Time</label>
                                <div className="flex gap-4">
                                    <div className="w-1/2 relative">
                                        <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border border-[#a584ff] rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c]"/>
                                    </div>
                                    <div className="w-1/2 relative">
                                        <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full border border-[#a584ff] rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#5F33E1] text-sm text-[#8c8c8c]"/>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button onClick={handleCloseModal} className="border border-gray-300 text-black font-semibold rounded-xl px-8 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
                                    Cancel
                                </button>
                                <button onClick={handleSubmit} className="bg-[#5F33E1] text-white font-semibold rounded-xl px-12 py-2.5 hover:bg-[#4d28b8] transition-colors cursor-pointer">
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthGuard>
    );
}