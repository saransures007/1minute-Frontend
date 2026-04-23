import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { apiService } from "@/lib/api/api";

const MobileNumberModal = ({ open, tempUser, onClose, onSuccess }: any) => {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!mobile || mobile.length < 10) {
      alert("Enter valid mobile number");
      return;
    }

    setLoading(true);

    try {
      const res = await apiService.loginUser({
        ...tempUser,
        mobile
      });

      if (res.success && res.data) {
        onSuccess(res.data);
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 40 }}
            className="bg-card rounded-2xl p-6 w-[90%] max-w-sm shadow-xl border"
          >
            <h2 className="text-xl font-bold mb-2">
              Complete your profile
            </h2>

            <p className="text-sm text-muted-foreground mb-4">
              We need your mobile number for billing & rewards
            </p>

            <input
              type="tel"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg font-medium"
            >
              {loading ? "Saving..." : "Continue"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileNumberModal;