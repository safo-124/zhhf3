"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Heart, HandHeart, ArrowRight, Sparkles } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

export default function VolunteerCTA() {
  return (
    <section className="relative py-20 md:py-28 bg-white overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Visual Side */}
          <ScrollReveal variant="fadeLeft">
            <div className="relative">
              {/* Main card */}
              <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-10 md:p-14 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16" />

                <div className="relative text-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6"
                  >
                    <HandHeart className="w-10 h-10 text-white" />
                  </motion.div>

                  <h3 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    2,500+
                  </h3>
                  <p className="text-emerald-100 text-lg">Active Volunteers</p>
                </div>

                {/* Floating cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        150+ hrs
                      </p>
                      <p className="text-xs text-gray-500">
                        This week
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-4 -left-4 bg-white rounded-2xl p-3 shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {["bg-emerald-500", "bg-blue-500", "bg-violet-500"].map(
                        (color, i) => (
                          <div
                            key={i}
                            className={`w-7 h-7 rounded-full ${color} border-2 border-white flex items-center justify-center text-[10px] text-white font-bold`}
                          >
                            {["A", "B", "C"][i]}
                          </div>
                        )
                      )}
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      +47 joined
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </ScrollReveal>

          {/* Content Side */}
          <ScrollReveal variant="fadeRight">
            <div>
              <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
                Volunteer With Us
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Be the Hands That{" "}
                <span className="gradient-text">Lift Others Up</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Whether you can spare a few hours a week or want to commit to a
                long-term project, there&apos;s a place for you in our volunteer
                family. Your skills and time can make an incredible difference.
              </p>

              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  { icon: Users, text: "Join a supportive community" },
                  { icon: Heart, text: "Create real, lasting impact" },
                  { icon: Sparkles, text: "Develop new skills" },
                  { icon: HandHeart, text: "Flexible commitment options" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="/volunteer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-lg rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all group"
                >
                  Apply to Volunteer
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
