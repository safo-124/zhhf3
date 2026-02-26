"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Calendar,
  User,
  TrendingUp,
  Bell,
  ChevronRight,
  Clock,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface DashboardData {
  stats: {
    totalDonated: number;
    eventsAttended: number;
    totalEvents: number;
    memberSince: number;
    donationCount: number;
  };
  recentDonations: {
    id: number;
    date: string;
    amount: number;
    currency: string;
    campaign: string;
    status: string;
  }[];
  upcomingEvents: {
    id: number;
    title: string;
    date: string;
    time: string | null;
    location: string;
  }[];
}

export default function PortalDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portal/dashboard")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const stats = [
    {
      label: "Total Donated",
      value: data ? `GH₵${data.stats.totalDonated.toLocaleString()}` : "GH₵0",
      icon: Heart,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Events Attended",
      value: data?.stats.eventsAttended?.toString() || "0",
      icon: Calendar,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Donations",
      value: data?.stats.donationCount?.toString() || "0",
      icon: TrendingUp,
      color: "bg-violet-100 text-violet-600",
    },
    {
      label: "Member Since",
      value: data?.stats.memberSince?.toString() || new Date().getFullYear().toString(),
      icon: Clock,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  const recentDonations = data?.recentDonations || [];
  const upcomingEvents = data?.upcomingEvents || [];

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <>
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-6 md:p-8 text-white mb-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-emerald-100">
              {data && data.stats.totalDonated > 0
                ? `You've donated GH₵${data.stats.totalDonated.toLocaleString()} and attended ${data.stats.eventsAttended} events. Keep making an impact!`
                : "Start your journey by making a donation or joining an event!"}
            </p>
          </div>
          <button className="relative p-2 hidden sm:block">
            <Bell className="w-6 h-6 text-white" />
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100"
          >
            <div
              className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
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
          <div className="flex items-center justify-between p-5 sm:p-6 pb-3">
            <h2 className="font-bold text-gray-900">Recent Donations</h2>
            <Link
              href="/portal/donations"
              className="text-sm text-emerald-600 font-semibold flex items-center gap-1 hover:underline"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="px-5 sm:px-6 pb-5 sm:pb-6">
            {recentDonations.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Heart className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No donations yet</p>
                <Link
                  href="/portal/donate"
                  className="inline-block mt-3 text-sm text-emerald-600 font-semibold hover:underline"
                >
                  Make your first donation
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentDonations.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {d.campaign}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(d.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-600">
                        GH₵{d.amount.toLocaleString()}
                      </p>
                      <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full capitalize">
                        {d.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between p-5 sm:p-6 pb-3">
            <h2 className="font-bold text-gray-900">Registered Events</h2>
            <Link
              href="/portal/events"
              className="text-sm text-emerald-600 font-semibold flex items-center gap-1 hover:underline"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="px-5 sm:px-6 pb-5 sm:pb-6">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No upcoming events</p>
                <Link
                  href="/events"
                  className="inline-block mt-3 text-sm text-emerald-600 font-semibold hover:underline"
                >
                  Browse events
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((ev) => (
                  <div
                    key={ev.id}
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
                        {formatDate(ev.date)} • {ev.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
      >
        {[
          { label: "Make a Donation", href: "/portal/donate", icon: Heart, color: "from-emerald-500 to-teal-500" },
          { label: "Browse Events", href: "/events", icon: Calendar, color: "from-blue-500 to-indigo-500" },
          { label: "Update Profile", href: "/portal/profile", icon: User, color: "from-violet-500 to-purple-500" },
          { label: "View Impact", href: "/portal/donations", icon: TrendingUp, color: "from-amber-500 to-orange-500" },
        ].map((action) => (
          <Link key={action.label} href={action.href}>
            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              className={`bg-gradient-to-br ${action.color} rounded-2xl p-4 sm:p-5 text-white text-center shadow-lg cursor-pointer`}
            >
              <action.icon className="w-6 h-6 mx-auto mb-2" />
              <p className="text-xs sm:text-sm font-semibold">{action.label}</p>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </>
  );
}
