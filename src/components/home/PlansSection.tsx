import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TIERS } from "@/lib/loyalty";
import { ArrowRight, Sparkles, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const PlansSection = () => {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute " />
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mb-10 text-center"
          >
            <Badge className="border-white/15 bg-slate-950 text-white shadow-[0_10px_24px_rgba(15,23,42,0.28)]">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Loyalty Plans
            </Badge>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-5xl">
              Choose your purchase level and unlock better rewards
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
              Each plan is based on total purchase value. The more you shop, the more benefits you unlock:
              free package cover, fruit bowls, drinks, loyalty redemption, and grocery discounts.
            </p>
          </motion.div>

          <div className="grid gap-4 lg:grid-cols-5">
            {TIERS.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                whileHover={{ y: -6 }}
              >
                <Card
                  className={`relative h-full overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(15,23,42,0.24)] ${tier.cardClass}`}
                >
                  <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${tier.accent}`} />
                  <div className={`absolute -right-8 top-0 h-28 w-28 rounded-full blur-3xl ${tier.ringClass} bg-white/10`} />
                  <div className={`absolute -left-10 bottom-0 h-24 w-24 rounded-full blur-3xl ${tier.ringClass} bg-white/10`} />

                  <CardContent className="relative p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-white/55">
                          {tier.id === "bronze" ? "Entry level" : "Tier"}
                        </p>
                        <h3 className={`mt-2 text-2xl font-black ${tier.highlightClass}`}>
                          {tier.name}
                        </h3>
                      </div>
                      <Badge className={tier.badgeClass}>
                        <Trophy className="mr-1 h-3.5 w-3.5" />
                        {tier.id === "bronze" ? "Start here" : "Unlock"}
                      </Badge>
                    </div>

                    <div className="mt-4 rounded-2xl border border-white/10 bg-black/15 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-white/55">
                        Requirement
                      </p>
                      <p className={`mt-1 text-lg font-black ${tier.highlightClass}`}>
                        {tier.threshold === 0 ? "₹0+" : `₹${tier.threshold.toLocaleString("en-IN")}+`}
                      </p>
                    </div>

                    <div className="mt-4 space-y-2">
                      {tier.benefits.map((benefit) => (
                        <div
                          key={benefit}
                          className="flex items-start gap-2 rounded-2xl border border-white/10 bg-black/15 px-3 py-2 text-sm text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm"
                        >
                          <span
                            className={`mt-0.5 h-2.5 w-2.5 rounded-full ${
                              tier.id === "silver"
                                ? "bg-slate-300"
                                : tier.id === "gold"
                                  ? "bg-amber-300"
                                  : tier.id === "elite"
                                    ? "bg-teal-300"
                                    : "bg-slate-200"
                            }`}
                          />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 rounded-2xl border border-white/10 bg-gradient-to-br from-black/20 to-black/10 px-4 py-3 text-sm text-white/72 shadow-[0_12px_24px_rgba(0,0,0,0.24)] backdrop-blur-sm">
                      {tier.id === "bronze"
                        ? "Perfect for getting started."
                        : tier.id === "silver"
                          ? "Redeem points and start saving."
                          : tier.id === "gold"
                            ? "Popular for regular families."
                            : tier.id === "elite"
                              ? "Built for heavy repeat shoppers."
                              : "Highest savings and VIP feel."}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[28px] border border-slate-700/60 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-5 py-5 text-center text-white shadow-[0_24px_60px_rgba(15,23,42,0.24)] md:flex-row md:text-left"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/55">
                Ready to move up?
              </p>
              <h3 className="mt-2 text-xl font-black text-white">
                See your current plan and unlock the next tier
              </h3>
              <p className="mt-1 text-sm text-white/70">
                Visit your profile to scan your QR card, check your tier, and track the gap to the next reward level.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/profile">
                <Button className="rounded-full bg-white px-6 text-slate-950 hover:bg-white/90">
                  View Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/store-locations">
                <Button
                  variant="outline"
                  className="rounded-full border-white/20 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white"
                >
                  Find Store
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
