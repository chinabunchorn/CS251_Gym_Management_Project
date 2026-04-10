import dayjs from "dayjs";
import { Locker, Package } from "../../type";

export default function ExpiryCards({
  locker,
  pkg,
}: {
  locker: Locker;
  pkg: Package | null;
}) {
  return (
    <div>
      <h2 className="font-semibold text-gray-700">
        Expiry Dates
      </h2>

      <div className="flex gap-2 mt-2">
        <div className="flex-1 bg-yellow-100 p-3 rounded-xl text-sm">
          <p className="font-medium">Locker</p>
          <p className="text-xs">
            {locker
              ? dayjs(locker.EndDate).format("DD MMM YYYY")
              : "No locker"}
          </p>
        </div>

        <div className="flex-1 bg-pink-100 p-3 rounded-xl text-sm">
          <p className="font-medium">Package</p>
          <p className="text-xs">
            {pkg
              ? dayjs(pkg.Enddate).format("DD MMM YYYY")
              : "No package"}
          </p>
        </div>
      </div>
    </div>
  );
}