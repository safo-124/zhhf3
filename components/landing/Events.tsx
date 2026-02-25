"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowRight, Loader2 } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";
import { StaggerContainer, StaggerItem } from "../ui/StaggerContainer";

interface EventData {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string | null;
  location: string;
  category: string;
}

const tagColors: Record<string, string> = {
  Community: "bg-emerald-100 text-emerald-700",
  Health: "bg-rose-100 text-rose-700",
  Education: "bg-blue-100 text-blue-700",
  Fundraiser: "bg-amber-100 text-amber-700",
  Workshop: "bg-violet-100 text-violet-700",
  Outreach: "bg-teal-100 text-teal-700",
};

export default function Events() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        // Only show upcoming events, max 3
        const upcoming = (Array.isArray(data) ? data : [])
          .filter((e: EventData) => new Date(e.date) >= new Date())
          .slice(0, 3);
        setEvents(upcoming);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-emerald-50/30 to-white">
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </section>
    );
  }

  if (events.length === 0) return null;

  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-emerald-50/30 to-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-4">
            <div>
              <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                Upcoming Events
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                Join Us &{" "}
                <span className="gradient-text">Make an Impact</span>
              </h2>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 group whitespace-nowrap"
            >
              View All Events
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-3 gap-6 md:gap-8">
          {events.map((event) => (
            <StaggerItem key={event.id}>
              <motion.div
                whileHover={{ y: -5 }}
                className="group h-full bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-200 transition-all duration-500"
              >
                {/* Date Header */}
                <div className="relative h-24 bg-gradient-to-r from-emerald-600 to-teal-500 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-white rounded-full" />
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 border-2 border-white rounded-full" />
                  </div>
                  <div className="text-center">
                    <Calendar className="w-5 h-5 text-emerald-200 mx-auto mb-1" />
                    <p className="text-white font-bold text-lg">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      tagColors[event.category] || "bg-gray-100 text-gray-700"
                    } mb-3`}
                  >
                    {event.category}
                  </span>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-500">
                    {event.time && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-500" />
                        {event.time}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      {event.location}
                    </div>
                  </div>

                  <Link
                    href="/events"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 group/link"
                  >
                    Register Now
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
