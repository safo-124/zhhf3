"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Shield,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Users,
  Gift,
  CreditCard,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const amounts = [25, 50, 100, 250, 500, 1000];

const impactLevels = [
  { amount: 25, impact: "Provides school supplies for 1 child for a semester" },
  { amount: 50, impact: "Feeds a family of 4 for an entire month" },
  { amount: 100, impact: "Covers medical checkups for 5 community members" },
  { amount: 250, impact: "Funds clean water access for 10 families" },
  { amount: 500, impact: "Sponsors a full scholarship for one academic year" },
  { amount: 1000, impact: "Builds a sustainable garden feeding 20 families" },
];

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100);
  const [customAmount, setCustomAmount] = useState("");
  const [isMonthly, setIsMonthly] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentAmount = selectedAmount || Number(customAmount) || 0;
  const impact = impactLevels.find((l) => l.amount <= currentAmount);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentAmount) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-gradient-to-r from-emerald-700 to-teal-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 border-2 border-white rounded-full" />
          <div className="absolute bottom-10 left-10 w-56 h-56 border-2 border-white rounded-full" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="w-12 h-12 text-emerald-200 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Give <span className="text-emerald-300">Hope</span> Today
            </h1>
            <p className="text-lg text-emerald-100 max-w-xl mx-auto">
              Your donation directly funds programs that change lives. 92 cents
              of every dollar go to our programs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { icon: Users, value: 10000, suffix: "+", label: "Donors Worldwide" },
              { icon: TrendingUp, value: 92, suffix: "%", label: "Goes to Programs" },
              { icon: Gift, value: 2.5, suffix: "M+", label: "Total Raised", decimals: 1 },
            ].map((s) => (
              <div key={s.label}>
                <s.icon className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-gray-900">
                  <AnimatedCounter end={s.value} suffix={s.suffix} decimals={s.value % 1 !== 0 ? 1 : 0} />
                </div>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Form Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-emerald-50/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8 md:gap-12">
            {/* Donation Form */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl p-10 shadow-xl text-center border border-emerald-200"
                  >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Thank You for Your Generosity!
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Your ${currentAmount} {isMonthly ? "monthly" : "one-time"}{" "}
                      donation will make a real difference.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                      Make Another Donation
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <ScrollReveal>
                      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                          Choose Your Donation
                        </h2>

                        {/* Frequency Toggle */}
                        <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
                          <button
                            onClick={() => setIsMonthly(false)}
                            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
                              !isMonthly
                                ? "bg-white text-emerald-700 shadow-sm"
                                : "text-gray-500"
                            }`}
                          >
                            One-Time
                          </button>
                          <button
                            onClick={() => setIsMonthly(true)}
                            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
                              isMonthly
                                ? "bg-white text-emerald-700 shadow-sm"
                                : "text-gray-500"
                            }`}
                          >
                            Monthly
                          </button>
                        </div>

                        {/* Amount Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                          {amounts.map((amt) => (
                            <motion.button
                              key={amt}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => {
                                setSelectedAmount(amt);
                                setCustomAmount("");
                              }}
                              className={`py-4 rounded-xl font-bold text-lg transition-all ${
                                selectedAmount === amt
                                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                                  : "bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-emerald-300"
                              }`}
                            >
                              ${amt}
                            </motion.button>
                          ))}
                        </div>

                        {/* Custom Amount */}
                        <div className="relative mb-8">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-bold">
                            $
                          </span>
                          <input
                            type="number"
                            value={customAmount}
                            onChange={(e) => {
                              setCustomAmount(e.target.value);
                              setSelectedAmount(null);
                            }}
                            placeholder="Custom amount"
                            className="w-full pl-10 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 text-lg placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                          />
                        </div>

                        {/* Impact Message */}
                        <AnimatePresence mode="wait">
                          {impact && currentAmount > 0 && (
                            <motion.div
                              key={impact.amount}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-8"
                            >
                              <p className="text-sm text-emerald-800">
                                <strong className="font-semibold">
                                  Your impact:
                                </strong>{" "}
                                {impact.impact}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Submit */}
                        <form onSubmit={handleSubmit}>
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={loading || currentAmount <= 0}
                            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {loading ? (
                              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <CreditCard className="w-5 h-5" />
                                Donate ${currentAmount}{" "}
                                {isMonthly ? "/month" : ""}
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </motion.button>
                        </form>

                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                          <Shield className="w-4 h-4 text-emerald-500" />
                          <span>Secure, encrypted payment processing</span>
                        </div>
                      </div>
                    </ScrollReveal>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <ScrollReveal variant="fadeRight">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">
                    Why Donate to ZHHF?
                  </h3>
                  <div className="space-y-4">
                    {[
                      { icon: Shield, text: "501(c)(3) certified - tax deductible" },
                      { icon: TrendingUp, text: "92% of funds go directly to programs" },
                      { icon: Heart, text: "Impact 15,000+ families and growing" },
                      { icon: CheckCircle, text: "Full transparency in fund allocation" },
                    ].map((item) => (
                      <div key={item.text} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <item.icon className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="text-sm text-gray-600">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fadeRight" delay={0.15}>
                <div className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl p-6 text-white">
                  <h3 className="font-bold mb-2">Monthly Giving</h3>
                  <p className="text-emerald-100 text-sm mb-4">
                    Become a sustaining partner and create lasting change with a
                    monthly contribution.
                  </p>
                  <button
                    onClick={() => setIsMonthly(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-700 font-semibold rounded-lg text-sm hover:bg-emerald-50 transition-colors"
                  >
                    <Gift className="w-4 h-4" />
                    Start Monthly Giving
                  </button>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
