export type TierId = "bronze" | "silver" | "gold" | "elite" | "platinum";

export type TierInfo = {
  id: TierId;
  name: string;
  emoji: string;
  threshold: number;
  benefits: string[];
  accent: string;
  badgeClass: string;
  cardClass: string;
  highlightClass: string;
  ringClass: string;
};

export const TIERS: TierInfo[] = [
  {
    id: "bronze",
    name: "Bronze",
    emoji: "🥉",
    threshold: 0,
    benefits: ["Free package cover"],
    accent: "from-[#6b4423] via-[#4a2e1a] to-[#24150d]",
    badgeClass:
      "border-[#c08a5b]/60 bg-[#5a3820] text-[#fff1df] shadow-[0_10px_20px_rgba(0,0,0,0.18)]",
    cardClass:
      "border-[#c08a5b]/50 bg-gradient-to-br from-[#6b4423] via-[#4a2e1a] to-[#24150d] text-[#fff1df] shadow-[0_18px_36px_rgba(0,0,0,0.22)]",
    highlightClass: "text-[#fff7ed]",
    ringClass: "ring-[#c08a5b]/20",
  },
  {
    id: "silver",
    name: "Silver",
    emoji: "🥈",
    threshold: 5000,
    benefits: ["Free package cover", "Loyalty redeem enabled"],
    accent: "from-[#4b5563] via-[#2f3742] to-[#161b22]",
    badgeClass:
      "border-[#d1d5db]/60 bg-[#374151] text-[#f3f4f6] shadow-[0_10px_24px_rgba(0,0,0,0.24)]",
    cardClass:
      "border-[#cbd5e1]/45 bg-gradient-to-br from-[#4b5563] via-[#2f3742] to-[#161b22] text-[#f8fafc] shadow-[0_20px_40px_rgba(0,0,0,0.30)]",
    highlightClass: "text-white",
    ringClass: "ring-[#cbd5e1]/20",
  },
  {
    id: "gold",
    name: "Gold",
    emoji: "🥇",
    threshold: 20000,
    benefits: ["Free package cover", "1 free fruit bowl / month"],
    accent: "from-[#8a5a00] via-[#d4a017] to-[#3b2400]",
    badgeClass:
      "border-[#ffd166]/70 bg-[#5c3b00] text-[#fff7d1] shadow-[0_12px_30px_rgba(255,193,7,0.22)]",
    cardClass:
      "border-[#fbbf24]/60 bg-gradient-to-br from-[#8a5a00] via-[#d4a017] to-[#3b2400] text-[#fff8dc] shadow-[0_22px_55px_rgba(0,0,0,0.40)]",
    highlightClass: "text-[#fff3b0]",
    ringClass: "ring-[#fbbf24]/28",
  },
  {
    id: "elite",
    name: "Elite",
    emoji: "👑",
    threshold: 50000,
    benefits: ["Free package cover", "1 free drink / month", "1 free fruit bowl / month"],
    accent: "from-[#063b2e] via-[#03110d] to-[#010706]",
    badgeClass:
      "border-[#34d399]/60 bg-[#052e24] text-[#d1fae5] shadow-[0_12px_28px_rgba(16,185,129,0.16)]",
    cardClass:
      "border-[#10b981]/55 bg-gradient-to-br from-[#063b2e] via-[#03110d] to-[#010706] text-[#ecfdf5] shadow-[0_22px_55px_rgba(0,0,0,0.44)]",
    highlightClass: "text-[#a7f3d0]",
    ringClass: "ring-[#34d399]/18",
  },
  {
    id: "platinum",
    name: "Platinum",
    emoji: "💎",
    threshold: 100000,
    benefits: [
      "Free package cover",
      "1 free drink / month",
      "1 free fruit bowl / month",
      "Extra 5% grocery discount",
    ],
    accent: "from-[#000000] via-[#050816] to-[#020617]",
    badgeClass:
      "border-white/25 bg-black text-white shadow-[0_14px_34px_rgba(255,255,255,0.08)]",
    cardClass:
      "border-white/20 bg-gradient-to-br from-black via-[#050816] to-[#020617] text-white shadow-[0_24px_70px_rgba(0,0,0,0.60)]",
    highlightClass: "text-white",
    ringClass: "ring-white/15",
  },
];

export const getActiveTier = (totalSales: number) =>
  [...TIERS].reverse().find((tier) => totalSales >= tier.threshold) || TIERS[0];

export const formatMoney = (value?: number) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
