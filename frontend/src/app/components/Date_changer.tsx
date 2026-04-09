"use client";

interface Props {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}

export default function Date_changer({
  selectedDate,
  setSelectedDate,
}: Props) {
  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const goToPreviousDay = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setSelectedDate(prevDate);
  };

  const goToNextDay = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setSelectedDate(nextDate);
  };

  return (
    <div className="p-3 w-fit">
      {/* Title */}
      <h2 className="text-4xl font-semibold text-black mb-8">Classes</h2>

      {/* Date + arrows */}
      <div className="flex items-center gap-20">
        <h1 className="text-5xl font-bold text-black min-w-[300px]">
          {formattedDate}
        </h1>

        <div className="flex items-center gap-10 shrink-0">
          <button
            onClick={goToPreviousDay}
            className="p-2 rounded-full cursor-pointer"
          >
            <img src="/trainer/chevronleft.png" alt="left" />
          </button>

          <button
            onClick={goToNextDay}
            className="p-2 rounded-full cursor-pointer"
          >
            <img src="/trainer/chevronright.png" alt="right" />
          </button>
        </div>
      </div>
    </div>
  );
}