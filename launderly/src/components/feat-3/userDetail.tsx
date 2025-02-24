import Image from "next/image";

interface UserProfileProps {
  avatar: string;
  fullName: string;
  email: string;
  isVerify: boolean;
}

const UserProfile = ({ avatar, fullName, email, isVerify }: UserProfileProps) => {
  return (
    <div className="flex items-center gap-3 w-full px-4">
      <Image src={avatar || "/user.png"} alt="Profile" width={32} height={32} className="rounded-full" />
      <div className="flex-1 truncate">
        {" "}
        <p className="text-sm font-medium text-gray-700 truncate">{fullName || "Guest"}</p>
        <p className="text-xs font-medium text-gray-500 truncate">{email || ""}</p>
        <p className="text-xs font-medium text-blue-600 capitalize">{isVerify ? "Verified User" : "User"}</p>
      </div>
    </div>
  );
};

export default UserProfile;
