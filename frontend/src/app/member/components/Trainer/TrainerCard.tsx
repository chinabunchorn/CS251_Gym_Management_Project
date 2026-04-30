"use client";

interface TrainerCardProps {
  firstName: string;
  lastName: string;
  specialty: string;
}

export function TrainerCard({ firstName, lastName, specialty }: TrainerCardProps) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm active:scale-95 transition cursor-pointer border border-gray-100 w-full max-w-md">
      
      <div className="w-14 h-14 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100 flex items-center justify-center">
        <img
          src={`https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=5F33E1&color=fff&rounded=true`}
          alt={`Instructor ${firstName}`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col">
        <span className="text-sm font-extrabold text-gray-900">
          Instructor {firstName} {lastName}
        </span>
        <span className="text-xs font-semibold text-gray-500 mt-0.5">
          {specialty} Instructor
        </span>
      </div>
    </div>
  );
}