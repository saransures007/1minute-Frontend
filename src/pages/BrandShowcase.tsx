import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { Zap, Target, MapPin, Handshake, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";

const brands = [
  "Cadbury", "Britannia", "Nestle", "Coca-Cola", "Red Bull", "Lays",
  "Kurkure", "Ponds", "Dove", "Colgate", "Aachi", "Everest",
  "Ferrero", "KitKat", "Maggi",
];

const whyCards = [
  { icon: Zap, title: "Speed", desc: "Find what you need in 60 seconds", color: "bg-primary/10 text-primary" },
  { icon: Target, title: "3000+ Products", desc: "Everything from snacks to essentials", color: "bg-secondary/10 text-secondary" },
  { icon: MapPin, title: "Local Roots", desc: "Chennai-born, South India proud", color: "bg-accent text-accent-foreground" },
  { icon: Handshake, title: "Trust Since 2024", desc: "Growing with the community", color: "bg-primary/10 text-primary" },
];

const BrandShowcase = () => {
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [brandsRef, brandsInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <Layout>
      {/* Hero */}
      <AnimatedSection className="py-20 md:py-32 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            We're Your <span className="text-gradient-hero">Quick-Break Buddy</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Not just a store — we're the reason you smile during your tech park break. Started in 2024, now serving across South India.
          </p>
        </div>
      </AnimatedSection>

      {/* Stats */}
      <section ref={statsRef} className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl">
          {[
            { end: 3000, suffix: "+", label: "Products" },
            { end: 3, suffix: "", label: "Locations" },
            { end: 2024, suffix: "", label: "Founded" },
            { end: 60, suffix: "s", label: "Avg Find Time" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-5xl font-display font-bold text-gradient-hero">
                {statsInView ? <CountUp end={s.end} duration={2} suffix={s.suffix} /> : "0"}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <AnimatedSection className="py-20 md:py-28">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Our Mission</h2>
          <p className="text-2xl font-display text-gradient-hero font-semibold mb-4">"Make every minute count"</p>
          <p className="text-muted-foreground text-lg">
            We organize our stores so you find exactly what you need in under 60 seconds. No wandering, no confusion — just grab & go.
          </p>
        </div>
      </AnimatedSection>

      {/* Why Choose Us */}
      <AnimatedSection className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">Why Choose 1 Minute?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {whyCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, rotateY: 5 }}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all"
              >
                <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg">{card.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Brands */}
      <AnimatedSection className="py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">Brands You Love ❤️</h2>
          <p className="text-muted-foreground text-center mb-12">+ 100 more brands in store</p>
        </div>
        <div ref={brandsRef} className="relative">
          <motion.div
            className="flex gap-6 whitespace-nowrap"
            animate={brandsInView ? { x: [0, -1200] } : {}}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {[...brands, ...brands].map((b, i) => (
              <div
                key={`${b}-${i}`}
                className="flex-shrink-0 px-8 py-4 bg-card rounded-xl shadow-card border border-border font-display font-semibold text-foreground/70"
              >
                {b}
              </div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Franchise CTA */}
      <AnimatedSection className="py-20 md:py-28 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
            Grow With Us 📈
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-lg mx-auto">
            Own a 1 Minute Store in your city. Join our growing family across South India.
          </p>
          <Link to="/franchise">
            <Button size="lg" className="bg-card text-foreground font-semibold rounded-full px-8 hover:scale-105 transition-all">
              Apply for Franchise
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </AnimatedSection>
    </Layout>
  );
};

export default BrandShowcase;
