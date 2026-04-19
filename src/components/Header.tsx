import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MapPin, Phone, ShoppingBag, MessageCircle, Clock, AlertCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import { apiService } from "@/lib/api/api";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Our Brand", to: "/brand" },
  { label: "Products", to: "/products" },
  { label: "Request Product", to: "/request-product" },
  { label: "Genie AI", to: "/genieai" },
  { label: "Stores", to: "/stores" },
  { label: "Franchise", to: "/franchise" },

];

// Phone number for contact
const PHONE_NUMBER = "+919944630450";
const WHATSAPP_NUMBER = "919944630450"; // Without + for WhatsApp API

const Header = () => {
  const [open, setOpen] = useState(false);
  const [showContactOptions, setShowContactOptions] = useState(false);
  const [storeStatus, setStoreStatus] = useState<{
    isOpen: boolean;
    openingTime: string;
    closingTime: string;
    holidayMode: boolean;
    message: string;
    lastStatusChange: string;
  } | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const location = useLocation();

  // Fetch store status on mount
  useEffect(() => {
    fetchStoreStatus();
    // Refresh status every 5 minutes
    const interval = setInterval(fetchStoreStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchStoreStatus = async () => {
    try {
      const response = await apiService.getStoreStatus();
      if (response.success && response.data) {
        setStoreStatus(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch store status:", error);
    } finally {
      setLoadingStatus(false);
    }
  };

  // Handle phone click - show options
  const handlePhoneClick = () => {
    setShowContactOptions(true);
  };

  // Handle call action
  const handleCall = () => {
    window.location.href = `tel:${PHONE_NUMBER}`;
    setShowContactOptions(false);
  };

  // Handle WhatsApp chat
  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi! I'm interested in your products. Can you help me?");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    setShowContactOptions(false);
  };

  // Get status display
  const getStatusDisplay = () => {
    if (loadingStatus) {
      return { text: "Checking...", color: "text-yellow-500", bg: "bg-yellow-500/10", pulse: false };
    }
    
    if (storeStatus?.holidayMode) {
      return { text: "Holiday", color: "text-red-500", bg: "bg-red-500/10", pulse: false };
    }
    
    if (storeStatus?.isOpen) {
      return { 
        text: "Open Now", 
        color: "text-green-500", 
        bg: "bg-green-500/10", 
        pulse: true,
        message: `Open until ${storeStatus.closingTime}`
      };
    }
    
    return { 
      text: "Closed", 
      color: "text-red-500", 
      bg: "bg-red-500/10", 
      pulse: false,
      message: storeStatus?.message || `Opens at ${storeStatus?.openingTime || "09:00"}`
    };
  };

  const status = getStatusDisplay();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="1 Minute" className="h-10 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {/* Store Status Indicator */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${status.bg} text-xs font-semibold group relative`}>
              <Clock className={`w-3.5 h-3.5 ${status.color}`} />
              <span className={status.color}>{status.text}</span>
              {!loadingStatus && status.message && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {status.message}
                </div>
              )}
            </div>

            {/* Contact Button with Dropdown */}
            <div className="relative">
              <button
                onClick={handlePhoneClick}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>99446 30450</span>
              </button>

              {/* Contact Options Dropdown */}
              <AnimatePresence>
                {showContactOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 bg-card border rounded-lg shadow-lg overflow-hidden z-50 min-w-[200px]"
                  >
                    <button
                      onClick={handleCall}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors"
                    >
                      <Phone className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Call Us</p>
                        <p className="text-xs text-muted-foreground">Call our customer support</p>
                      </div>
                    </button>
                    <button
                      onClick={handleWhatsApp}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors border-t"
                    >
                      <MessageCircle className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">WhatsApp Chat</p>
                        <p className="text-xs text-muted-foreground">Chat with us on WhatsApp</p>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-muted">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-border/50 glass"
            >
              <nav className="flex flex-col p-4 gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === link.to
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {/* Mobile Store Status */}
                <div className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm ${status.bg} mt-2`}>
                  <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${status.color}`} />
                    <span className={status.color}>Store {status.text}</span>
                  </div>
                  {status.message && (
                    <span className="text-xs text-muted-foreground">{status.message}</span>
                  )}
                </div>

                {/* Mobile Contact Options */}
                <div className="border-t pt-2 mt-2">
                  <button
                    onClick={handleCall}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-primary font-medium hover:bg-muted rounded-lg transition-colors"
                  >
                    <Phone className="w-4 h-4" /> Call Us
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-green-600 font-medium hover:bg-muted rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp Chat
                  </button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Click outside to close contact options */}
      {showContactOptions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowContactOptions(false)}
        />
      )}
    </>
  );
};

export default Header;