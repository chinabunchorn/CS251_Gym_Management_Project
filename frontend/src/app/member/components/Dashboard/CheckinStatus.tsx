export default function CheckinStatus({
  checked,
}: {
  checked: boolean;
}) {
  return (
    <div className="bg-[#E7F3FF] text-center p-4 rounded-xl text-sm text-gray-700">
      {checked
        ? "You've checked in today!"
        : "You haven't checked in today"}
    </div>
  );
}