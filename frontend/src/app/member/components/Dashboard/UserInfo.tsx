/* eslint-disable @next/next/no-img-element */

import { Member } from "../../type";

export default function UserInfo({ member }: { member: Member | null }) {
  const fullName = member
    ? `${member.FirstName} ${member.LastName}`
    : "Guest";

  return (
    <div className="flex items-center gap-3">
      <img
        src="/member/Profile.jpg"
        alt="avatar"
        width={50}
        height={50}
        className="rounded-full"
      />

      <div>
        <p className="text-sm text-gray-500">Hello!</p>
        <p className="font-semibold text-gray-800">{fullName}</p>
      </div>
    </div>
  );
}