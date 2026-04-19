"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";
import { Zap } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { apiService } from "@/lib/api/api";

const ENERGY_CATEGORY_ID = "254650576";

const allowedDrinks = [
  "monster",
  "monster zero",
  "red bull",
  "redbull",
  "power ade",
  "powerade",
  "prime",
];

const EnergyZone = () => {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [drinks, setDrinks] = useState<any[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiService.getItems({
          categoryId: ENERGY_CATEGORY_ID,
          perPage: 50,
        });

        // 🔥 Filter only required drinks
        const filtered = (res.data || []).filter((item: any) => {
          const name = item.name?.toLowerCase() || "";
          return allowedDrinks.some((k) => name.includes(k));
        });

        // 🔥 Fetch full details (image)
        const detailed = await Promise.all(
          filtered.slice(0, 5).map(async (item: any) => {
            try {
              const full = await apiService.getItemById(item.id);
              return full.data || item;
            } catch {
              return item;
            }
          })
        );

        setDrinks(detailed);
      } catch (e) {
        console.error(e);
      }
    };

    load();
  }, []);

  /* ---------------- AUDIO CONTROL ---------------- */
useEffect(() => {
  if (!audioRef.current) return;

  const audio = audioRef.current;
  audio.volume = 0.3;

  if (inView) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
}, [inView]);
useEffect(() => {
  const unlock = () => {
    if (!audioRef.current) return;

    audioRef.current.muted = false; // 🔥 unmute after interaction
    document.removeEventListener("click", unlock);
  };

  document.addEventListener("click", unlock);

  return () => document.removeEventListener("click", unlock);
}, []);
  /* ---------------- USER INTERACTION ---------------- */
const enableAudio = async () => {
  const audio = audioRef.current;
  if (!audio) return;

  try {
    // 🔊 If audio is paused → start it
    if (audio.paused) {
      audio.muted = false;        // unmute
      audio.currentTime = 0;
      await audio.play();
    } else {
      // 🔇 If already playing → toggle mute
      audio.muted = !audio.muted;
    }
  } catch (e) {
    console.error("Audio error:", e);
  }
};

  return (
    <section
      ref={ref}
      className="py-20 md:py-28 bg-foreground text-background relative overflow-hidden"
    >
      {/* 🔊 AUDIO */}
    <audio ref={audioRef} loop preload="auto" playsInline muted>
      <source src="/assets/F1.mp3" type="audio/mpeg" />
    </audio>

      {/* 🔥 BACKGROUND ANIMATION */}
      <div className=" absoulte inset-0 flex items-center justify-center gap-1 opacity-[0.5]">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 rounded-full bg-primary"
            animate={{
              height: [15, 30 + Math.random() * 80, 15],
            }}
            transition={{
              duration: 0.9 + Math.random() * 0.6,
              repeat: Infinity,
              delay: i * 0.001,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* HEADER */}
        <AnimatedSection className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Zap className="w-10 h-10 text-primary" />
            <h2 className="text-4xl font-bold">Energy Zone</h2>
          </div>

          {/* 🔊 BUTTON (IMPORTANT FOR AUDIO) */}
          <button
            onClick={enableAudio}
            className="mt-3 px-4 py-2 bg-primary text-white rounded-lg text-sm"
          >
            🔊  Sound
          </button>
        </AnimatedSection>

        {/* DRINK CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto">

          {drinks.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-background/10 backdrop-blur-md rounded-2xl p-5 text-center border border-background/10"
            >
              {/* IMAGE */}
              <div className="h-24 flex items-center justify-center mb-3">
                {(d.image || d.itemImage) ? (
                  <img
                    src={d.image || d.itemImage}
                    className="h-full object-contain"
                  />
                ) : (
                  <span className="text-4xl">🥤</span>
                )}
              </div>

              {/* NAME */}
              <h3 className="font-bold text-sm line-clamp-2">
                {d.name || d.itemName}
              </h3>

              {/* PRICE */}
              <p className="text-primary font-bold text-lg mt-1">
                ₹{d.price || d.salesRate || d.sellingPrice || "--"}
              </p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default EnergyZone;