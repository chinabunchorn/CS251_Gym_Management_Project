import { UpcomingClass } from "../../type";

export default function UpcomingClasses({
  classes,
}: {
  classes: UpcomingClass[];
}) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h2 className="text-lg font-extrabold text-gray-900 mb-4">
        Upcoming Classes
      </h2>

      {classes.length === 0 ? (
        <div className="bg-[#F8F9FC] rounded-xl p-6 text-center border border-gray-100">
          <span className="text-2xl block mb-2">😴</span>
          <p className="text-sm font-medium text-gray-500">
            No upcoming classes scheduled.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {classes.map((c) => (
            <div
              key={c.Schedule_ID || c.ClassName + c.ClassTime} 
              className="w-full bg-[#F8F9FC] border border-gray-100 p-4 rounded-xl flex justify-between items-center transition-transform hover:scale-[1.02]"
            >
              <h3 className="font-extrabold text-gray-900 truncate pr-4">
                {c.ClassName}
              </h3>
              
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[#5F33E1] text-xs">🕒</span>
                <p className="text-[#5F33E1] text-xs font-semibold whitespace-nowrap">
                  {c.ClassDate} • {c.ClassTime}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}