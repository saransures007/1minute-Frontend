import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, ShoppingBag, ArrowRight, Sparkles, Phone, MessageCircle, Clock, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroStore from "@/assets/hero-store.jpg";
import { apiService } from "@/lib/api/api";

const letterVariants = {
  hidden: { opacity: 0, y: 40, rotateX: -90 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { delay: 0.3 + i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

const floatVariants = {
  animate: (i: number) => ({
    y: [0, -10, 0],
    transition: { duration: 2.8, delay: i * 0.12, repeat: Infinity, ease: "easeInOut" },
  }),
};

const title = "1 MINUTE";

// Phone number for contact
const PHONE_NUMBER = "+919944630450";
const WHATSAPP_NUMBER = "919944630450"; // Without + for WhatsApp API

const HeroSection = () => {
  const [storeStatus, setStoreStatus] = useState<{
    isOpen: boolean;
    openingTime: string;
    closingTime: string;
    holidayMode: boolean;
    message: string;
    lastStatusChange: string;
  } | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [showContactOptions, setShowContactOptions] = useState(false);

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
      return { text: "Checking...", color: "text-yellow-500", bg: "bg-yellow-500/20", pulse: false, timing: "" };
    }
    
    if (storeStatus?.holidayMode) {
      return { text: "Holiday", color: "text-red-500", bg: "bg-red-500/20", pulse: false, timing: storeStatus.message };
    }
    
    if (storeStatus?.isOpen) {
      return { 
        text: "Open Now", 
        color: "text-green-500", 
        bg: "bg-green-500/20", 
        pulse: true,
        timing: `Open until ${storeStatus.closingTime}`
      };
    }
    
    return { 
      text: "Closed", 
      color: "text-red-500", 
      bg: "bg-red-500/20", 
      pulse: false,
      timing: storeStatus?.message || `Opens at ${storeStatus?.openingTime || "09:00"}`
    };
  };

  const status = getStatusDisplay();

  return (
    <section className="relative min-h-[vh] flex items-center overflow-hidden">

        

      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img src={heroStore} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${8 + i * 8}%`,
              top: `${15 + (i % 4) * 20}%`,
              width: `${4 + (i % 3) * 3}px`,
              height: `${4 + (i % 3) * 3}px`,
              background: i % 2 === 0
                ? "hsl(var(--primary) / 0.3)"
                : "hsl(var(--secondary) / 0.3)",
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.2, 0.7, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.25,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* 3D Animated Title */}
          <div className="flex justify-center items-center gap-2 md:gap-5" style={{ perspective: "800px" }}>
            {title.split("").map((letter, i) =>
              letter === " " ? (
                <span key={i} className="w-3 md:w-6" />
              ) : (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block text-6xl md:text-9xl font-display font-bold text-gradient-hero cursor-default select-none"
                  whileHover={{
                    scale: 1.2,
                    rotateY: 20,
                    rotateX: -10,
                    transition: { duration: 0.25 },
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.span
                    custom={i}
                    variants={floatVariants}
                    animate="animate"
                    className="inline-block drop-shadow-lg"
                  >
                    {letter}
                  </motion.span>
                </motion.span>
              )
            )}
          </div>

          {/* Subtitle with animated underline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="space-y-5"
          >
            
              <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
               <span className="text-gradient-hero">1 Minute</span> Convenience Store
            </h1>
            <p className="text-lg text-muted-foreground">
              Join our growing family across South India
            </p>
          </div>


            <div className="inline-block relative">
              <p className="text-3xl md:text-4xl font-display font-semibold text-foreground tracking-tight">
                Grab & Go
              </p>
              <motion.div
                className="h-1 rounded-full gradient-hero mt-2"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.4, duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Choose from <span className="text-foreground font-semibold">3000+ products</span> in under a minute.
              <br className="hidden md:block" />
              Organized for quick decisions, not rushed checkout.
            </p>
          </motion.div>

          {/* Location badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              { name: "Guindy, Chennai", active: true, address: "Chennai" },
              { name: "Bangalore", active: false, address: "Bangalore" },
              { name: "Coimbatore", active: false, address: "Coimbatore" },
            ].map((loc, i) => (
              <motion.div
                key={loc.name}
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1.4 + i * 0.12, type: "spring", stiffness: 400, damping: 20 }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${
                  loc.active
                    ? "bg-secondary/15 text-secondary border border-secondary/25"
                    : "bg-foreground/5 text-muted-foreground border border-border/50"
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                {loc.name}
                {loc.active && <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />}
                {!loc.active && <span className="text-xs opacity-50">Soon</span>}
              </motion.div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="flex flex-wrap justify-center gap-4 pt-2"
          >
            <Link to="/products">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" className="gradient-hero text-primary-foreground font-semibold rounded-full px-10 h-14 text-base shadow-lg glow-orange">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Browse Products
                </Button>
              </motion.div>
            </Link>
            <Link to="/brand">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-base border-2 backdrop-blur-sm bg-card/50">
                  <Sparkles className="w-5 h-5 mr-2 text-primary" />
                  Today's Offers
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Store Info Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-muted-foreground"
          >
            {/* Store Locations */}
            <span className="flex items-center gap-2">
              🏪 <span className="font-medium">3 Locations</span>
            </span>

            {/* Store Status with dynamic info */}
            <div className="relative">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bg} backdrop-blur-sm`}>
                <Clock className={`w-3.5 h-3.5 ${status.color}`} />
                <span className={`font-medium ${status.color}`}>{status.text}</span>
                {status.pulse && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
              </div>
              {status.timing && !loadingStatus && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {status.timing}
                </div>
              )}
            </div>

            {/* Store Hours */}
            <span className="flex items-center gap-2">
              ⏰ <span className="font-medium">{storeStatus?.openingTime || "08:00"} – {storeStatus?.closingTime || "23:00"}</span>
            </span>

            {/* Contact Button with Dropdown */}
            <div className="relative">
              <button
                onClick={handlePhoneClick}
                className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="font-medium">Contact</span>
              </button>

              {/* Contact Options Dropdown */}
              {showContactOptions && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border rounded-lg shadow-lg overflow-hidden z-50 min-w-[180px]">
                  <button
                    onClick={handleCall}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    Call Us
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm hover:bg-muted transition-colors border-t"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-green-500" />
                    WhatsApp Chat
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      {/* Click outside to close contact options */}
      {showContactOptions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowContactOptions(false)}
        />
      )}
    </section>
  );
};

export default HeroSection;