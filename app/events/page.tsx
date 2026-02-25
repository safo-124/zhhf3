"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Search,
  Filter,
  Heart,
  Sparkles,
  HandHeart,
} from "lucide-react";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerContainer";

type Category = "All" | "Community" | "Fundraiser" | "Outreach" | "Workshop" | "Health" | "Education";

const categories: Category[] = [
  "All",
  "Community",
  "Fundraiser",
  "Outreach",
  "Workshop",
  "Health",
  "Education",
];

interface EventData {
  id: number;
  title: string;
  description: string;
  date: string;
  endDate: string | null;
  time: string | null;
  location: string;
  category: string;
  image: string | null;
  capacity: number | null;
  featured: boolean;
  _count?: { registrations: number };
}

const gradients = [
  "from-emerald-500 to-teal-500",
  "from-blue-500 to-cyan-500",
  "from-violet-500 to-purple-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-teal-500 to-emerald-500",
  "from-indigo-500 to-blue-500",
];

export default function EventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const now = new Date();

  const upcomingEvents = events.filter((e) => new Date(e.date) >= now);
  const pastEvents = events.filter((e) => new Date(e.date) < now);

  const filtered = upcomingEvents.filter((event) => {
    const matchesCategory =
      activeCategory === "All" || event.category === activeCategory;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featured = upcomingEvents.filter((e) => e.featured);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDateParts = (date: string) => {
    const d = new Date(date);
    return {
      day: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      year: d.getFullYear(),
    };
  };

  return (
    <div>
      {/* Hero — extended behind navbar */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-16 right-16 w-80 h-80 border-2 border-white rounded-full" />
          <div className="absolute bottom-16 left-16 w-60 h-60 border-2 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-40 h-40 border border-white/50 rounded-full" />
        </div>

        {/* Floating icons */}
        <motion.div
          className="absolute top-28 left-[12%] text-4xl opacity-20"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          📅
        </motion.div>
        <motion.div
          className="absolute top-36 right-[18%] text-4xl opacity-20"
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        >
          🎉
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-emerald-100 text-sm rounded-full border border-white/20 mb-6">
              <Calendar className="w-4 h-4" />
              Community Gatherings
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Upcoming <span className="text-emerald-300">Events</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto">
              Join us at our events and be part of the change. Every gathering
              is an opportunity to make an impact.
            </p>
          </motion.div>
        </div>
      </section>

      {loading ? (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      ) : events.length === 0 ? (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <Sparkles className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Events Yet</h3>
            <p className="text-gray-500">Check back soon for upcoming events!</p>
          </div>
        </section>
      ) : (
        <>
          {/* Featured Events */}
          {featured.length > 0 && (
            <section className="py-16 bg-white border-b border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ScrollReveal>
                  <div className="flex items-center gap-2 mb-8">
                    <Heart className="w-5 h-5 text-emerald-500" />
                    <h2 className="text-xl font-bold text-gray-900">
                      Featured Events
                    </h2>
                  </div>
                </ScrollReveal>
                <div className="grid md:grid-cols-2 gap-6">
                  {featured.map((event, i) => {
                    const dateParts = getDateParts(event.date);
                    const regs = event._count?.registrations ?? 0;
                    const spotsLeft = event.capacity ? Math.max(0, event.capacity - regs) : null;

                    return (
                      <ScrollReveal key={event.id} delay={i * 0.1}>
                        <motion.div
                          whileHover={{ y: -4 }}
                          className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100"
                        >
                          <div className="h-52 relative overflow-hidden">
                            {event.image ? (
                              <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={event.image}
                                  alt={event.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                              </>
                            ) : (
                              <div className={`w-full h-full bg-gradient-to-br ${gradients[i % gradients.length]}`}>
                                <div className="absolute inset-0 bg-black/20" />
                              </div>
                            )}
                            <div className="absolute top-4 left-4 flex gap-2">
                              <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full shadow">
                                ⭐ Featured
                              </span>
                              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30">
                                {event.category}
                              </span>
                            </div>
                            {/* Date badge */}
                            <div className="absolute bottom-4 right-4 bg-white rounded-xl p-2 text-center shadow-lg min-w-[60px]">
                              <span className="block text-xs font-bold text-emerald-600 uppercase">{dateParts.month}</span>
                              <span className="block text-2xl font-bold text-gray-900 leading-none">{dateParts.day}</span>
                            </div>
                            <div className="absolute bottom-4 left-4 right-20">
                              <h3 className="text-xl font-bold text-white drop-shadow-lg">
                                {event.title}
                              </h3>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-emerald-500" />
                                {event.time || "TBA"}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-emerald-500" />
                                {event.location}
                              </span>
                              {event.capacity && (
                                <span className="flex items-center gap-1.5">
                                  <Users className="w-4 h-4 text-emerald-500" />
                                  {regs}/{event.capacity}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {event.description}
                            </p>
                            <div className="flex items-center justify-between">
                              {spotsLeft !== null && (
                                <span className="text-xs text-emerald-600 font-semibold">
                                  {spotsLeft > 0 ? `${spotsLeft} spots left` : "Fully booked"}
                                </span>
                              )}
                              <Link
                                href="/contact"
                                className="text-sm text-emerald-600 font-semibold flex items-center gap-1 hover:text-emerald-700 transition-colors ml-auto"
                              >
                                Register <ArrowRight className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      </ScrollReveal>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* All Upcoming Events */}
          <section className="py-16 md:py-24 bg-gradient-to-b from-white to-emerald-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal>
                <div className="text-center mb-10">
                  <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                    Upcoming
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    All <span className="gradient-text">Events</span>
                  </h2>
                </div>
              </ScrollReveal>

              {/* Filters */}
              <ScrollReveal>
                <div className="flex flex-col md:flex-row gap-4 mb-10">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search events..."
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          activeCategory === cat
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                            : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Event Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory + searchQuery}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {filtered.length === 0 ? (
                    <div className="text-center py-16">
                      <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-400 mb-2">
                        No Events Found
                      </h3>
                      <p className="text-gray-400">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  ) : (
                    <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filtered.map((event, index) => {
                        const dateParts = getDateParts(event.date);
                        const regs = event._count?.registrations ?? 0;
                        const spotsLeft = event.capacity ? Math.max(0, event.capacity - regs) : null;

                        return (
                          <StaggerItem key={event.id}>
                            <motion.div
                              whileHover={{ y: -4 }}
                              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 h-full flex flex-col"
                            >
                              {/* Image / Gradient header */}
                              <div className="h-40 relative overflow-hidden">
                                {event.image ? (
                                  <>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={event.image}
                                      alt={event.title}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                  </>
                                ) : (
                                  <div className={`w-full h-full bg-gradient-to-br ${gradients[index % gradients.length]}`} />
                                )}
                                <span className="absolute top-3 right-3 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30">
                                  {event.category}
                                </span>
                                {/* Date chip */}
                                <div className="absolute top-3 left-3 bg-white rounded-lg px-2 py-1 text-center shadow-md">
                                  <span className="block text-[10px] font-bold text-emerald-600 uppercase">{dateParts.month}</span>
                                  <span className="block text-lg font-bold text-gray-900 leading-none">{dateParts.day}</span>
                                </div>
                              </div>
                              <div className="p-5 flex flex-col flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                  {event.title}
                                </h3>
                                <div className="space-y-2 text-sm text-gray-500 mb-3">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                    {formatDate(event.date)}
                                  </div>
                                  {event.time && (
                                    <div className="flex items-center gap-2">
                                      <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                      {event.time}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                    <span className="truncate">{event.location}</span>
                                  </div>
                                </div>
                                <p className="text-gray-600 text-sm flex-1 line-clamp-2 mb-4">
                                  {event.description}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                  <div className="flex items-center gap-2">
                                    {event.capacity && (
                                      <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <Users className="w-4 h-4" />
                                        <span>{regs}/{event.capacity}</span>
                                      </div>
                                    )}
                                    {spotsLeft !== null && spotsLeft <= 10 && spotsLeft > 0 && (
                                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                        {spotsLeft} left!
                                      </span>
                                    )}
                                  </div>
                                  <Link
                                    href="/contact"
                                    className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                                  >
                                    Register
                                  </Link>
                                </div>
                              </div>
                            </motion.div>
                          </StaggerItem>
                        );
                      })}
                    </StaggerContainer>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <section className="py-16 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ScrollReveal>
                  <div className="text-center mb-10">
                    <span className="inline-block px-4 py-1.5 bg-gray-200 text-gray-600 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                      Past Events
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      Events We&apos;ve Hosted
                    </h2>
                  </div>
                </ScrollReveal>

                <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.slice(0, 6).map((event, index) => {
                    const dateParts = getDateParts(event.date);
                    const regs = event._count?.registrations ?? 0;

                    return (
                      <StaggerItem key={event.id}>
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 opacity-80 hover:opacity-100 transition-opacity">
                          <div className="h-32 relative overflow-hidden">
                            {event.image ? (
                              <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={event.image}
                                  alt={event.title}
                                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-black/30" />
                              </>
                            ) : (
                              <div className={`w-full h-full bg-gradient-to-br ${gradients[index % gradients.length]} opacity-50`} />
                            )}
                            <span className="absolute top-3 left-3 px-3 py-1 bg-gray-800/70 text-white text-xs font-semibold rounded-full">
                              Completed
                            </span>
                            <div className="absolute top-3 right-3 bg-white rounded-lg px-2 py-1 text-center shadow-md">
                              <span className="block text-[10px] font-bold text-gray-500 uppercase">{dateParts.month}</span>
                              <span className="block text-lg font-bold text-gray-700 leading-none">{dateParts.day}</span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {event.location}
                              </span>
                              {event.capacity && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" /> {regs} attended
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>
              </div>
            </section>
          )}
        </>
      )}

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <HandHeart className="w-12 h-12 text-emerald-200 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Want to Host an Event?
            </h2>
            <p className="text-emerald-100 text-lg mb-8 max-w-lg mx-auto">
              Partner with us to organize community events that make a lasting
              impact. We&apos;d love to collaborate!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 font-bold rounded-full shadow-xl hover:shadow-2xl transition-all"
                >
                  Get in Touch
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/volunteer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-700/50 text-white font-bold rounded-full border border-white/20 hover:bg-emerald-700/70 transition-all"
                >
                  <Users className="w-5 h-5" />
                  Volunteer
                </Link>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
