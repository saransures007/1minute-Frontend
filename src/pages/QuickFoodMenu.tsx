import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";

const tabs = ["🍜 Maggi", "☕ Hot", "🥤 Cold"];

const menuItems: Record<string, Array<{ name: string; time: string; price: number; hot: boolean }>> = {
  "🍜 Maggi": [
    { name: "Classic Maggi", time: "2 mins", price: 29, hot: true },
    { name: "Cheese Maggi", time: "3 mins", price: 49, hot: true },
    { name: "Egg Maggi", time: "4 mins", price: 49, hot: true },
    { name: "Maggi Cup Noodles", time: "3 mins", price: 45, hot: true },
  ],
  "☕ Hot": [
    { name: "Filter Coffee", time: "1 min", price: 20, hot: true },
    { name: "Tea / Chai", time: "1 min", price: 15, hot: true },
    { name: "Hot Chocolate", time: "2 mins", price: 35, hot: true },
  ],
  "🥤 Cold": [
    { name: "Iced Tea", time: "1 min", price: 25, hot: false },
    { name: "Cold Coffee", time: "2 mins", price: 40, hot: false },
    { name: "Fresh Juice", time: "3 mins", price: 45, hot: false },
  ],
};

const QuickFoodMenu = () => {
  const [activeTab, setActiveTab] = useState("🍜 Maggi");

  return (
    <Layout>
      <AnimatedSection className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">Ready in Minutes ⏱️</h1>
          <p className="text-muted-foreground mb-10">Made fresh at the store</p>

          {/* Tabs */}
          <div className="flex gap-1 bg-muted rounded-full p-1 mb-10 max-w-sm">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "gradient-hero text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Items */}
          <div className="space-y-4">
            {menuItems[activeTab]?.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl p-5 shadow-card flex items-center justify-between group hover:shadow-card-hover transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <span className="text-3xl">{item.hot ? "🍜" : "🥤"}</span>
                    {/* Steam animation */}
                    {item.hot && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {[0, 1, 2].map((j) => (
                          <motion.div
                            key={j}
                            className="w-0.5 h-3 bg-muted-foreground/30 rounded-full"
                            animate={{ y: [0, -6], opacity: [0.6, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: j * 0.3 }}
                          />
                        ))}
                      </div>
                    )}
                    {/* Condensation for cold */}
                    {!item.hot && (
                      <motion.div
                        className="absolute -bottom-1 right-0 w-1.5 h-1.5 bg-blue-300 rounded-full"
                        animate={{ y: [0, 4], opacity: [0.8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <Clock className="w-3 h-3" /> {item.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">₹{item.price}</span>
                  <Button size="sm" className="gradient-hero text-primary-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    Grab
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </Layout>
  );
};

export default QuickFoodMenu;
