"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrainerCard } from "../components/Trainer/TrainerCard";

interface Trainer {
  EmployeeID: number;
  FirstName: string;
  LastName: string;
  Specialty: string;
}

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        const res = await fetch("http://127.0.0.1:8000/trainers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch: ${errorText || res.status}`);
        }

        const data = await res.json();
        setTrainers(data);
      } catch (error: any) {
        console.error("Error fetching trainers:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 flex flex-col items-center">
      
      {/* Title Section คุมโทน */}
      <div className="w-full max-w-md mt-6 mb-8 flex flex-col items-center">
        <h2 className="text-2xl font-extrabold text-gray-900">Meet our Trainers</h2>
        <div className="border-t-2 border-gray-900 w-16 mt-3"></div>
      </div>

      {/* Loading & Error States */}
      {loading && <p className="text-gray-500 font-medium text-sm">Loading trainers...</p>}
      {error && (
        <div className="w-full max-w-md bg-red-50 text-red-500 p-3 rounded-xl border border-red-200 text-sm text-center">
          {error}
        </div>
      )}

      <div className="w-full max-w-md flex flex-col gap-4">
        {!loading &&
          !error &&
          trainers.map((trainer) => (
            <TrainerCard
              key={trainer.EmployeeID}
              firstName={trainer.FirstName}
              lastName={trainer.LastName}
              specialty={trainer.Specialty}
            />
          ))}
      </div>
    </div>
  );
}