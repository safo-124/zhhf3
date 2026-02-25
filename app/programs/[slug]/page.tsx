"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  ArrowLeft,
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
  CheckCircle,
  TrendingUp,
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

export default function ProgramDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [program, setProgram] = useState<ProgramData | null>(null);
  const [allPrograms, setAllPrograms] = useState<ProgramData[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchProgram = useCallback(async () => {
    try {
      const [res, allRes] = await Promise.all([
        fetch(`/api/programs/${slug}`),
        fetch("/api/programs"),
      ]);

      if (res.ok) {
        setProgram(await res.json());
      } else {
        setNotFound(true);
      }

      if (allRes.ok) {
        setAllPrograms(await allRes.json());
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProgram();
  }, [fetchProgram]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="pt-32 pb-20 bg-gradient-to-br from-emerald-700 to-teal-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-8 w-48 bg-white/20 rounded-full animate-pulse mb-6" />
            <div className="h-12 w-96 bg-white/20 rounded-xl animate-pulse mb-4" />
            <div className="h-6 w-80 bg-white/10 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (notFound || !program) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Program Not Found
          </h1>
          <p className="text-gray-500 mb-6">
            The program you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            View All Programs
          </Link>
        </div>
      </div>
    );
  }

  const Icon = getIcon(program.icon);
  const features: string[] = (() => {
    try {
      return program.features ? JSON.parse(program.features) : [];
    } catch {
      return [];
    }
  })();
  const impacts: { label: string; value: string }[] = (() => {
    try {
      return program.impacts ? JSON.parse(program.impacts) : [];
    } catch {
      return [];
    }
  })();

  const otherPrograms = allPrograms.filter((p) => p.slug !== program.slug);

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        <div className="absolute inset-0">
          {program.image ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={program.image}
                alt={program.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/80 via-emerald-800/75 to-teal-900/90" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900" />
          )}
        </div>

        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-16 right-16 w-80 h-80 border-2 border-white rounded-full" />
          <div className="absolute bottom-10 left-10 w-52 h-52 border-2 border-white rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Breadcrumb */}
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 text-emerald-200 hover:text-white text-sm mb-6 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              All Programs
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${program.color} flex items-center justify-center shadow-xl`}
              >
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                  {program.title}
                </h1>
              </div>
            </div>

            <p className="text-lg md:text-xl text-emerald-100 max-w-3xl">
              {program.shortDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left: Long description */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                    About This Program
                  </h2>
                  {program.longDescription.split("\n").map((paragraph, i) => (
                    <p key={i} className="text-gray-600 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </ScrollReveal>

              {/* Features */}
              {features.length > 0 && (
                <ScrollReveal delay={0.1}>
                  <div className="mt-12">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      Key Features
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {features.map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-3 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100"
                        >
                          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <span className="text-gray-700 text-sm font-medium">
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* Right: Sidebar */}
            <div className="lg:col-span-1">
              {/* Impact Stats */}
              {impacts.length > 0 && (
                <ScrollReveal>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                      Our Impact
                    </h3>
                    <div className="space-y-4">
                      {impacts.map((impact, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-3 border-b border-emerald-100 last:border-0"
                        >
                          <span className="text-sm text-gray-600">{impact.label}</span>
                          <span className="text-lg font-bold text-emerald-700">
                            {impact.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* CTA Card */}
              <ScrollReveal delay={0.15}>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
                  <div className="text-center">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${program.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Support This Program
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Help us expand our reach and impact more lives.
                    </p>
                    <div className="space-y-3">
                      <Link
                        href="/donate"
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        Donate Now
                      </Link>
                      <Link
                        href="/contact"
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-700 font-semibold rounded-full hover:bg-emerald-100 transition-colors"
                      >
                        <Users className="w-4 h-4" />
                        Volunteer
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Other Programs */}
      {otherPrograms.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                  Explore More
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Other <span className="gradient-text">Programs</span>
                </h2>
              </div>
            </ScrollReveal>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPrograms.slice(0, 3).map((p) => {
                const PIcon = getIcon(p.icon);
                return (
                  <StaggerItem key={p.id}>
                    <Link href={`/programs/${p.slug}`}>
                      <motion.div
                        whileHover={{ y: -5 }}
                        className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all h-full"
                      >
                        <div className="relative h-40 overflow-hidden bg-gray-100">
                          {p.image ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={p.image}
                                alt={p.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            </>
                          ) : (
                            <div
                              className={`w-full h-full bg-gradient-to-br ${p.color} opacity-15 flex items-center justify-center`}
                            >
                              <span className="text-5xl">{p.emoji}</span>
                            </div>
                          )}
                          <div className="absolute bottom-3 right-3 text-2xl">
                            {p.emoji}
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className={`w-8 h-8 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center`}
                            >
                              <PIcon className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                              {p.title}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {p.shortDescription}
                          </p>
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 mt-3">
                            Learn More
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </motion.div>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </section>
      )}
    </div>
  );
}
