import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { motion } from "framer-motion";
import { logout } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

import Layout from "@/components/Layout";
const Profile = () => {
  const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();
    useEffect(() => {
        const stored = localStorage.getItem("app_user");
        if (stored) {
        setUser(JSON.parse(stored));
        }
    }, []);

        if (!user) {
            return (
            <div className="h-[70vh] flex items-center justify-center text-muted-foreground">
                Please login to view profile
            </div>
            );
        }

    const handleLogout = async () => {
        await logout();
        localStorage.removeItem("app_user");

        // ✅ Navigate to home without reload
        navigate("/");
    };

  return (
    <Layout>
    <div className="min-h-screen pt-24 pb-10 px-4">
      <div className="max-w-xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl p-6 shadow-xl border"
        >
          {/* 🔥 PROFILE HEADER */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={
                user.image ||
                `https://ui-avatars.com/api/?name=${user.name}&background=random`
              }
              className="w-16 h-16 rounded-full object-cover"
            />

            <div>
              <h2 className="text-xl font-bold">
                {user.name || "User"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>

          {/* 🔥 INFO SECTION */}
          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mobile</span>
              <span className="font-medium">{user.phone}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer ID</span>
              <span className="font-medium">{user.partyCode}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Loyalty Points</span>
              <span className="font-medium text-primary">
                {user.loyaltyPoints || 0} pts
              </span>
            </div>
          </div>

          {/* 🔥 QR CODE */}
          <div className="text-center mb-6">
            <p className="mb-2 font-medium">Profile ID</p>

            <div className="bg-white p-4 inline-block rounded-xl shadow">
              <QRCode value={user.phone || user.partyCode  } />
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              Scan at store to identify
            </p>
          </div>

          {/* 🔥 ACTIONS */}
          <div className="flex gap-3">
            <button className="flex-1 py-2 rounded-lg bg-muted text-sm">
              Edit Profile
            </button>

            <button
              onClick={handleLogout}
              className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm"
            >
              Logout
            </button>
          </div>
        </motion.div>
      </div>
    </div>
    </Layout>
  );
};

export default Profile;