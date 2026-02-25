"use client";

import { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerContainer";

type Category = "All" | "Community" | "Fundraiser" | "Outreach" | "Workshop";

const categories: Category[] = [
  "All",
  "Community",
  "Fundraiser",
  "Outreach",
  "Workshop",
];

const events = [
  {
    id: 1,
    title: "Annual Charity Gala 2025",
    date: "2025-03-20",
    time: "6:00 PM - 10:00 PM",
    location: "Grand Ballroom, Accra",
    description: "Our premier fundraising event featuring live entertainment, auctions, and keynote speakers sharing impactful stories.",
    category: "Fundraiser" as Category,
    image: "from-emerald-500 to-teal-500",
    attendees: 250,
    spotsLeft: 30,
    featured: true,
  },
  {
    id: 2,
    title: "Community Health Camp",
    date: "2025-04-05",
    time: "8:00 AM - 4:00 PM",
    location: "Kumasi Community Center",
    description: "Free medical checkups, vaccinations, and health education workshops for community members.",
    category: "Outreach" as Category,
    image: "from-blue-500 to-cyan-500",
    attendees: 100,
    spotsLeft: 60,
    featured: false,
  },
  {
    id: 3,
    title: "Youth Skills Workshop",
    date: "2025-04-15",
    time: "9:00 AM - 3:00 PM",
    location: "ZHHF Training Center",
    description: "Empowering youth with practical skills in technology, entrepreneurship, and leadership development.",
    category: "Workshop" as Category,
    image: "from-violet-500 to-purple-500",
    attendees: 50,
    spotsLeft: 20,
    featured: false,
  },
  {
    id: 4,
    title: "Clean Water Awareness Walk",
    date: "2025-05-01",
    time: "7:00 AM - 12:00 PM",
    location: "Independence Square, Accra",
    description: "Join us for a 5K awareness walk to highlight the importance of clean water access in underserved communities.",
    category: "Community" as Category,
    image: "from-amber-500 to-orange-500",
    attendees: 500,
    spotsLeft: 200,
    featured: true,
  },
  {
    id: 5,
    title: "Volunteer Appreciation Dinner",
    date: "2025-05-18",
    time: "7:00 PM - 9:30 PM",
    location: "ZHHF Headquarters",
    description: "An evening to celebrate and honor our dedicated volunteers who make everything possible.",
    category: "Community" as Category,
    image: "from-rose-500 to-pink-500",
    attendees: 80,
    spotsLeft: 15,
    featured: false,
  },
  {
    id: 6,
    title: "Back to School Drive",
    date: "2025-06-10",
    time: "9:00 AM - 5:00 PM",
    location: "Multiple Locations",
    description: "Help us collect and distribute school supplies to ensure every child starts the year prepared.",
    category: "Outreach" as Category,
    image: "from-teal-500 to-emerald-500",
    attendees: 300,
    spotsLeft: 100,
    featured: false,
  },
];

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = events.filter((event) => {
    const matchesCategory =
      activeCategory === "All" || event.category === activeCategory;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featured = events.filter((e) => e.featured);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-gradient-to-r from-emerald-700 to-teal-600 overflow-hidden">
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
            <Calendar className="w-12 h-12 text-emerald-200 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Upcoming <span className="text-emerald-300">Events</span>
            </h1>
            <p className="text-lg text-emerald-100 max-w-xl mx-auto">
              Join us at our events and be part of the change. Every gathering
              is an opportunity to make an impact.
            </p>
          </motion.div>
        </div>
      </section>

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
              {featured.map((event, i) => (
                <ScrollReveal key={event.id} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100"
                  >
                    <div
                      className={`h-48 bg-gradient-to-br ${event.image} relative`}
                    >
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30">
                          Featured
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white">
                          {event.title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-emerald-500" />
                          {formatDate(event.date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-emerald-500" />
                          {event.location}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-emerald-600 font-semibold">
                          {event.spotsLeft} spots left
                        </span>
                        <motion.button
                          whileHover={{ x: 4 }}
                          className="text-sm text-emerald-600 font-semibold flex items-center gap-1"
                        >
                          Register <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Events */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-emerald-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  {filtered.map((event) => (
                    <StaggerItem key={event.id}>
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 h-full flex flex-col"
                      >
                        <div
                          className={`h-32 bg-gradient-to-br ${event.image} relative`}
                        >
                          <span className="absolute top-3 right-3 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30">
                            {event.category}
                          </span>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                            {event.title}
                          </h3>
                          <div className="space-y-2 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-emerald-500" />
                              {formatDate(event.date)}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-emerald-500" />
                              {event.time}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-emerald-500" />
                              {event.location}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm flex-1 line-clamp-2 mb-4">
                            {event.description}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Users className="w-4 h-4" />
                              {event.attendees - event.spotsLeft}/{event.attendees}
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-5 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                              Register
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-white mb-4">
              Want to Host an Event?
            </h2>
            <p className="text-emerald-100 mb-8 max-w-lg mx-auto">
              Partner with us to organize community events that make a lasting
              impact. We&apos;d love to collaborate!
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 font-bold rounded-full shadow-xl hover:shadow-2xl transition-all"
            >
              Get in Touch
              <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
