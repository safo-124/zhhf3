"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Heart,
  Calendar,
  User,
  Settings,
  LogOut,
  TrendingUp,
  Gift,
  Bell,
  ChevronRight,
  Clock,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Total Donated", value: "$1,250", icon: Heart, color: "bg-emerald-100 text-emerald-600" },
  { label: "Events Attended", value: "8", icon: Calendar, color: "bg-blue-100 text-blue-600" },
  { label: "Impact Score", value: "92", icon: TrendingUp, color: "bg-violet-100 text-violet-600" },
  { label: "Member Since", value: "2023", icon: Clock, color: "bg-amber-100 text-amber-600" },
];

const recentDonations = [
  { date: "Jan 15, 2025", amount: 100, campaign: "Clean Water Project", status: "Completed" },
  { date: "Dec 20, 2024", amount: 250, campaign: "Education Fund", status: "Completed" },
  { date: "Nov 10, 2024", amount: 50, campaign: "Food Drive 2024", status: "Completed" },
];

const upcomingEvents = [
  { title: "Annual Charity Gala 2025", date: "Mar 20, 2025", location: "Grand Ballroom, Accra" },
  { title: "Community Health Camp", date: "Apr 5, 2025", location: "Kumasi Community Center" },
];

const sidebarLinks = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard, active: true },
  { href: "/portal/donations", label: "My Donations", icon: Gift },
  { href: "/portal/events", label: "My Events", icon: Calendar },
  { href: "/portal/profile", label: "Profile", icon: User },
  { href: "/portal/settings", label: "Settings", icon: Settings },
];

export default function PortalDashboard() {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-28">
              {/* Profile Header */}
              <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-500 text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mb-3 border-2 border-white/30">
                  JD
                </div>
                <h3 className="font-bold">John Doe</h3>
                <p className="text-emerald-100 text-sm">Member</p>
              </div>

              {/* Nav Links */}
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
            {/* Welcome Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-6 md:p-8 text-white mb-8"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    Welcome back, John! 👋
                  </h1>
                  <p className="text-emerald-100">
                    Your generosity has helped 45 families this year. Keep making
                    an impact!
                  </p>
                </div>
                <button className="relative p-2">
                  <Bell className="w-6 h-6 text-white" />
                  <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                </button>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}
                  >
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Donations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between p-6 pb-3">
                  <h2 className="font-bold text-gray-900">
                    Recent Donations
                  </h2>
                  <Link
                    href="/portal/donations"
                    className="text-sm text-emerald-600 font-semibold flex items-center gap-1 hover:underline"
                  >
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="px-6 pb-6">
                  <div className="space-y-3">
                    {recentDonations.map((d, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {d.campaign}
                          </p>
                          <p className="text-xs text-gray-500">{d.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-emerald-600">
                            ${d.amount}
                          </p>
                          <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full">
                            {d.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Upcoming Events */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between p-6 pb-3">
                  <h2 className="font-bold text-gray-900">
                    Registered Events
                  </h2>
                  <Link
                    href="/portal/events"
                    className="text-sm text-emerald-600 font-semibold flex items-center gap-1 hover:underline"
                  >
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="px-6 pb-6">
                  <div className="space-y-3">
                    {upcomingEvents.map((ev, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 py-3 border-b border-gray-50 last:border-0"
                      >
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {ev.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {ev.date} • {ev.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { label: "Make a Donation", href: "/donate", icon: Heart, color: "from-emerald-500 to-teal-500" },
                { label: "Browse Events", href: "/events", icon: Calendar, color: "from-blue-500 to-indigo-500" },
                { label: "Update Profile", href: "/portal/profile", icon: User, color: "from-violet-500 to-purple-500" },
                { label: "View Impact", href: "/portal/donations", icon: TrendingUp, color: "from-amber-500 to-orange-500" },
              ].map((action) => (
                <Link key={action.label} href={action.href}>
                  <motion.div
                    whileHover={{ y: -3, scale: 1.02 }}
                    className={`bg-gradient-to-br ${action.color} rounded-2xl p-5 text-white text-center shadow-lg cursor-pointer`}
                  >
                    <action.icon className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-sm font-semibold">{action.label}</p>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
