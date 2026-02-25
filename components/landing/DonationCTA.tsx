"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, TrendingUp, Shield, ArrowRight, Loader2 } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

interface CampaignData {
  id: number;
  title: string;
  goal: number;
  raised: number;
  image: string | null;
  description: string | null;
}

export default function DonationCTA() {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/campaigns")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCampaigns(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 border-2 border-white rounded-full" />
        <div className="absolute bottom-10 right-10 w-56 h-56 border-2 border-white rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left Content */}
          <ScrollReveal variant="fadeLeft">
            <div>
              <span className="inline-block px-4 py-1.5 bg-emerald-400/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
                Make a Difference
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                Your Generosity Can{" "}
                <span className="text-emerald-300">Change Lives</span>
              </h2>
              <p className="text-emerald-100/80 text-lg leading-relaxed mb-8">
                Every donation, no matter the size, creates ripples of hope.
                100% of your contribution goes directly to our programs,
                ensuring maximum impact for the communities we serve.
              </p>

              {/* Trust Points */}
              <div className="space-y-4 mb-10">
                {[
                  { icon: Shield, text: "100% Transparent - Track your donation's impact" },
                  { icon: TrendingUp, text: "92 cents of every dollar goes to programs" },
                  { icon: Heart, text: "Tax-deductible contributions" },
                ].map((point) => (
                  <div key={point.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-400/20 flex items-center justify-center flex-shrink-0">
                      <point.icon className="w-4 h-4 text-emerald-300" />
                    </div>
                    <span className="text-emerald-100/80 text-sm">
                      {point.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/donate"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 font-bold rounded-full shadow-xl hover:shadow-2xl transition-all text-lg"
                  >
                    <Heart className="w-5 h-5" />
                    Donate Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <Link
                  href="/donate"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all text-lg justify-center"
                >
                  Monthly Giving
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Right - Campaign Progress */}
          <ScrollReveal variant="fadeRight">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-6">
                Active Campaigns
              </h3>

              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                </div>
              ) : campaigns.length > 0 ? (
                campaigns.map((campaign, index) => {
                  const percentage = Math.round(
                    (campaign.raised / campaign.goal) * 100
                  );
                  return (
                    <motion.div
                      key={campaign.id}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 }}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:bg-white/15 transition-colors group"
                    >
                      <div className="flex">
                        {/* Campaign Image */}
                        {campaign.image && (
                          <div className="relative w-24 sm:w-28 flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={campaign.image}
                              alt={campaign.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5" />
                          </div>
                        )}

                        {/* Campaign Info */}
                        <div className="flex-1 p-5">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold text-white">
                              {campaign.title}
                            </h4>
                            <span className="text-emerald-300 font-bold text-sm">
                              {percentage}%
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-3">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${percentage}%` }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 1.5,
                                delay: 0.3 + index * 0.15,
                                ease: "easeOut",
                              }}
                              className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full relative"
                            >
                              <div className="absolute inset-0 animate-shimmer" />
                            </motion.div>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-emerald-200">
                              ${campaign.raised.toLocaleString()} raised
                            </span>
                            <span className="text-white/50">
                              of ${campaign.goal.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-emerald-200/60 text-center py-8">
                  No active campaigns right now.
                </div>
              )}

              {/* Quick Donate Amounts */}
              <div className="pt-4">
                <p className="text-emerald-200/60 text-sm mb-3">
                  Quick Donate
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 100, 250].map((amount) => (
                    <motion.button
                      key={amount}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="py-3 bg-white/10 border border-white/10 text-white font-semibold rounded-xl hover:bg-emerald-500 hover:border-emerald-500 transition-all text-sm"
                    >
                      ${amount}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
