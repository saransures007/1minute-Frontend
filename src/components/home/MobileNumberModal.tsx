import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { apiService } from "@/lib/api/api";

const MobileNumberModal = ({ open, tempUser, onClose, onSuccess }: any) => {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(true);

  const isValidIndianNumber = (num: string) => {
    return /^[6-9]\d{9}$/.test(num);
  };

  const handleSubmit = async () => {
    if (!isValidIndianNumber(mobile)) {
      alert("Enter valid WhatsApp number");
      return;
    }

    setLoading(true);

    try {
      const res = await apiService.loginUser({
        ...tempUser,
        mobile,
        whatsappOptIn: consent // optional for backend
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
            {/* 🔥 HEADER */}
            <h2 className="text-xl font-bold mb-1">
              📱 WhatsApp Number
            </h2>

            <p className="text-sm text-muted-foreground mb-4">
              Get order updates, offers & new product alerts on WhatsApp
            </p>

            {/* 🔥 INPUT */}
            <div className="relative mb-3">
              <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">
                +91
              </span>
              <input
                type="tel"
                placeholder="Enter WhatsApp number"
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                className="w-full pl-12 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* 🔥 CONSENT */}
            <label className="flex items-start gap-2 text-xs text-muted-foreground mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={() => setConsent(!consent)}
                className="mt-0.5"
              />
              <span>
                I agree to receive updates on WhatsApp (no spam)
              </span>
            </label>

            {/* 🔥 BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
            >
              {loading ? "Saving..." : "Continue"}
            </button>

            {/* 🔥 TRUST TEXT */}
            <p className="text-[11px] text-center text-muted-foreground mt-3">
              We respect your privacy. No spam.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileNumberModal;