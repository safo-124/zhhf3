"use client";

import { motion } from "framer-motion";
import { Target, Eye, Gem } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";
import { StaggerContainer, StaggerItem } from "../ui/StaggerContainer";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To uplift underserved communities by providing essential resources, education, and sustainable programs that foster self-sufficiency and dignity.",
    gradient: "from-emerald-600 to-teal-600",
    decoration: "bg-emerald-100",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "A world where every individual has access to the basic necessities of life and the opportunity to reach their full potential, regardless of their circumstances.",
    gradient: "from-teal-600 to-cyan-600",
    decoration: "bg-teal-100",
  },
  {
    icon: Gem,
    title: "Our Values",
    description:
      "Compassion, transparency, integrity, and community-driven impact guide everything we do. We believe in empowering people, not creating dependency.",
    gradient: "from-cyan-600 to-emerald-600",
    decoration: "bg-cyan-100",
  },
];

export default function Mission() {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-white to-emerald-50/50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-100/30 rounded-full -translate-x-48 -translate-y-48 blur-3xl" />
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-teal-100/30 rounded-full translate-x-36 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
              Who We Are
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Driven by Purpose,{" "}
              <span className="gradient-text">Led by Heart</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              For over 15 years, ZHHF has been at the forefront of community
              transformation, touching lives and creating lasting impact.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-3 gap-6 md:gap-8">
          {values.map((item, index) => (
            <StaggerItem key={item.title}>
              <motion.div
                whileHover={{ y: -8, rotateY: 3 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group relative bg-white rounded-3xl p-8 md:p-10 shadow-lg shadow-gray-100 border border-gray-100 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-200 transition-all duration-500 h-full"
              >
                {/* Card number */}
                <span className="absolute top-6 right-6 text-6xl md:text-7xl font-bold text-gray-50 group-hover:text-emerald-50 transition-colors select-none">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Icon */}
                <div
                  className={`relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}
                >
                  <item.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="relative z-10 text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {item.title}
                </h3>
                <p className="relative z-10 text-gray-600 leading-relaxed">
                  {item.description}
                </p>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
