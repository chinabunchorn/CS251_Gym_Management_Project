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
        <div className="flex-1 bg-[#FFEDD1] p-3 rounded-xl text-sm text-center">
          <p className="font-bold text-black">Locker</p>
          <p className="text-xs text-[#736A6A]">
            {locker
              ? dayjs(locker.EndDate).format("DD MMM YYYY")
              : "No locker"}
          </p>
        </div>

        <div className="flex-1 bg-[#FFE4F2] p-3 rounded-xl text-sm text-center">
          <p className="font-bold text-black">Package</p>
          <p className="text-xs text-[#736A6A]">
            {pkg
              ? dayjs(pkg.Enddate).format("DD MMM YYYY")
              : "No package"}
          </p>
        </div>
      </div>
    </div>
  );
}