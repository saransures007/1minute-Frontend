import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import AnimatedSection from "@/components/AnimatedSection";

const categories = [
  { icon: "🍫", label: "Chocolates", color: "bg-amber-50" },
  { icon: "🍪", label: "Biscuits", color: "bg-yellow-50" },
  { icon: "🥤", label: "Drinks", color: "bg-blue-50" },
  { icon: "🍜", label: "Maggi & Noodles", color: "bg-red-50" },
  { icon: "🍟", label: "Snacks", color: "bg-orange-50" },
  { icon: "🧴", label: "Personal Care", color: "bg-teal-50" },
  { icon: "🏠", label: "Home Needs", color: "bg-indigo-50" },
  { icon: "🥭", label: "Local Faves", color: "bg-green-50" },
  { icon: "⚡", label: "Energy Drinks", color: "bg-yellow-50" },
  { icon: "🎁", label: "Surprise Zone", color: "bg-pink-50" },
];

const CategoriesSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <AnimatedSection className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">
          Shop by Category
        </h2>
        <p className="text-muted-foreground text-center mb-12">Tap to explore</p>

        <div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 300, damping: 20 }}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`${cat.color} rounded-2xl p-5 flex flex-col items-center gap-3 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer`}
            >
              <motion.span
                className="text-4xl"
                animate={inView ? { y: [0, -4, 0] } : {}}
                transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
              >
                {cat.icon}
              </motion.span>
              <span className="text-sm font-semibold text-foreground">{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default CategoriesSection;
