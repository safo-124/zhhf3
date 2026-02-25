"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  LayoutDashboard,
  Gift,
  User,
  Settings,
  LogOut,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";

const sidebarLinks = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/donations", label: "My Donations", icon: Gift },
  { href: "/portal/events", label: "My Events", icon: Calendar, active: true },
  { href: "/portal/profile", label: "Profile", icon: User },
  { href: "/portal/settings", label: "Settings", icon: Settings },
];

const registeredEvents = [
  {
    id: 1,
    title: "Annual Charity Gala 2025",
    date: "Mar 20, 2025",
    time: "6:00 PM - 10:00 PM",
    location: "Grand Ballroom, Accra",
    status: "Upcoming",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    id: 2,
    title: "Community Health Camp",
    date: "Apr 5, 2025",
    time: "8:00 AM - 4:00 PM",
    location: "Kumasi Community Center",
    status: "Upcoming",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    title: "Christmas Outreach 2024",
    date: "Dec 20, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "Multiple Locations",
    status: "Attended",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    id: 4,
    title: "Volunteer Training Workshop",
    date: "Nov 15, 2024",
    time: "10:00 AM - 2:00 PM",
    location: "ZHHF Training Center",
    status: "Attended",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    id: 5,
    title: "Food Drive September 2024",
    date: "Sep 28, 2024",
    time: "7:00 AM - 3:00 PM",
    location: "Accra Mall Grounds",
    status: "Missed",
    gradient: "from-amber-500 to-orange-500",
  },
];

export default function MyEventsPage() {
  const upcoming = registeredEvents.filter((e) => e.status === "Upcoming");
  const past = registeredEvents.filter((e) => e.status !== "Upcoming");

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-28">
              <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-500 text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mb-3 border-2 border-white/30">
                  JD
                </div>
                <h3 className="font-bold">John Doe</h3>
                <p className="text-emerald-100 text-sm">Member</p>
              </div>
              <nav className="p-3">
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors mb-1 ${
                      link.active
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                ))}
                <hr className="my-2" />
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full">
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
                <Link
                  href="/events"
                  className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Browse Events
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {registeredEvents.length}
                  </p>
                  <p className="text-xs text-gray-500">Total Registered</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                  <p className="text-2xl font-bold text-emerald-600">
                    {upcoming.length}
                  </p>
                  <p className="text-xs text-gray-500">Upcoming</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {past.filter((e) => e.status === "Attended").length}
                  </p>
                  <p className="text-xs text-gray-500">Attended</p>
                </div>
              </div>

              {/* Upcoming Events */}
              {upcoming.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Upcoming Events
                  </h2>
                  <div className="space-y-4">
                    {upcoming.map((event) => (
                      <motion.div
                        key={event.id}
                        whileHover={{ x: 4 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex"
                      >
                        <div
                          className={`w-2 bg-gradient-to-b ${event.gradient} flex-shrink-0`}
                        />
                        <div className="p-5 flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-gray-900">
                                {event.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4 text-emerald-500" />
                                  {event.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4 text-emerald-500" />
                                  {event.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4 text-emerald-500" />
                                  {event.location}
                                </span>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                              {event.status}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Past Events */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Past Events
                </h2>
                <div className="space-y-4">
                  {past.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex opacity-80"
                    >
                      <div
                        className={`w-2 bg-gradient-to-b ${event.gradient} flex-shrink-0`}
                      />
                      <div className="p-5 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {event.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {event.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {event.location}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${
                              event.status === "Attended"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-red-50 text-red-500"
                            }`}
                          >
                            {event.status === "Attended" ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            {event.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
