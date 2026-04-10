"uses client";
import { useRouter } from "next/navigation";
import ClassesIcon from "./icons/ClassesIcon";
import CalendarIcon from "./icons/CalendarIcon";
import LockerIcon from "./icons/LockerIcon";
import StarIcon from "./icons/StarIcon";

export default function Actions() {
    const router = useRouter();

    const actions = [
        {
      name: "Book Class",
      icon: CalendarIcon,
      color: "text-[#5F33E1]",
      path: "/member/classes",
    },
    {
      name: "My Locker",
      icon: LockerIcon,
      color: "text-[#5F33E1]",
      path: "/member/locker",
    },
    {
      name: "My Bookings",
      icon: ClassesIcon,
      color: "text-[#5F33E1]",
      path: "/member/bookings",
    },
    {
      name: "Trainers",
      icon: StarIcon,
      color: "text-[#5F33E1]",
      path: "/member/trainers",
    },
  ];
    return (
        <div className="grid grid-cols-2 gap-3">
      {actions.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.name}
            onClick={() => router.push(item.path)}
            className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm active:scale-95 transition"
          >
            {/* Icon container */}
            <div className={`p-2 rounded-xl ${item.color}`}>
              <Icon className="w-5 h-5" />
            </div>

            {/* Label */}
            <span className="text-sm font-medium text-gray-800">
              {item.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}