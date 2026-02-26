"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Calendar,
  TrendingUp,
  ChevronRight,
  Clock,
  Loader2,
  Target,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  MapPin,
  Gift,
  Sparkles,
  User,
  HandHeart,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

/* ───────────── types ───────────── */
interface DashboardData {
  userName: string;
  stats: {
    totalDonated: number;
    eventsAttended: number;
    totalEvents: number;
    memberSince: number;
    donationCount: number;
    campaignsSupported: number;
    largestDonation: number;
    donationTrend: number;
  };
  milestone: {
    current: number;
    target: number;
    progress: number;
  };
  monthlyDonations: { month: string; amount: number }[];
  nextEvent: {
    id: number;
    title: string;
    date: string;
    time: string | null;
    location: string;
    category: string;
  } | null;
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
    category: string;
  }[];
  recentActivity: {
    id: string;
    type: "donation" | "event";
    title: string;
    description: string;
    date: string;
    amount?: number;
  }[];
}

/* ───────────── helpers ───────────── */
const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatShortDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatShortDate(dateStr);
}

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-0.5">{label}</p>
      <p className="text-emerald-600 font-bold">
        GH₵{Number(payload[0].value || 0).toLocaleString()}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
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
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-400">
        <p className="text-lg font-medium mb-2">Unable to load dashboard</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-emerald-600 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const { stats, milestone, monthlyDonations, nextEvent, recentDonations, upcomingEvents, recentActivity } = data;

  const statCards = [
    {
      label: "Total Donated",
      value: `GH₵${stats.totalDonated.toLocaleString()}`,
      icon: Wallet,
      gradient: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      trend: stats.donationTrend,
    },
    {
      label: "Events Joined",
      value: stats.totalEvents.toString(),
      icon: Calendar,
      gradient: "from-blue-500 to-indigo-600",
      bg: "bg-blue-50",
      text: "text-blue-700",
      sub: `${stats.eventsAttended} attended`,
    },
    {
      label: "Campaigns Supported",
      value: stats.campaignsSupported.toString(),
      icon: Target,
      gradient: "from-violet-500 to-purple-600",
      bg: "bg-violet-50",
      text: "text-violet-700",
    },
    {
      label: "Largest Gift",
      value: stats.largestDonation > 0 ? `GH₵${stats.largestDonation.toLocaleString()}` : "—",
      icon: Award,
      gradient: "from-amber-500 to-orange-600",
      bg: "bg-amber-50",
      text: "text-amber-700",
    },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* ── Welcome Banner ── */}
      <motion.div variants={fadeUp} className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-6 md:p-8 text-white">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-16 -left-10 w-56 h-56 bg-white/5 rounded-full blur-2xl" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-emerald-200 text-sm font-medium mb-1">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {data.userName}! 👋
            </h1>
            <p className="text-emerald-100 text-sm md:text-base max-w-lg">
              {stats.totalDonated > 0
                ? `You've contributed GH₵${stats.totalDonated.toLocaleString()} across ${stats.donationCount} donation${stats.donationCount !== 1 ? "s" : ""} and joined ${stats.totalEvents} event${stats.totalEvents !== 1 ? "s" : ""}. Your generosity matters!`
                : "Start your impact journey by making a donation or registering for an event!"}
            </p>
          </div>
          <Link href="/portal/donate" className="hidden sm:flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors flex-shrink-0">
            <Gift className="w-4 h-4" />
            Donate Now
          </Link>
        </div>
      </motion.div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              variants={fadeUp}
              className="group bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${card.text}`} />
                </div>
                {card.trend !== undefined && card.trend !== 0 && (
                  <span
                    className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${
                      card.trend > 0
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    {card.trend > 0 ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {Math.abs(card.trend)}%
                  </span>
                )}
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {card.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{card.label}</p>
              {card.sub && (
                <p className="text-[11px] text-gray-400 mt-0.5">{card.sub}</p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ── Milestone + Next Event Row ── */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Donation Milestone */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm">Donation Milestone</h2>
              <p className="text-xs text-gray-500">
                {milestone.progress >= 100
                  ? "Milestone reached! 🎉"
                  : `GH₵${(milestone.target - milestone.current).toLocaleString()} to go`}
              </p>
            </div>
          </div>
          <div className="flex items-end justify-between mb-2">
            <span className="text-2xl font-bold text-gray-900">
              GH₵{milestone.current.toLocaleString()}
            </span>
            <span className="text-sm text-gray-400 font-medium">
              / GH₵{milestone.target.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-3">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(milestone.progress, 100)}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{Math.round(milestone.progress)}% complete</span>
            <Link
              href="/portal/donate"
              className="text-emerald-600 font-semibold hover:underline flex items-center gap-1"
            >
              Donate more <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>

        {/* Next Event Highlight */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm">Next Event</h2>
              <p className="text-xs text-gray-500">
                {nextEvent ? "Coming up soon" : "No upcoming events"}
              </p>
            </div>
          </div>
          {nextEvent ? (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {nextEvent.title}
              </h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>
                    {formatDate(nextEvent.date)}
                    {nextEvent.time && ` at ${nextEvent.time}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{nextEvent.location}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">
                  {daysUntil(nextEvent.date) === 0
                    ? "Today!"
                    : daysUntil(nextEvent.date) === 1
                      ? "Tomorrow!"
                      : `In ${daysUntil(nextEvent.date)} days`}
                </div>
                <Link
                  href="/portal/events"
                  className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
                >
                  All Events <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-400 mb-3">
                No events on your calendar
              </p>
              <Link
                href="/portal/events"
                className="text-sm text-blue-600 font-semibold hover:underline"
              >
                Browse & register for events
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Monthly Donations Chart ── */}
      <motion.div variants={fadeUp} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm">Giving Trend</h2>
              <p className="text-xs text-gray-500">Last 6 months</p>
            </div>
          </div>
          <Link
            href="/portal/donations"
            className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-1"
          >
            Details <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        {monthlyDonations.some((m) => m.amount > 0) ? (
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyDonations} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => v === 0 ? "0" : `${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f0fdf4" }} />
                <Bar dataKey="amount" fill="url(#barGradient)" radius={[6, 6, 0, 0]} maxBarSize={36} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            <TrendingUp className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No donation history yet</p>
            <Link
              href="/portal/donate"
              className="inline-block mt-2 text-sm text-emerald-600 font-semibold hover:underline"
            >
              Make your first donation
            </Link>
          </div>
        )}
      </motion.div>

      {/* ── Recent Donations + Upcoming Events ── */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Donations */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 sm:p-6 pb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-emerald-500" />
              <h2 className="font-bold text-gray-900">Recent Donations</h2>
            </div>
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
                <Heart className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No donations yet</p>
                <Link
                  href="/portal/donate"
                  className="inline-block mt-3 text-sm text-emerald-600 font-semibold hover:underline"
                >
                  Make your first donation
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {recentDonations.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <HandHeart className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {d.campaign}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(d.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-600">
                        GH₵{d.amount.toLocaleString()}
                      </p>
                      <span className="text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full capitalize">
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
        <motion.div variants={fadeUp} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 sm:p-6 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <h2 className="font-bold text-gray-900">Registered Events</h2>
            </div>
            <Link
              href="/portal/events"
              className="text-sm text-blue-600 font-semibold flex items-center gap-1 hover:underline"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="px-5 sm:px-6 pb-5 sm:pb-6">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Calendar className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No upcoming events</p>
                <Link
                  href="/portal/events"
                  className="inline-block mt-3 text-sm text-blue-600 font-semibold hover:underline"
                >
                  Browse events
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {upcomingEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-blue-600 uppercase leading-none">
                        {new Date(ev.date).toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="text-lg font-bold text-blue-700 leading-none mt-0.5">
                        {new Date(ev.date).getDate()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {ev.title}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{ev.location}</span>
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                      {daysUntil(ev.date) === 0
                        ? "Today"
                        : daysUntil(ev.date) === 1
                          ? "Tomorrow"
                          : `${daysUntil(ev.date)}d`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Activity Feed ── */}
      {recentActivity.length > 0 && (
        <motion.div variants={fadeUp} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm">Recent Activity</h2>
              <p className="text-xs text-gray-500">Your latest actions</p>
            </div>
          </div>
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[17px] top-2 bottom-2 w-px bg-gray-100" />
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 relative">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      activity.type === "donation"
                        ? "bg-emerald-100"
                        : "bg-blue-100"
                    }`}
                  >
                    {activity.type === "donation" ? (
                      <Heart className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Calendar className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {activity.description}
                        </p>
                      </div>
                      <span className="text-[11px] text-gray-400 whitespace-nowrap flex-shrink-0">
                        {timeAgo(activity.date)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Quick Actions ── */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: "Make a Donation",
            href: "/portal/donate",
            icon: Heart,
            gradient: "from-emerald-500 to-teal-500",
            shadow: "shadow-emerald-500/20",
          },
          {
            label: "Browse Events",
            href: "/portal/events",
            icon: Calendar,
            gradient: "from-blue-500 to-indigo-500",
            shadow: "shadow-blue-500/20",
          },
          {
            label: "Update Profile",
            href: "/portal/profile",
            icon: User,
            gradient: "from-violet-500 to-purple-500",
            shadow: "shadow-violet-500/20",
          },
          {
            label: "View Impact",
            href: "/portal/donations",
            icon: TrendingUp,
            gradient: "from-amber-500 to-orange-500",
            shadow: "shadow-amber-500/20",
          },
        ].map((action) => (
          <Link key={action.label} href={action.href}>
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-gradient-to-br ${action.gradient} rounded-2xl p-4 sm:p-5 text-white text-center shadow-lg ${action.shadow} cursor-pointer relative overflow-hidden`}
            >
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
              <action.icon className="w-6 h-6 mx-auto mb-2 relative z-10" />
              <p className="text-xs sm:text-sm font-semibold relative z-10">{action.label}</p>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* ── Member Since Footer ── */}
      <motion.div variants={fadeUp} className="text-center pb-2">
        <p className="text-xs text-gray-400">
          Member since {stats.memberSince} • Thank you for being part of ZHHF! 💚
        </p>
      </motion.div>
    </motion.div>
  );
}
