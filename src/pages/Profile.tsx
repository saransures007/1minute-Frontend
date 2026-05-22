import { useEffect, useMemo, useState } from "react";
import QRCode from "react-qr-code";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { apiService } from "@/lib/api/api";
import { logout } from "@/lib/auth";
import { formatMoney, getActiveTier, TIERS } from "@/lib/loyalty";
import { useNavigate } from "react-router-dom";
import { LogOut, ScanQrCode, Sparkles, TrendingUp, Trophy } from "lucide-react";

import Layout from "@/components/Layout";

type ProfileUser = {
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
  partyCode?: string;
  loyaltyPoints?: number;
  totalDue?: number;
  currency?: string;
  isDealer?: boolean;
  provider?: string;
  whatsappOptIn?: boolean;
  receivable?: number;
  payable?: number;
  preferredPaymentMethod?: string;
  mostlyBoughtItems?: string[];
  loyaltyTransactions?: {
    id?: number | string;
    invoiceDate?: string;
    invoiceNo?: string;
    openingPoints?: number;
    earnedPoints?: number;
    redeemedPoints?: number;
    expiredPoints?: number;
    pointsBalance?: number;
    expiryDate?: string;
    transactionType?: "earned" | "redeemed" | "expired" | string;
    notes?: string | null;
  }[];
  analytics?: {
    totalSales?: number;
    totalOrders?: number;
    averageOrderValue?: number;
    preferredPaymentMethod?: string;
    purchaseFrequency?: string;
    mostlyBoughtItems?: string[];
  };
};

const getStoredProfile = () => {
  const stored = localStorage.getItem("app_user");
  if (!stored) return null;

  try {
    return JSON.parse(stored) as ProfileUser;
  } catch {
    return null;
  }
};

const formatTransactionDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getCardTextClass = () => "text-white";

const getCardMutedClass = () => "text-white/80";

const getCardAccentClass = (tierId: string) => {
  switch (tierId) {
    case "silver":
      return "border-slate-300/55 ring-slate-300/15";
    case "gold":
      return "border-amber-300/60 ring-amber-300/18";
    case "elite":
      return "border-violet-300/60 ring-violet-300/18";
    case "platinum":
      return "border-slate-200/60 ring-slate-200/18";
    default:
      return "border-orange-300/60 ring-orange-300/18";
  }
};

const getCardGlowClass = (tierId: string) => {
  switch (tierId) {
    case "silver":
      return "bg-slate-300/20";
    case "gold":
      return "bg-amber-300/20";
    case "elite":
      return "bg-violet-300/20";
    case "platinum":
      return "bg-slate-200/20";
    default:
      return "bg-orange-300/20";
  }
};

const Profile = () => {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiService.getMyProfile();
        const profile = (response?.data ?? response) as ProfileUser;

        if (cancelled) return;

        setUser(profile);
        localStorage.setItem("app_user", JSON.stringify(profile));
      } catch (fetchError) {
        const stored = getStoredProfile();

        if (cancelled) return;

        if (stored) {
          setUser(stored);
          setError("Showing saved profile because live profile sync is unavailable.");
        } else {
          setUser(null);
          setError("Please login to view profile");
        }

        console.error("Profile load failed:", fetchError);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const analytics = user?.analytics;
  const totalSales = analytics?.totalSales || 0;
  const currentTier = getActiveTier(totalSales);
  const tierIndex = TIERS.findIndex((tier) => tier.id === currentTier.id);
  const nextTier = TIERS[tierIndex + 1] || null;
  const purchaseGap = nextTier ? Math.max(nextTier.threshold - totalSales, 0) : 0;
  const progressToNextTier = nextTier
    ? Math.max(0, Math.min(1, (totalSales - currentTier.threshold) / (nextTier.threshold - currentTier.threshold)))
    : 1;

  const loyaltyPoints = user?.loyaltyPoints || 0;
  const walletValue = loyaltyPoints * 0.5;
  const favoriteItems = analytics?.mostlyBoughtItems || user?.mostlyBoughtItems || [];
  const transactions = user?.loyaltyTransactions || [];

  const qrValue = useMemo(() => {
    if (!user) return "";
    return user.phone || user.partyCode || user.email || user.name || "";
  }, [user]);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("app_user");
    navigate("/");
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen px-4 pt-12">
          <div className="mx-auto flex max-w-5xl flex-col gap-4">
            <div className="h-[420px] animate-pulse rounded-[36px] border border-border bg-card" />
            <div className="grid gap-4 md:grid-cols-3">
              <div className="h-32 animate-pulse rounded-[28px] border border-border bg-card" />
              <div className="h-32 animate-pulse rounded-[28px] border border-border bg-card" />
              <div className="h-32 animate-pulse rounded-[28px] border border-border bg-card" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center px-4 pt-24">
          <div className="rounded-3xl border border-border bg-card px-6 py-5 text-center text-sm text-foreground shadow-[0_20px_80px_rgba(0,0,0,0.12)]">
            {error || "Please login to view profile"}
          </div>
        </div>
      </Layout>
    );
  }

  const cardTextClass = getCardTextClass();
  const cardMutedClass = getCardMutedClass();
  const cardAccentClass = getCardAccentClass(currentTier.id);
  const cardGlowClass = getCardGlowClass(currentTier.id);

  return (
    <Layout>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.72),_transparent_32%),linear-gradient(to_bottom,rgba(248,250,252,1),rgba(241,245,249,0.88))] px-4 pb-12 pt-12 text-foreground">
        <div className="mx-auto max-w-5xl space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div
              className={`relative overflow-hidden rounded-[36px] border border-slate-700/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-5 shadow-[0_28px_80px_rgba(15,23,42,0.42)] sm:p-6 ${cardAccentClass}`}
            >
              <div className="absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(135deg,rgba(255,255,255,0.12)_0,rgba(255,255,255,0.12)_1px,transparent_1px,transparent_14px)]" />
              <div className={`absolute -right-10 top-2 h-40 w-40 rounded-full blur-3xl ${cardGlowClass}`} />
              <div className={`absolute -left-12 bottom-0 h-32 w-32 rounded-full blur-3xl ${cardGlowClass}`} />

              <div className="relative flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={currentTier.badgeClass}>
                      <Sparkles className="mr-1 h-3.5 w-3.5" />
                      {currentTier.emoji} {currentTier.name}
                    </Badge>
                    <Badge className="border-white/20 bg-white/10 text-white/80">
                      1 Minute membership
                    </Badge>
                  </div>

                  <div className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 sm:flex">
                    <ScanQrCode className="h-4 w-4" />
                    Scan to identify
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_250px] lg:items-center">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className={`text-[11px] uppercase tracking-[0.32em] ${cardMutedClass}`}>
                        Member profile
                      </p>
                      <h2
                        className={`truncate text-3xl font-black tracking-[0.06em] sm:text-5xl ${cardTextClass}`}
                        style={{
                          textShadow: "0 3px 18px rgba(0,0,0,0.24), 0 0 24px rgba(255,255,255,0.08)",
                        }}
                      >
                        {user.name || "User"}
                      </h2>
                      <p className={`truncate text-sm ${cardMutedClass}`}>
                        {user.email || "No email linked"}
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/14 bg-white/8 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur">
                        <p className={`text-[11px] uppercase tracking-[0.34em] ${cardMutedClass}`}>
                          Member ID
                        </p>
                        <p className={`mt-1 text-lg font-black ${cardTextClass}`}>
                          {user.partyCode || "—"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/14 bg-white/8 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur">
                        <p className={`text-[11px] uppercase tracking-[0.34em] ${cardMutedClass}`}>
                          Current plan
                        </p>
                        <p className={`mt-1 text-lg font-black ${cardTextClass}`}>
                          {currentTier.emoji} {currentTier.name}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/14 bg-white/8 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur">
                        <p className={`text-[11px] uppercase tracking-[0.34em] ${cardMutedClass}`}>
                          Points
                        </p>
                        <p className={`mt-1 text-lg font-black ${cardTextClass}`}>
                          {loyaltyPoints.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mx-auto flex w-full max-w-[250px] flex-col items-center justify-center rounded-[30px] border border-white/15 bg-white/10 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.25)] backdrop-blur-sm">
                    <div className="mb-3 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-[0.28em] text-white/90">
                      1 MINUTE
                    </div>

                    <div className="flex w-full justify-center rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_14px_28px_rgba(0,0,0,0.2)]">
                      <QRCode
                        value={qrValue || "profile"}
                        size={152}
                        fgColor="#111827"
                        bgColor="#ffffff"
                        level="H"
                      />
                    </div>

                    <div className="mt-3 w-full rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-center">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-white/80">
                        Scan at store
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold text-white">
                        {user.phone || user.email || "Profile QR"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/12 bg-white/8 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <div className="flex items-center justify-between gap-3 text-sm text-white/80">
                    <span className="font-medium">
                      Progress to {nextTier ? `${nextTier.emoji} ${nextTier.name}` : "top tier"}
                    </span>
                    <span className="font-semibold">
                      {nextTier ? `${formatMoney(purchaseGap)} left` : "Unlocked"}
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-white to-slate-200"
                      style={{ width: `${Math.max(progressToNextTier * 100, 8)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <Card className="rounded-[32px] border border-border bg-card shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <CardContent className="space-y-6 p-6">
              {error ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {error}
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[26px] border border-border bg-background p-5 shadow-[0_14px_30px_rgba(15,23,42,0.06)]">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                    Total purchase
                  </p>
                  <p className="mt-2 text-2xl font-black text-foreground">
                    {formatMoney(totalSales)}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Tier is calculated from total purchase value.
                  </p>
                </div>

                <div className="rounded-[26px] border border-border bg-background p-5 shadow-[0_14px_30px_rgba(15,23,42,0.06)]">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                    Loyalty points
                  </p>
                  <p className="mt-2 text-2xl font-black text-foreground">
                    {loyaltyPoints.toLocaleString("en-IN")} pts
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Wallet value {formatMoney(walletValue)}
                  </p>
                </div>

                <div className="rounded-[26px] border border-border bg-background p-5 shadow-[0_14px_30px_rgba(15,23,42,0.06)]">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                    Plan dashboard
                  </p>
                  <p className="mt-2 text-2xl font-black text-foreground">
                    {currentTier.emoji} {currentTier.name}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Tap the card above for the QR membership pass.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[28px] border border-border bg-background p-5 shadow-[0_14px_30px_rgba(15,23,42,0.06)]">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <TrendingUp className="h-4 w-4 text-amber-600" />
                    Purchase insights
                  </div>

                  <div className="grid gap-3">
                    <div className="rounded-2xl border border-border bg-white px-4 py-3 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                        Orders
                      </p>
                      <p className="mt-2 text-lg font-semibold text-foreground">
                        {analytics?.totalOrders || 0}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border bg-white px-4 py-3 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                        Average order
                      </p>
                      <p className="mt-2 text-lg font-semibold text-foreground">
                        {formatMoney(analytics?.averageOrderValue)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border bg-white px-4 py-3 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                        Payment
                      </p>
                      <p className="mt-2 text-lg font-semibold text-foreground">
                        {analytics?.preferredPaymentMethod || user.preferredPaymentMethod || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-[28px] border border-border bg-background p-5 shadow-[0_14px_30px_rgba(15,23,42,0.06)]">
                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Trophy className="h-4 w-4 text-amber-600" />
                      Account summary
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
                        <span className="text-muted-foreground">Currency</span>
                        <span className="font-semibold text-foreground">
                          {user.currency || "INR"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
                        <span className="text-muted-foreground">WhatsApp</span>
                        <span className="font-semibold text-foreground">
                          {user.whatsappOptIn ? "Opted in" : "Off"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
                        <span className="text-muted-foreground">Receivable</span>
                        <span className="font-semibold text-foreground">
                          {formatMoney(user.receivable)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
                        <span className="text-muted-foreground">Payable</span>
                        <span className="font-semibold text-foreground">
                          {formatMoney(user.payable)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
                        <span className="text-muted-foreground">Purchase frequency</span>
                        <span className="font-semibold text-foreground">
                          {analytics?.purchaseFrequency || "—"}
                        </span>
                      </div>
                    </div>

                    {favoriteItems.length ? (
                      <div className="mt-5 rounded-2xl border border-border bg-white p-4 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
                        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                          Favorite items
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {favoriteItems.slice(0, 5).map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {transactions.length ? (
                    <div className="rounded-[28px] border border-border bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
                      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Trophy className="h-4 w-4 text-amber-600" />
                        Bill rewards
                      </div>

                      <div className="max-h-[380px] space-y-3 overflow-y-auto pr-1">
                        {transactions.map((transaction) => {
                          const earned = transaction.earnedPoints || 0;
                          return (
                            <div
                              key={
                                transaction.id ||
                                transaction.invoiceNo ||
                                transaction.invoiceDate ||
                                `${earned}-${transaction.pointsBalance || 0}`
                              }
                              className="flex flex-col gap-2 rounded-2xl border border-border bg-background px-4 py-3 shadow-[0_12px_24px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between"
                            >
                              <div>
                                <p className="font-semibold text-foreground">
                                  {transaction.invoiceNo || "Invoice"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatTransactionDate(
                                    transaction.invoiceDate || transaction.expiryDate,
                                  )}
                                </p>
                              </div>

                              <div className="text-sm sm:text-right">
                                <p className="font-semibold text-emerald-600">
                                  +{earned.toLocaleString("en-IN")} pts earned
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Balance{" "}
                                  {Math.max(transaction.pointsBalance || loyaltyPoints, 0).toLocaleString(
                                    "en-IN",
                                  )}{" "}
                                  pts
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300/40 bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
