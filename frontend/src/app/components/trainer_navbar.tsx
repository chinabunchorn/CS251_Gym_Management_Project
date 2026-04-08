"use client";

export default function Navbar() {
  return (
    <div className="w-full bg-[#EDE8FF] flex items-center justify-between px-8 py-4 text-[#1A1A1B]">
      
      {/* Left Logo */}
      <div className="flex items-center gap-2">
        <img src="/trainer/logo.png" className="h-8" />
      </div>

      {/* Center Menu */}
      <div className="flex items-center gap-30 text-gray-800 font-medium">
        
        <div className="flex items-center gap-2 cursor-pointer hover:text-[#896CFE]">
          <img src="/trainer/home.png" className="h-8" />
          <span>HOME</span>
        </div>

        <div className="flex items-center gap-2 cursor-pointer hover:text-[#896CFE]">
          <img src="/trainer/classes.png" className="h-8" />
          <span>CLASSES</span>
        </div>

        <div className="flex items-center gap-2 cursor-pointer hover:text-[#896CFE]">
          <img src="/trainer/schedule.png" className="h-8" />
          <span>SCHEDULE</span>
        </div>

        <div className="flex items-center gap-2 cursor-pointer hover:text-[#896CFE]">
          <img src="trainer/equipment.png" className="h-8" />
          <span>EQUIPMENT</span>
        </div>

      </div>

      {/* Right Profile */}
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <img
          src="/trainer/profile.jpg"
          alt="Latte"
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  );
}