"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/trainer_navbar";
import AuthGuard from "../../components/AuthGuard";
import Link from "next/link";

export default function Trainer_dashboard() {
  const [trainer, setTrainer] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [client, setClient] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showAllClients, setShowAllClients] = useState(false);
  const [nearestClass, setNearestClass] = useState<any>(null);
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate(),
      month: date.toLocaleString("en-US", { month: "short" }),
    };
  };

  const formatTime = (timeStr: string) => {
    const date = new Date(`1970-01-01T${timeStr}`);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  //Nearest Class
  const getNearestClasses = (classes: any[]) => {
    const now = new Date();

    const future = classes.filter((c) => {
      const dt = new Date(`${c.class_date}T${c.class_time}`);
      return dt > now;
    });

    future.sort((a, b) => {
      const aDate = new Date(`${a.class_date}T${a.class_time}`);
      const bDate = new Date(`${b.class_date}T${b.class_time}`);
      return aDate.getTime() - bDate.getTime();
    });

    return future;
  };

  //Today Class Count
  const today = new Date().toISOString().split("T")[0];
  const todaysClasses = classes.filter(
    (c) => c.class_date === today
  );
  const todaysClassCount = todaysClasses.length;

  //Completed this week
  const W_today = new Date();
  const day = W_today.getDay();

  const startOfWeek = new Date(W_today);
  startOfWeek.setDate(W_today.getDate() - ((day + 6) % 7));

  const endOfWeek = new Date(W_today);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  const completedThisWeek = classes.filter(c => {
    const classDate = new Date(c.class_date);
    return classDate >= startOfWeek && classDate < W_today;
  });

  const completedCount = completedThisWeek.length;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        //Call 3 API
        const [trainerRes, classesRes, clientRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/trainer/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/trainer/classes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/trainer/clients`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        //Status code
        if (!trainerRes.ok || !classesRes.ok || !clientRes.ok) {
          if (
            trainerRes.status === 401 ||
            classesRes.status === 401 ||
            trainerRes.status === 403 ||
            classesRes.status === 403 ||
            clientRes.status === 401 ||
            clientRes.status === 403
          ) {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }
          throw new Error("Failed to fetch");
        }

        const trainerData = await trainerRes.json();
        const classesData = await classesRes.json();
        const clientData = await clientRes.json();

        setTrainer(trainerData);
        setClasses(classesData);
        setClient(clientData);

        const sorted = getNearestClasses(classesData);

        setNearestClass(sorted[0] || null);
        setUpcomingClasses(sorted.slice(0, 3));

      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (loading) return <div>Loading...</div>;
  return (
    <AuthGuard>
      <div className="h-screen flex flex-col bg-[#f6f6f6]">
        <Navbar />
        <div className="flex h-full w-full">
          <div className="flex-1 w-1/2 justify-center items-center">

            <div className="w-[90%] h-[20%] flex p-8 ml-auto items-center">
              <div className="h-30 w-30 rounded-full overflow-hidden">
                <img src="/trainer/profile.jpg" alt="profile" className="w-full h-full object-cover" />
              </div>
              <div className="flex-col ml-10">
                <h1 className="text-[#202022] text-xl">Hello!</h1>
                <h1 className="text-[#202022] text-3xl font-bold">{trainer?.first_name} {trainer?.last_name}</h1>
                <h1 className="text-[#202022] text-xl">{trainer?.Specialty} Instructor</h1>
              </div>
            </div>

            <div className="w-[90%] h-[25%] ml-auto items-center pl-8">
              <div className="h-[90%] w-[60%] flex-col bg-[#5F33E1] rounded-4xl p-5 justify-left items-center">
                <div className="flex gap-[25px] ml-10">
                  <img src="/trainer/white_schedule.png" alt="schedule" className="h-8" />
                  <h1 className="text-3xl font-bold">Upcoming Event</h1>
                  <Link href={"/trainer/schedule"}>
                    <img src="/trainer/arrow.png" alt="Schedule" className="h-9 ml-auto" />
                  </Link>
                </div>
                <div>
                  {nearestClass ? (
                    <div className="flex gap-[30px] ml-10">
                      <div className="bg-[#896CFE] h-27 w-27 mt-2 rounded-2xl flex flex-col justify-center items-center">
                        <h1 className="text-[#f6f6f6] text-2xl font-bold">
                          {formatDate(nearestClass.class_date).day}
                        </h1>
                        <h1 className="text-[#f6f6f6] text-2xl font-bold">
                          {formatDate(nearestClass.class_date).month}
                        </h1>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <div className="text-2xl font-semibold">
                          {nearestClass.class_name}
                        </div>
                        <div className="text-xl mt-2">
                          {formatTime(nearestClass.class_time)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[100px] w-full mt-2 justify-center items-center flex border-t-2 border-t-[#f6f6f6]">
                      <h1 className="text-[#f6f6f6] text-3xl font-bold">No Upcomming Class</h1>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-[90%] h-[55%] ml-auto pl-8">
              <div className="flex items-center justify-between">
                <h1 className="text-[#202022] text-3xl font-bold">All Upcomming Classes</h1>
                <Link href={"/trainer/classes"}>
                  <h1 className="text-[#5F33E1] text-xl font-bold">View all &gt;</h1>
                </Link>
              </div>
              <div className="upcoming-classes text-[#202022] h-[375px] overflow-y-auto w-[98%] mt-3 ml-auto">
                {upcomingClasses.length === 0 ? (
                  <div className="text-[#F579AD] h-full bg-[#ffffff] rounded-3xl font-bold text-2xl flex justify-center items-center">No upcoming classes</div>
                ) : (
                  upcomingClasses.map((cls, index) => (
                    <div key={index} className="class-card bg-[#ffffff] flex pl-10 p-2 rounded-lg mb-5 justify-between">
                      <div>
                        <p className="text-[#736A6A] pb-1">Instructor {trainer?.first_name}</p>
                        <h3 className="text-xl font-bold pb-1">{cls.class_name}</h3>
                        <p className="text-[#AB94FF] pb-1">
                          {formatDate(cls.class_date).day} {formatDate(cls.class_date).month} {formatTime(cls.class_time)}
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-10">
                        <div>
                          <p className="text-[#736A6A]">{cls.applied}/{cls.capacity}</p>
                        </div>
                        <div
                          className={`w-[100px] items-center flex justify-center px-4 py-2 rounded-lg ${cls.applied >= cls.capacity ? "bg-[#FFD6EB]" : "bg-[#EDE8FF]"
                            }`}
                        >
                          <h1
                            className={`font-bold ${cls.applied >= cls.capacity ? "text-[#F579AD]" : "text-[#5F33E1]"
                              }`}
                          >
                            {cls.applied >= cls.capacity ? "Full" : "Available"}
                          </h1>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>


          <div className="flex-1 w-1/2 justify-center items-center">
            <div className="w-[80%] h-[45%] m-auto justify-center items-center">
              <div className="w-full h-[50%] flex justify-center items-center gap-10 p-2">
                <div className="w-[35%] h-[85%] flex bg-[#FFEDD1] justify-center items-center p-5 rounded-4xl">
                  <h1 className="text-[#202022] font-bold text-2xl">You have a total of {client.length} clients</h1>
                </div>
                <div className="w-[35%] h-[85%] flex bg-[#FFE4F2] justify-center items-center p-5 rounded-4xl">
                  <h1 className="text-[#202022] font-bold text-2xl">You have {todaysClassCount} classes today</h1>
                </div>
              </div>
              <div className="w-full h-[50%] flex justify-center p-2">
                <div className="w-[75%] h-full flex bg-[#E7F3FF] justify-center items-center p-5 rounded-4xl">
                  <h1 className="text-[#202022] font-bold text-2xl">You've completed {completedCount} classes this week</h1>
                </div>
              </div>
            </div>

            <div className="w-[60%] h-[55%] m-auto justify-center items-center">
              <div className="flex items-center justify-between">
                <h1 className="text-[#202022] text-3xl font-bold">My Clients</h1>

                <div
                  onClick={() => setShowAllClients(true)}
                  className="text-[#5F33E1] text-xl font-bold cursor-pointer hover:underline"
                >
                  View all &gt;
                </div>
              </div>

              <div className="mt-3 p-4 max-h-[400px] overflow-y-auto">
                {client.length === 0 ? (
                  <div className="text-[#F579AD] h-[350px] bg-[#ffffff] rounded-3xl flex justify-center items-center font-bold text-2xl">No active clients</div>
                ) : (
                  client.slice(0, 3).map((client, idx) => (
                    <div key={idx} className="flex items-center mb-5 gap-4 p-4 bg-[#ffffff] w-full h-[100px] justify-between rounded-2xl">
                      <div className="flex gap-5 justify-center items-center">
                        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                          {client.FullName.charAt(0)}
                        </div>

                        <div className="flex flex-col">
                          <span className="font-bold text-[#202022] text-2xl">{client.FullName}</span>
                          <span className="text-[#202022]">{client.Age} yrs</span>
                        </div>
                      </div>

                      <div
                        onClick={() => setSelectedClient(client)}
                        className="w-[110px] h-[40px] flex items-center justify-center rounded-lg bg-[#EDE8FF] text-[#5F33E1] font-semibold cursor-pointer hover:bg-[#DED6FF] transition"
                      >
                        View info
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
      {selectedClient && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-[60]">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl text-[#202022]">

            <h2 className="text-2xl font-bold mb-4 text-[#202022]">
              {selectedClient.FullName}
            </h2>

            <div className="space-y-2 text-lg text-[#202022]">
              <p><strong>Age:</strong> {selectedClient.Age}</p>
              <p><strong>Medical Record:</strong> {selectedClient.MedRec}</p>
              <p><strong>Weight:</strong> {selectedClient.Weight} kg</p>
              <p><strong>Height:</strong> {selectedClient.Height} cm</p>
            </div>

            <button
              onClick={() => setSelectedClient(null)}
              className="mt-5 bg-[#5F33E1] text-white px-4 py-2 rounded-lg w-full hover:bg-[#4a28b5]"
            >
              Close
            </button>

          </div>
        </div>
      )}
      {showAllClients && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50">

          <div className="bg-white rounded-2xl p-6 w-[600px] max-h-[600px] shadow-xl overflow-y-auto">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#202022]">
                All Clients
              </h2>

              <button
                onClick={() => setShowAllClients(false)}
                className="text-[#5F33E1] font-semibold cursor-pointer hover:text-[#4a28b5] hover:underline transition"
              >
                Close
              </button>
            </div>


            {client.length === 0 ? (

              <div className="text-center text-xl text-gray-400">
                No active clients
              </div>

            ) : (

              client.map((c, index) => (

                <div
                  key={index}
                  className="flex items-center justify-between mb-4 p-4 bg-[#f6f6f6] rounded-xl"
                >

                  <div className="flex gap-4 items-center">

                    <div className="w-10 h-10 rounded-full bg-purple-500 flex justify-center items-center text-white font-bold">
                      {c.FullName.charAt(0)}
                    </div>


                    <div>
                      <div className="font-bold text-lg text-[#202022]">
                        {c.FullName}
                      </div>

                      <div className="text-gray-500">
                        {c.Age} yrs
                      </div>
                    </div>

                  </div>


                  <div
                    onClick={() => setSelectedClient(c)}
                    className="w-[110px] h-[40px] flex items-center justify-center rounded-lg bg-[#EDE8FF] text-[#5F33E1] font-semibold cursor-pointer hover:bg-[#DED6FF]"
                  >
                    View info
                  </div>

                </div>

              ))

            )}

          </div>

        </div>
      )}
    </AuthGuard>
  );
}