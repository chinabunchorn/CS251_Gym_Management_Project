"use client";

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

export default function Card({
  children,
  onClick,
  selected = false,
  className = "",
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        w-full bg-white rounded-xl shadow p-4 cursor-pointer transition
        hover:shadow-md
        ${selected ? "border-2 border-[#896CFE]" : "border border-gray-200"}
        ${className}
      `}
    >
      {children}
    </div>
  );
}