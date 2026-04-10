export default function CheckinStatus({
  checked,
}: {
  checked: boolean;
}) {
  return (
    <div className="bg-blue-100 text-center p-4 rounded-xl text-sm text-gray-700">
      {checked
        ? "You've checked in today!"
        : "You haven't checked in today"}
    </div>
  );
}