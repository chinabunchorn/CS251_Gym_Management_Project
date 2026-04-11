import dayjs from "dayjs";
import { Package } from "../../type";

export default function MembershipCard({ pkg }: { pkg: Package | null }) {
  const endDate = pkg?.Enddate
    ? dayjs(pkg.Enddate).format("DD MMM YYYY")
    : null;

  return (
    <div className="bg-linear-to-r from-purple-600 to-indigo-500 text-white p-4 rounded-2xl shadow-md">
      <p className="text-sm">{pkg?.packName ?? "No Membership"}</p>

      {endDate && (
        <p className="text-xs opacity-80 mt-1">
          Next payment on {dayjs(pkg!.Enddate).format("DD MMMM, YYYY")}
        </p>
      )}

      <div className="mt-3 text-sm">
        <p>
          {pkg
            ? `${pkg.PackPrice}/month • Recurring`
            : "No active plan"}
        </p>

        {endDate && (
          <p className="text-xs opacity-80">
            Till {endDate}
          </p>
        )}
      </div>
    </div>
  );
}