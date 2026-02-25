"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  ArrowRight,
  GraduationCap,
  HeartPulse,
  Home,
  Utensils,
  Droplets,
  Wrench,
  Users,
  Globe,
  HandHeart,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerContainer";

interface ProgramData {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  image: string | null;
  icon: string;
  color: string;
  emoji: string;
  features: string | null;
  impacts: string | null;
  active: boolean;
  sortOrder: number;
}

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  HeartPulse,
  Home,
  Utensils,
  Droplets,
  Wrench,
  Users,
  Globe,
  HandHeart,
  Heart,
  Sparkles,
};

function getIcon(name: string): LucideIcon {
  return iconMap[name] || Heart;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrograms = useCallback(async () => {
    try {
      const res = await fetch("/api/programs");
      if (res.ok) {
        const data = await res.json();
        setPrograms(data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900" />
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-16 right-16 w-80 h-80 border-2 border-white rounded-full" />
          <div className="absolute bottom-16 left-16 w-60 h-60 border-2 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-40 h-40 border border-white/50 rounded-full" />
        </div>
        {/* Floating emojis */}
        <motion.div
          className="absolute top-24 left-[10%] text-4xl opacity-20"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🎓
        </motion.div>
        <motion.div
          className="absolute top-32 right-[15%] text-4xl opacity-20"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        >
          🏥
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-[20%] text-4xl opacity-20"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
        >
          💧
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-emerald-100 text-sm rounded-full border border-white/20 mb-6">
              <HandHeart className="w-4 h-4" />
              What We Do
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Our{" "}
              <span className="text-emerald-300">Programs</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto">
              Comprehensive community programs that address education, healthcare,
              housing, and more — creating sustainable impact that lasts generations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-2xl h-96 animate-pulse"
                />
              ))}
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-16">
              <Sparkles className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Programs Coming Soon
              </h3>
              <p className="text-gray-500">
                We&apos;re working on bringing our programs online. Check back soon!
              </p>
            </div>
          ) : (
            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {programs.map((program) => {
                const Icon = getIcon(program.icon);
                const features: string[] = (() => {
                  try {
                    return program.features ? JSON.parse(program.features) : [];
                  } catch {
                    return [];
                  }
                })();

                return (
                  <StaggerItem key={program.id}>
                    <Link href={`/programs/${program.slug}`}>
                      <motion.div
                        whileHover={{ y: -8 }}
                        className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-200 transition-all duration-500 h-full flex flex-col"
                      >
                        {/* Image */}
                        <div className="relative h-52 md:h-56 overflow-hidden bg-gray-100">
                          {program.image ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={program.image}
                                alt={program.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                            </>
                          ) : (
                            <div
                              className={`w-full h-full bg-gradient-to-br ${program.color} opacity-15 flex items-center justify-center`}
                            >
                              <span className="text-7xl">{program.emoji}</span>
                            </div>
                          )}

                          {/* Badge */}
                          <div className="absolute top-3 left-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${program.color} shadow-lg`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              {program.title}
                            </span>
                          </div>

                          {/* Emoji float */}
                          <div className="absolute bottom-3 right-3 text-3xl drop-shadow-lg group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500">
                            {program.emoji}
                          </div>
                        </div>

                        {/* Accent bar */}
                        <div
                          className={`h-1 bg-gradient-to-r ${program.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                        />

                        <div className="p-6 md:p-7 flex flex-col flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                            >
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                              {program.title}
                            </h3>
                          </div>

                          <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                            {program.shortDescription}
                          </p>

                          {/* Feature pills (show top 3) */}
                          {features.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {features.slice(0, 3).map((f) => (
                                <span
                                  key={f}
                                  className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-medium rounded-full"
                                >
                                  {f}
                                </span>
                              ))}
                              {features.length > 3 && (
                                <span className="px-2.5 py-1 bg-gray-50 text-gray-500 text-[11px] font-medium rounded-full">
                                  +{features.length - 3} more
                                </span>
                              )}
                            </div>
                          )}

                          <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 group-hover:text-emerald-700 group/link">
                            Learn More
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <HandHeart className="w-12 h-12 text-emerald-200 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Want to Support Our Programs?
            </h2>
            <p className="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">
              Your contribution helps us expand our reach and create lasting change
              in communities that need it most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/donate"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 font-bold rounded-full shadow-xl hover:shadow-2xl transition-all"
                >
                  <Heart className="w-5 h-5" />
                  Donate Now
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-700/50 text-white font-bold rounded-full border border-white/20 hover:bg-emerald-700/70 transition-all"
                >
                  <Users className="w-5 h-5" />
                  Volunteer With Us
                </Link>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
