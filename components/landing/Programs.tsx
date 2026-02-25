"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  GraduationCap,
  HeartPulse,
  Home,
  Utensils,
  Droplets,
  ArrowRight,
} from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";
import { StaggerContainer, StaggerItem } from "../ui/StaggerContainer";

interface GalleryImage {
  id: number;
  url: string;
  caption: string | null;
  category: string | null;
}

const programs = [
  {
    icon: GraduationCap,
    title: "Education",
    description:
      "Providing scholarships, school supplies, and learning resources to underprivileged children to ensure they get quality education.",
    emoji: "🎓",
    color: "from-emerald-500 to-green-600",
    bgAccent: "bg-emerald-50",
    galleryCategory: "Education",
  },
  {
    icon: HeartPulse,
    title: "Healthcare",
    description:
      "Free medical camps, health education, and access to essential medicines for remote and underserved communities.",
    emoji: "🏥",
    color: "from-rose-500 to-red-600",
    bgAccent: "bg-rose-50",
    galleryCategory: "Healthcare",
  },
  {
    icon: Home,
    title: "Housing",
    description:
      "Building safe, sustainable homes for families in need, providing shelter and a foundation for a better future.",
    emoji: "🏠",
    color: "from-amber-500 to-orange-600",
    bgAccent: "bg-amber-50",
    galleryCategory: "Community",
  },
  {
    icon: Utensils,
    title: "Food Security",
    description:
      "Community kitchens, food banks, and nutritional programs that ensure no family goes hungry in our communities.",
    emoji: "🍽️",
    color: "from-violet-500 to-purple-600",
    bgAccent: "bg-violet-50",
    galleryCategory: "Volunteers",
  },
  {
    icon: Droplets,
    title: "Clean Water",
    description:
      "Installing wells, water purification systems, and promoting water conservation for sustainable access.",
    emoji: "💧",
    color: "from-blue-500 to-cyan-600",
    bgAccent: "bg-blue-50",
    galleryCategory: "Impact",
  },
  {
    icon: GraduationCap,
    title: "Skills Training",
    description:
      "Vocational training and entrepreneurship programs that equip individuals with skills for self-sufficiency.",
    emoji: "🛠️",
    color: "from-teal-500 to-emerald-600",
    bgAccent: "bg-teal-50",
    galleryCategory: "Events",
  },
];

export default function Programs() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  const fetchGallery = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        setGalleryImages(data);
      }
    } catch {
      // silent — fallback to emoji-only cards
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  // Map each program to a gallery image by its mapped category, fall back to any image
  const getImageForProgram = (program: (typeof programs)[0], index: number): string | null => {
    // First try matching category
    const categoryMatch = galleryImages.find(
      (img) => img.category?.toLowerCase() === program.galleryCategory.toLowerCase()
    );
    if (categoryMatch) return categoryMatch.url;

    // Fall back to any gallery image by index
    if (galleryImages.length > 0) {
      return galleryImages[index % galleryImages.length].url;
    }

    return null;
  };

  return (
    <section className="relative py-20 md:py-28 bg-white overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full translate-x-48 -translate-y-48 blur-3xl opacity-60" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
              What We Do
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Programs That Create{" "}
              <span className="gradient-text">Real Change</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive programs address the most pressing needs of
              communities, creating sustainable impact that lasts generations.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {programs.map((program, index) => {
            const imageUrl = getImageForProgram(program, index);

            return (
              <StaggerItem key={program.title}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-200 transition-all duration-500 h-full flex flex-col"
                >
                  {/* Image area */}
                  <div className="relative h-48 md:h-52 overflow-hidden bg-gray-100">
                    {imageUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageUrl}
                          alt={program.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        {/* Gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent`} />
                        {/* Category badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${program.color} shadow-lg backdrop-blur-sm`}>
                            <program.icon className="w-3.5 h-3.5" />
                            {program.title}
                          </span>
                        </div>
                        {/* Emoji floating in corner */}
                        <div className="absolute bottom-3 right-3 text-3xl drop-shadow-lg group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500">
                          {program.emoji}
                        </div>
                      </>
                    ) : (
                      /* Fallback when no gallery image available */
                      <div className={`w-full h-full bg-gradient-to-br ${program.color} opacity-10 flex items-center justify-center`}>
                        <div className="text-center">
                          <span className="text-6xl">{program.emoji}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Top gradient bar */}
                  <div
                    className={`h-1 bg-gradient-to-r ${program.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                  />

                  <div className="p-6 md:p-7 flex flex-col flex-1">
                    {/* Icon */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                      >
                        <program.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                        {program.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-5 flex-1">
                      {program.description}
                    </p>

                    <Link
                      href={`/programs`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 group/link"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
