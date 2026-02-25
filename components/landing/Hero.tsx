"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, ArrowRight, Play, ChevronDown } from "lucide-react";
import ParticleField from "../ui/ParticleField";

interface HeroImage {
  id: number;
  url: string;
  alt: string | null;
  sortOrder: number;
  active: boolean;
}

interface HomepageData {
  settings: Record<string, string>;
  heroImages: HeroImage[];
}

/* ── Animation configs for each floating image ── */
const FLOAT_CONFIGS = [
  // Position (% from edges), size, animation path, duration
  { top: "6%", left: "2%", size: "w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44", dur: 8, path: { y: [0, -20, 5, -10, 0], x: [0, 12, -6, 8, 0], rotate: [0, 5, -3, 4, 0] } },
  { top: "12%", right: "3%", size: "w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40", dur: 9, path: { y: [0, 15, -8, 12, 0], x: [0, -10, 6, -4, 0], rotate: [0, -4, 6, -2, 0] } },
  { bottom: "18%", right: "5%", size: "w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-36 lg:h-36", dur: 10, path: { y: [0, -12, 18, -6, 0], x: [0, 8, -12, 5, 0], rotate: [0, 3, -5, 2, 0] } },
  { bottom: "28%", left: "4%", size: "w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36", dur: 7, path: { y: [0, 10, -15, 8, 0], x: [0, -6, 10, -8, 0], rotate: [0, -6, 3, -4, 0] } },
  { top: "42%", left: "7%", size: "w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32", dur: 11, path: { y: [0, -18, 10, -14, 0], x: [0, 14, -8, 6, 0], rotate: [0, 4, -6, 5, 0] } },
  { top: "52%", right: "8%", size: "w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-32 lg:h-32", dur: 9.5, path: { y: [0, 14, -10, 6, 0], x: [0, -8, 12, -10, 0], rotate: [0, -3, 5, -4, 0] } },
  { top: "22%", left: "14%", size: "w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-32 lg:h-32", dur: 12, path: { y: [0, -8, 16, -12, 0], x: [0, 10, -14, 8, 0], rotate: [0, 6, -4, 3, 0] } },
  { bottom: "10%", right: "16%", size: "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28", dur: 8.5, path: { y: [0, 12, -8, 10, 0], x: [0, -12, 6, -8, 0], rotate: [0, -5, 4, -3, 0] } },
];

const FALLBACK = {
  hero_badge: "Transforming Lives Since 2010",
  hero_title_line1: "Extending",
  hero_title_highlight: "Hope",
  hero_title_line2: "to Every Hand",
  hero_subtitle:
    "Zion Helping Hand Foundation empowers communities through compassion, education, and sustainable development. Together, we build a brighter future for those in need.",
  hero_cta1_text: "Donate Now",
  hero_cta1_link: "/donate",
  hero_cta2_text: "Watch Our Story",
  hero_cta2_link: "/about",
  hero_trust1: "501(c)(3) Certified",
  hero_trust2: "4.9/5 Rating",
  hero_trust3: "10K+ Donors",
};

export default function Hero() {
  const [s, setS] = useState<Record<string, string>>(FALLBACK);
  const [images, setImages] = useState<HeroImage[]>([]);

  useEffect(() => {
    fetch("/api/homepage")
      .then((r) => r.json())
      .then((d: HomepageData) => {
        setS({ ...FALLBACK, ...d.settings });
        setImages(d.heroImages || []);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient wave-divider">
      {/* Particle Background */}
      <ParticleField count={40} />

      {/* Decorative circles */}
      <div className="absolute top-20 right-10 md:right-20 w-64 md:w-96 h-64 md:h-96 rounded-full border border-white/10 animate-spin-slow" />
      <div className="absolute bottom-20 left-5 md:left-10 w-48 md:w-72 h-48 md:h-72 rounded-full border border-white/5 animate-spin-slow" style={{ animationDirection: "reverse" }} />
      <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-emerald-300 rounded-full animate-float opacity-60" />
      <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-emerald-200 rounded-full animate-float-delayed opacity-40" />

      {/* ── Floating Hero Images ── */}
      {images.map((img, i) => {
        const cfg = FLOAT_CONFIGS[i % FLOAT_CONFIGS.length];
        const posStyle: React.CSSProperties = {};
        if (cfg.top) posStyle.top = cfg.top;
        if (cfg.bottom) posStyle.bottom = cfg.bottom;
        if (cfg.left) posStyle.left = cfg.left;
        if (cfg.right) posStyle.right = cfg.right;

        return (
          <motion.div
            key={img.id}
            className={`absolute ${cfg.size} rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl shadow-black/20 z-[5] pointer-events-none`}
            style={posStyle}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: [0, 0.85, 0.85, 0.85, 0.85],
              scale: [0.6, 1, 1, 1, 1],
              ...cfg.path,
            }}
            transition={{
              opacity: { duration: 1.5, delay: 0.3 + i * 0.25 },
              scale: { duration: 1.5, delay: 0.3 + i * 0.25 },
              y: { duration: cfg.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 },
              x: { duration: cfg.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 },
              rotate: { duration: cfg.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 },
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent z-10" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.alt || "Community impact"}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </motion.div>
        );
      })}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-emerald-100 text-xs md:text-sm font-medium rounded-full border border-white/20">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              {s.hero_badge}
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
          >
            {s.hero_title_line1}{" "}
            <span className="relative">
              <span className="relative z-10 text-emerald-300">{s.hero_title_highlight}</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute bottom-2 left-0 right-0 h-3 bg-emerald-400/20 -z-0 origin-left"
              />
            </span>{" "}
            <br className="hidden sm:block" />
            {s.hero_title_line2}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 text-base sm:text-lg md:text-xl text-emerald-100/90 max-w-2xl mx-auto leading-relaxed px-4"
          >
            {s.hero_subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={s.hero_cta1_link}
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 font-bold text-lg rounded-full shadow-2xl shadow-emerald-900/30 hover:shadow-emerald-900/50 transition-all duration-300 overflow-hidden w-full sm:w-auto justify-center"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                <Heart className="w-5 h-5 relative z-10 group-hover:text-red-500 transition-colors" />
                <span className="relative z-10">{s.hero_cta1_text}</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={s.hero_cta2_link}
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 w-full sm:w-auto justify-center"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {s.hero_cta2_text}
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-10 text-white/50 text-xs md:text-sm px-4"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-xs">✓</span>
              </div>
              <span>{s.hero_trust1}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-xs">★</span>
              </div>
              <span>{s.hero_trust2}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-xs">♥</span>
              </div>
              <span>{s.hero_trust3}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-white/40"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
