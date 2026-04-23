import { motion } from "framer-motion";

const UserAvatar = ({ user }: any) => {
  if (user?.photoURL) {
    return (
      <img
        src={user.photoURL}
        className="w-9 h-9 rounded-full object-cover border"
      />
    );
  }

  const letter = user?.displayName?.[0]?.toUpperCase() || "U";

  return (
    <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
      {letter}
    </div>
  );
};

export default UserAvatar;