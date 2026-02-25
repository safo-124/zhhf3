"use client";

import { Users, Heart, Globe, Calendar } from "lucide-react";
import AnimatedCounter from "../ui/AnimatedCounter";
import ScrollReveal from "../ui/ScrollReveal";
import { StaggerContainer, StaggerItem } from "../ui/StaggerContainer";

const stats = [
  {
    icon: Users,
    value: 15000,
    suffix: "+",
    label: "Families Helped",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Heart,
    value: 2500,
    suffix: "+",
    label: "Active Volunteers",
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    icon: Globe,
    value: 45,
    suffix: "",
    label: "Communities Reached",
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Calendar,
    value: 15,
    suffix: "+",
    label: "Years of Service",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

export default function Stats() {
  return (
    <section className="relative py-20 md:py-28 bg-white overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
              Our Impact
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Numbers That{" "}
              <span className="gradient-text">Speak Volumes</span>
            </h2>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="group relative bg-white rounded-2xl p-6 md:p-8 shadow-lg shadow-gray-100 border border-gray-100 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-200 transition-all duration-500 text-center overflow-hidden">
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                <div className={`mx-auto w-14 h-14 md:w-16 md:h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className={`w-7 h-7 md:w-8 md:h-8 ${stat.iconColor}`} />
                </div>

                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>

                <p className="text-sm md:text-base text-gray-500 font-medium">
                  {stat.label}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
