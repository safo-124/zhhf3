"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star, Loader2 } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

interface TestimonialData {
  id: number;
  name: string;
  role: string | null;
  content: string;
  image: string | null;
  featured: boolean;
}

const avatarColors = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-teal-500",
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const next = () =>
    setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-emerald-50/50 to-white">
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-emerald-50/50 to-white overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-emerald-100/50 rounded-full -translate-x-36 -translate-y-36 blur-3xl" />
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-teal-50 rounded-full translate-x-32 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Stories of{" "}
              <span className="gradient-text">Hope & Impact</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from the people whose lives have been touched by our work.
            </p>
          </div>
        </ScrollReveal>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="relative bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-emerald-500/5 border border-emerald-100"
              >
                {/* Quote icon */}
                <div className="absolute -top-5 left-8 md:left-12 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Quote className="w-5 h-5 text-white" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 italic">
                  &ldquo;{testimonials[current].content}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full ${
                      avatarColors[current % avatarColors.length]
                    } flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {testimonials[current].name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonials[current].name}
                    </p>
                    {testimonials[current].role && (
                      <p className="text-sm text-gray-500">
                        {testimonials[current].role}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prev}
                className="w-12 h-12 rounded-full bg-white shadow-lg border border-emerald-100 flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:border-emerald-300 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === current
                        ? "w-8 bg-emerald-500"
                        : "w-2.5 bg-gray-300 hover:bg-emerald-300"
                    }`}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={next}
                className="w-12 h-12 rounded-full bg-white shadow-lg border border-emerald-100 flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:border-emerald-300 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
