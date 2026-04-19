import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const surprises = [
  { name: "Kinder Joy", emoji: "🥚", message: "Surprise! A tiny toy inside! 🎉", color: "from-amber-50 to-orange-50" },
  { name: "Dairy Milk Silk", emoji: "🍫", message: "Unwrapped! Pure silk bliss~ 😋", color: "from-purple-50 to-pink-50" },
  { name: "Gems Pack", emoji: "🍬", message: "Colorful crunch rainbow! 🌈", color: "from-blue-50 to-cyan-50" },
  { name: "KitKat", emoji: "🍫", message: "Have a break, have fun! ✌️", color: "from-red-50 to-orange-50" },
  { name: "Ferrero Rocher", emoji: "🍫", message: "Golden luxury! ✨", color: "from-yellow-50 to-amber-50" },
  { name: "Snickers", emoji: "🍫", message: "You're not you when hungry! 😤", color: "from-amber-50 to-yellow-50" },
];

const confettiEmojis = ["🎉", "✨", "🎊", "⭐", "💫", "🌟"];

const SurpriseZone = () => {
  const [opened, setOpened] = useState<number | null>(null);
  const [confetti, setConfetti] = useState<Array<{ id: number; emoji: string; x: number; y: number }>>([]);

  const handleOpen = (i: number) => {
    if (opened === i) {
      setOpened(null);
      return;
    }
    setOpened(i);
    // Spawn confetti
    const newConfetti = Array.from({ length: 8 }, (_, j) => ({
      id: Date.now() + j,
      emoji: confettiEmojis[j % confettiEmojis.length],
      x: (Math.random() - 0.5) * 120,
      y: -(Math.random() * 80 + 30),
    }));
    setConfetti(newConfetti);
    setTimeout(() => setConfetti([]), 1200);
  };

  return (
    <AnimatedSection className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Gift className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-5xl font-display font-bold">Surprise Zone</h2>
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl"
            >
              🎁
            </motion.span>
          </div>
          <p className="text-muted-foreground text-lg">Tap to unwrap your favorites!</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 max-w-4xl mx-auto relative">
          {/* Confetti layer */}
          <AnimatePresence>
            {confetti.map((c) => (
              <motion.span
                key={c.id}
                initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                animate={{ opacity: 0, x: c.x, y: c.y, scale: 0.5, rotate: 360 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute left-1/2 top-1/2 text-2xl pointer-events-none z-20"
              >
                {c.emoji}
              </motion.span>
            ))}
          </AnimatePresence>

          {surprises.map((s, i) => (
            <motion.button
              key={s.name}
              onClick={() => handleOpen(i)}
              whileHover={{ rotate: [-1, 1, -1, 0], transition: { duration: 0.4 } }}
              whileTap={{ scale: 0.95 }}
              className={`relative bg-gradient-to-br ${s.color} rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all text-center border border-border/30`}
            >
              <motion.span
                className="text-5xl md:text-6xl block mb-3"
                animate={
                  opened === i
                    ? { scale: [1, 1.4, 1.1], rotate: [0, 15, -15, 0] }
                    : {}
                }
                transition={{ duration: 0.6 }}
              >
                {s.emoji}
              </motion.span>
              <span className="font-display font-bold">{s.name}</span>
              <p className="text-xs text-muted-foreground mt-1">
                {opened === i ? "Tap again to close" : "Tap to unwrap"}
              </p>

              <AnimatePresence>
                {opened === i && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-full bg-foreground text-background text-xs px-4 py-2.5 rounded-2xl shadow-lg whitespace-nowrap font-medium z-10"
                  >
                    {s.message}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-foreground rotate-45 rounded-sm" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default SurpriseZone;
