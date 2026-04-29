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
        if (!token) throw new Error("No token found");

        const res = await fetch("http://127.0.0.1:8000/trainers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch trainers");

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
    <div className="min-h-screen bg-white p-4">
      {/* Title */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <span className="text-2xl"></span>
        <h2 className="text-lg font-extrabold text-black">Meet our Trainers</h2>
      </div>

      {/* Loading & Error States */}
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Trainers List */}
      <div className="max-w-sm mx-auto mb-5 flex flex-col gap-4">
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