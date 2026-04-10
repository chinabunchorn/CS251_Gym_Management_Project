import { UpcomingClass } from "../../type";

export default function UpcomingClasses({
  classes,
}: {
  classes: UpcomingClass[];
}) {
  return (
    <div>
      <h2 className="font-semibold text-gray-700">
        Upcoming Classes
      </h2>

      <div className="flex gap-2 mt-2">
        {classes.length === 0 ? (
          <p className="text-sm text-gray-500">
            No upcoming classes
          </p>
        ) : (
          classes.map((c, i) => (
            <div
              key={i}
              className="flex-1 bg-gray-100 p-3 rounded-xl text-sm"
            >
              <p className="font-medium">{c.ClassName}</p>
              <p className="text-purple-600 text-xs">
                {c.ClassDate} {c.ClassTime}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}