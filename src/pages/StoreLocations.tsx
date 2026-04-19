import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Navigation, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api/api";




const StoreLocations = () => {
  const [storeStatus, setStoreStatus] = useState<{
    isOpen: boolean;
    openingTime: string;
    closingTime: string;
    holidayMode: boolean;
    message: string;
    lastStatusChange: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await apiService.getStoreStatus();
        if (res.success) {
          setStoreStatus(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);
 const stores = [
  {
    name: "Chennai – Guindy",
    address: "Plot No. 1, Jawaharlal Nehru Salai, SIDCO Industrial Estate, Guindy, Chennai, Tamil Nadu 600032",
    status: storeStatus?.isOpen  ? "open" as const : "Closed",
    hours: "8:00 AM – 11:00 PM",
    flagship: true,
    mapUrl: "https://maps.app.goo.gl/kaWEJ625iSLgu4K59",
  },
  {
    name: "Bangalore",
    address: "Location to be announced",
    status: "coming" as const,
    hours: "8:00 AM – 11:00 PM",
    flagship: false,
    mapUrl: "",
  },
  {
    name: "Coimbatore",
    address: "Location to be announced",
    status: "coming" as const,
    hours: "8:00 AM – 11:00 PM",
    flagship: false,
    mapUrl: "",
  },
];
 

  return (
    
  <Layout>
    <AnimatedSection className="py-20 md:py-32 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Our Stores 📍</h1>
        <p className="text-lg text-muted-foreground">Visit us across South India</p>
      </div>
    </AnimatedSection>

    <section className="pb-20">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
        {stores.map((store, i) => (
          <motion.div
            key={store.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, type: "spring" }}
            className={`bg-card rounded-2xl p-6 shadow-card border-2 transition-all ${
              store.flagship ? "border-primary/30" : "border-border"
            }`}
          >
            {store.flagship && (
              <span className="inline-block px-3 py-1 rounded-full gradient-hero text-primary-foreground text-xs font-bold mb-4">
                Flagship
              </span>
            )}

            <div className="flex items-start gap-2 mb-3">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 400 }}
              >
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
              </motion.div>
              <h3 className="font-display font-bold text-xl">{store.name}</h3>
            </div>

            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{store.address}</p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Clock className="w-4 h-4" />
              {store.hours}
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className={`w-2 h-2 rounded-full ${store?.status == "open" ? "bg-secondary animate-pulse" : "bg-muted-foreground"}`} />
              <span className="text-sm font-medium">
                {store?.status == "open" ? "Open Now" : "Coming Soon"}
              </span>
            </div>

            {store?.status == "open" ? (
              <div className="flex gap-2">
                <a href={store.mapUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full gradient-hero text-primary-foreground rounded-full" size="sm">
                    <Navigation className="w-4 h-4 mr-1" /> Directions
                  </Button>
                </a>
                <a href="tel:+919944630450">
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Phone className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            ) : (
              <Button variant="outline" className="w-full rounded-full" size="sm">
                <Bell className="w-4 h-4 mr-1" /> Notify Me
              </Button>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  </Layout>);
};

export default StoreLocations;
