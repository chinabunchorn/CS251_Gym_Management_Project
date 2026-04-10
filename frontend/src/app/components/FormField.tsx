"use client";

interface Props {
  label: string;
  children: React.ReactNode;
}

export default function FormField({ label, children }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-medium font-medium text-[#202022]">
        {label}
      </label>
      {children}
    </div>
  );
}