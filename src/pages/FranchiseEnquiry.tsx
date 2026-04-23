"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { apiService } from "@/lib/api/api";

const benefits = [
  "Proven Model — 3 successful locations",
  "Complete Brand Support & Training",
  "Tech Integration (POS, Inventory)",
  "Marketing & Launch Assistance",
];

const FranchiseEnquiry = () => {
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    investment: "₹20L – ₹30L",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e: any) => {
    const { id, name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id || name]: value,
    }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await apiService.submitFranchise(form);

      if (res) {
        setSubmitted(true);
      } else {
        alert("Failed to submit");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <AnimatedSection className="py-20 md:py-32">
        <div className="container mx-auto px-4 max-w-4xl">

          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
              Own a <span className="text-gradient-hero">1 Minute</span> Store
            </h1>
            <p className="text-lg text-muted-foreground">
              Join our growing family across South India
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">

            {/* Benefits */}
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-bold">
                Why Franchise With Us
              </h2>

              <div className="space-y-4">
                {benefits.map((b, i) => (
                  <motion.div
                    key={b}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                    <span className="text-foreground/80">{b}</span>
                  </motion.div>
                ))}
              </div>

              <div className="bg-muted rounded-2xl p-6 mt-8">
                <h3 className="font-display font-semibold mb-2">
                  Available Cities
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>🟢 Chennai (Flagship)</p>
                  <p>🟡 Bangalore (Coming Soon)</p>
                  <p>🟡 Coimbatore (Coming Soon)</p>
                  <p className="text-primary font-medium">📍 + Your City?</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              {submitted ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-secondary/10 rounded-2xl p-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <CheckCircle className="w-16 h-16 text-secondary mx-auto mb-4" />
                  </motion.div>

                  <h3 className="font-display font-bold text-xl mb-2">
                    Application Received! 🎉
                  </h3>

                  <p className="text-muted-foreground">
                    We'll get back to you within 48 hours.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-card rounded-2xl p-6 shadow-card space-y-5"
                >
                  <h3 className="font-display font-bold text-xl">
                    Enquiry Form
                  </h3>

                  {/* INPUTS */}
                  {[
                    { id: "name", label: "Full Name", type: "text", placeholder: "Your name" },
                    { id: "phone", label: "Phone", type: "tel", placeholder: "+91 XXXXX XXXXX" },
                    { id: "email", label: "Email", type: "email", placeholder: "you@email.com" },
                    { id: "city", label: "Preferred City", type: "text", placeholder: "City name" },
                  ].map((field) => (
                    <div key={field.id} className="space-y-1.5">
                      <Label htmlFor={field.id}>{field.label}</Label>
                      <Input
                        id={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        required
                        onChange={handleChange}
                        className="rounded-xl focus:ring-2 focus:ring-primary/30 transition-all"
                      />
                    </div>
                  ))}

                  {/* INVESTMENT */}
                  <div className="space-y-1.5">
                    <Label>Investment Range</Label>
                    <select
                      name="investment"
                      onChange={handleChange}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option>₹20L – ₹30L</option>
                      <option>₹30L – ₹50L</option>
                      <option>₹50L – ₹1Cr</option>
                      <option>₹1Cr+</option>
                    </select>
                  </div>

                  {/* 🔥 DESCRIPTION (ONLY NEW FIELD) */}
                  <div className="space-y-1.5">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      onChange={handleChange}
                      placeholder="Tell us about your interest..."
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                      rows={3}
                    />
                  </div>

                  {/* SUBMIT */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full gradient-hero text-primary-foreground rounded-full font-semibold animate-pulse-glow"
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              )}
            </div>

          </div>
        </div>
      </AnimatedSection>
    </Layout>
  );
};

export default FranchiseEnquiry;