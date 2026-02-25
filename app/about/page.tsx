"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Gem,
  Heart,
  Users,
  Globe,
  Award,
  Calendar,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerContainer";

interface AboutData {
  [key: string]: string;
}

const FALLBACK: AboutData = {
  about_hero_image: "",
  about_hero_badge: "Our Story",
  about_hero_title: "About Zion Helping",
  about_hero_highlight: "Hand Foundation",
  about_hero_subtitle: "For over 15 years, we've been extending hope, building communities, and transforming lives through compassionate action.",
  about_mission: "To uplift underserved communities by providing essential resources, education, and sustainable programs that foster self-sufficiency and dignity for all.",
  about_vision: "A world where every individual has access to the basic necessities of life and the opportunity to reach their full potential, regardless of circumstance.",
  about_values: "Compassion, transparency, integrity, and community-driven impact guide everything we do. We believe in empowering people, not creating dependency.",
  about_stat1_value: "15000",
  about_stat1_label: "Families Helped",
  about_stat2_value: "2500",
  about_stat2_label: "Volunteers",
  about_stat3_value: "45",
  about_stat3_label: "Communities",
  about_stat4_value: "15",
  about_stat4_label: "Years of Service",
  about_timeline: JSON.stringify([
    { year: "2010", title: "Founded", description: "ZHHF was established with a mission to serve communities in need." },
    { year: "2013", title: "First 1,000 Families", description: "Reached our first milestone by helping 1,000 families across 5 communities." },
    { year: "2016", title: "Education Program", description: "Launched scholarship and school supply programs for underserved children." },
    { year: "2019", title: "Healthcare Initiative", description: "Started free medical camps serving 10+ communities annually." },
    { year: "2022", title: "Clean Water Project", description: "Installed 50+ wells providing clean water to remote villages." },
    { year: "2025", title: "Global Expansion", description: "Extended operations to 45 communities across multiple regions." },
  ]),
  about_team: JSON.stringify([
    { name: "Rev. David Mensah", role: "Founder & CEO", avatar: "DM", color: "bg-emerald-500" },
    { name: "Grace Addo", role: "Operations Director", avatar: "GA", color: "bg-teal-500" },
    { name: "Samuel Osei", role: "Programs Manager", avatar: "SO", color: "bg-blue-500" },
    { name: "Esther Nkrumah", role: "Volunteer Coordinator", avatar: "EN", color: "bg-violet-500" },
    { name: "James Asante", role: "Finance Director", avatar: "JA", color: "bg-amber-500" },
    { name: "Abena Boateng", role: "Community Outreach", avatar: "AB", color: "bg-rose-500" },
  ]),
  about_cta_title: "Ready to Join Our Mission?",
  about_cta_subtitle: "Whether through volunteering, donating, or partnering with us—every action makes a difference.",
};

export default function AboutPage() {
  const [data, setData] = useState<AboutData>(FALLBACK);

  const fetchAbout = useCallback(async () => {
    try {
      const res = await fetch("/api/about");
      if (res.ok) {
        const settings: { key: string; value: string }[] = await res.json();
        const merged = { ...FALLBACK };
        settings.forEach((s) => {
          merged[s.key] = s.value;
        });
        setData(merged);
      }
    } catch {
      // fallback defaults
    }
  }, []);

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  const heroImage = data.about_hero_image || "";
  const timeline: { year: string; title: string; description: string }[] = (() => {
    try { return JSON.parse(data.about_timeline); } catch { return []; }
  })();
  const team: { name: string; role: string; avatar: string; color: string }[] = (() => {
    try { return JSON.parse(data.about_team); } catch { return []; }
  })();

  const stats = [
    { value: parseInt(data.about_stat1_value) || 0, suffix: "+", label: data.about_stat1_label, icon: Users },
    { value: parseInt(data.about_stat2_value) || 0, suffix: "+", label: data.about_stat2_label, icon: Heart },
    { value: parseInt(data.about_stat3_value) || 0, suffix: "", label: data.about_stat3_label, icon: Globe },
    { value: parseInt(data.about_stat4_value) || 0, suffix: "+", label: data.about_stat4_label, icon: Calendar },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        {/* Background Image with overlay */}
        <div className="absolute inset-0">
          {heroImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroImage} alt="About ZHHF" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/80 via-emerald-800/75 to-teal-900/85" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-teal-600" />
          )}
        </div>
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
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-emerald-100 text-sm rounded-full border border-white/20 mb-6">
              <Heart className="w-4 h-4" />
              {data.about_hero_badge}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {data.about_hero_title}{" "}
              <span className="text-emerald-300">{data.about_hero_highlight}</span>
            </h1>
            <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
              {data.about_hero_subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Our Mission",
                text: data.about_mission,
                gradient: "from-emerald-500 to-teal-500",
              },
              {
                icon: Eye,
                title: "Our Vision",
                text: data.about_vision,
                gradient: "from-teal-500 to-cyan-500",
              },
              {
                icon: Gem,
                title: "Our Values",
                text: data.about_values,
                gradient: "from-cyan-500 to-emerald-500",
              },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl hover:border-emerald-200 transition-all h-full"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.text}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <stat.icon className="w-8 h-8 text-emerald-200 mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-emerald-200 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-emerald-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                Our Journey
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Milestones That <span className="gradient-text">Define Us</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="relative">
            {/* Center line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-emerald-200 md:-translate-x-px" />

            {timeline.map((item, index) => (
              <ScrollReveal
                key={item.year}
                variant={index % 2 === 0 ? "fadeRight" : "fadeLeft"}
                delay={index * 0.1}
              >
                <div
                  className={`relative flex items-start mb-10 ${
                    index % 2 === 0
                      ? "md:flex-row"
                      : "md:flex-row-reverse"
                  }`}
                >
                  <div className="hidden md:block md:w-1/2" />
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white shadow-lg -translate-x-1/2 mt-1.5 z-10" />
                  <div className="ml-12 md:ml-0 md:w-1/2 md:px-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                      <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full mb-2">
                        {item.year}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                Leadership
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                The People <span className="gradient-text">Behind the Mission</span>
              </h2>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {team.map((person) => (
              <StaggerItem key={person.name}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all text-center"
                >
                  <div
                    className={`mx-auto w-20 h-20 rounded-2xl ${person.color} flex items-center justify-center text-white text-2xl font-bold mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    {person.avatar}
                  </div>
                  <h3 className="font-bold text-gray-900">{person.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{person.role}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <Award className="w-12 h-12 text-emerald-200 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {data.about_cta_title}
            </h2>
            <p className="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">
              {data.about_cta_subtitle}
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
              <Link
                href="/volunteer"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all justify-center"
              >
                Become a Volunteer
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
