import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  MessageCircle,
  Clock,
  User
} from "lucide-react";

import logo from "@/assets/logo.png";
import { apiService } from "@/lib/api/api";

import { useAuth } from "@/hooks/useAuth";
import { loginWithGoogle, logout } from "@/lib/auth";
import UserAvatar from "@/components/home/UserAvatar";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Our Brand", to: "/brand" },
  { label: "Products", to: "/products" },
  { label: "Request Product", to: "/request-product" },
  { label: "Genie AI", to: "/genieai" },
  { label: "Stores", to: "/stores" },
  { label: "Franchise", to: "/franchise" }
];

import MobileNumberModal from "@/components/home/MobileNumberModal";




const PHONE_NUMBER = "+919944630450";
const WHATSAPP_NUMBER = "919944630450";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [showContactOptions, setShowContactOptions] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [storeStatus, setStoreStatus] = useState<any>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const [showMobileModal, setShowMobileModal] = useState(false);
const [tempUser, setTempUser] = useState<any>(null);

  const location = useLocation();
  const { user } = useAuth();

  // 🔥 FETCH STORE STATUS
  useEffect(() => {
    fetchStoreStatus();
      const user = localStorage.getItem("app_user");

  if (user) {
    fetchProfile(); // 🔥 refresh profile every load
  }
    const interval = setInterval(fetchStoreStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchStoreStatus = async () => {
    try {
      const res = await apiService.getStoreStatus();
      if (res.success) setStoreStatus(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleLogin = async () => {
  try {
    const firebaseUser = await loginWithGoogle();

    const res = await apiService.loginUser({
      name: firebaseUser.displayName,
      email: firebaseUser.email,
      image: firebaseUser.photoURL,
      provider: "google",
      providerId: firebaseUser.uid
    });

      // 🔥 IMPORTANT: use backend response
      if (res.success && res.data && !res.data.needsMobile) {
        await fetchProfile(); // 🔥 ALWAYS fetch latest profile
      }

      if (res.data?.needsMobile) {
        setTempUser(res.data.tempUser);
        setShowMobileModal(true);
        return;
      }

  } catch (err) {
    console.error(err);
  }
};

const fetchProfile = async () => {
  try {
    const res = await apiService.getMyProfile();

    if (res.success) {
      localStorage.setItem("app_user", JSON.stringify(res.data));
    } else {
      // 🔥 handle deactivated user
      localStorage.removeItem("app_user");
    }
  } catch (err) {
    logout();
    console.error("Profile fetch error:", err);
  }
};

  // 🔥 STATUS UI
  const getStatus = () => {
    if (loadingStatus)
      return { text: "Checking...", color: "text-yellow-500", bg: "bg-yellow-500/10" };

    if (storeStatus?.holidayMode)
      return { text: "Holiday", color: "text-red-500", bg: "bg-red-500/10" };

    if (storeStatus?.isOpen)
      return {
        text: "Open",
        color: "text-green-500",
        bg: "bg-green-500/10",
        message: `Till ${storeStatus.closingTime}`
      };

    return {
      text: "Closed",
      color: "text-red-500",
      bg: "bg-red-500/10",
      message: storeStatus?.message
    };
  };

  const status = getStatus();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} className="h-10" />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm ${
                  location.pathname === link.to
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT SECTION */}
          <div className="hidden md:flex items-center gap-3">

            {/* STORE STATUS */}
            <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${status.bg}`}>
              <span className={status.color}>{status.text}</span>
            </div>

            {/* CONTACT */}
            <div className="relative">
              <button
                onClick={() => setShowContactOptions(!showContactOptions)}
                className="flex items-center gap-1 text-sm hover:text-primary"
              >
                <Phone className="w-4 h-4" />
                99446 30450
              </button>

              <AnimatePresence>
                {showContactOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-2 bg-card border rounded-xl shadow-lg w-52"
                  >
                    <button
                      onClick={() => (window.location.href = `tel:${PHONE_NUMBER}`)}
                      className="w-full flex gap-3 px-4 py-3 hover:bg-muted"
                    >
                      <Phone className="w-4 h-4" /> Call
                    </button>

                    <button
                      onClick={() =>
                        window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank")
                      }
                      className="w-full flex gap-3 px-4 py-3 hover:bg-muted"
                    >
                      <MessageCircle className="w-4 h-4 text-green-500" />
                      WhatsApp
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 🔥 USER SECTION */}
            {!user ? (
                 <button
                      onClick={handleLogin}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
                    >
                      Login
                    </button>
            ) : (
              <div className="relative">
                <button onClick={() => setShowProfileMenu(!showProfileMenu)}>
                  <UserAvatar user={user} />
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 mt-2 w-56 bg-card border rounded-xl shadow-lg overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-semibold">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-muted"
                      >
                        Profile
                      </Link>

                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 hover:bg-muted text-red-500"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* MOBILE MENU */}
{/* MOBILE RIGHT ACTIONS */}
<div className="md:hidden flex items-center gap-2">
  
  {/* ✅ PROFILE BUTTON */}
  {user ? (
    <Link to="/profile">
      <UserAvatar user={user} />
    </Link>
  ) : (
    <button
      onClick={handleLogin}
      className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium"
    >
      Login
    </button>
  )}

  {/* MENU BUTTON */}
  <button
    onClick={() => setOpen(!open)}
    className="p-2"
  >
    {open ? <X /> : <Menu />}
  </button>

</div>
        </div>

        {/* MOBILE NAV */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="md:hidden border-t"
            >
              <nav className="flex flex-col p-4 gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ))}

                {!user ? (
                    <button
                      onClick={handleLogin}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
                    >
                      Login
                    </button>
                ) : (
                  <button
                    onClick={logout}
                    className="mt-3 px-4 py-2 text-red-500"
                  >
                    Logout
                  </button>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <MobileNumberModal
        open={showMobileModal}
        tempUser={tempUser}
        onClose={() => setShowMobileModal(false)}
        onSuccess={(user) => {
          console.log("User created:", user);

          // 🔥 SAVE LOCAL
          localStorage.setItem("app_user", JSON.stringify(user));

          // 🔥 refresh UI
          window.location.reload();
        }}
      />

      {/* BACKDROP */}
      {(showContactOptions || showProfileMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowContactOptions(false);
            setShowProfileMenu(false);
          }}
        />
      )}
    </>
  );
};

export default Header;