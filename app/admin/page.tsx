"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  DollarSign,
  Calendar,
  FileText,
  Heart,
  Mail,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ArrowUpRight,
  UserPlus,
  HandHeart,
  Activity,
  PieChart as PieIcon,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

interface DashStats {
  totalMembers: number;
  totalDonations: number;
  donationCount: number;
  activeEvents: number;
  blogPosts: number;
  volunteers: number;
  newsletters: number;
  recentMembers: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: string;
  }[];
  recentDonations: {
    id: string;
    amount: number;
    donorName: string | null;
    donorEmail: string;
    createdAt: string;
    campaign: { title: string } | null;
  }[];
  campaigns: {
    id: string;
    title: string;
    goal: number;
    raised: number;
    isActive: boolean;
  }[];
  monthlyTrend: { month: string; amount: number; count: number }[];
  donationBreakdown: { name: string; value: number; count: number }[];
  campaignDistribution: {
    name: string;
    value: number;
    goal: number;
    donations: number;
  }[];
}

const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function formatCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p: { name: string; value: number; color: string }, i: number) => (
        <p key={i} className="text-gray-600 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
          {p.name}: <span className="font-medium">${p.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) setStats(await res.json());
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
          </div>
          <p className="mt-4 text-gray-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <TrendingDown className="w-16 h-16 text-gray-300 mx-auto" />
          <p className="text-gray-500 text-lg">Failed to load dashboard</p>
          <button
            onClick={() => fetchStats()}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Revenue",
      value: formatCurrency(stats.totalDonations),
      sub: `${stats.donationCount} donations`,
      icon: DollarSign,
      gradient: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      href: "/admin/donations",
    },
    {
      label: "Members",
      value: stats.totalMembers,
      sub: "Registered users",
      icon: Users,
      gradient: "from-blue-500 to-indigo-600",
      bg: "bg-blue-50",
      text: "text-blue-700",
      href: "/admin/members",
    },
    {
      label: "Active Events",
      value: stats.activeEvents,
      sub: "Upcoming events",
      icon: Calendar,
      gradient: "from-violet-500 to-purple-600",
      bg: "bg-violet-50",
      text: "text-violet-700",
      href: "/admin/events",
    },
    {
      label: "Volunteers",
      value: stats.volunteers,
      sub: "Applications",
      icon: Heart,
      gradient: "from-rose-500 to-pink-600",
      bg: "bg-rose-50",
      text: "text-rose-700",
      href: "/admin/members",
    },
    {
      label: "Blog Posts",
      value: stats.blogPosts,
      sub: "Published & drafts",
      icon: FileText,
      gradient: "from-amber-500 to-orange-600",
      bg: "bg-amber-50",
      text: "text-amber-700",
      href: "/admin/content",
    },
    {
      label: "Subscribers",
      value: stats.newsletters,
      sub: "Newsletter signups",
      icon: Mail,
      gradient: "from-cyan-500 to-sky-600",
      bg: "bg-cyan-50",
      text: "text-cyan-700",
      href: "/admin/campaigns",
    },
  ];

  const avgDonation =
    stats.donationCount > 0
      ? stats.totalDonations / stats.donationCount
      : 0;

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Welcome back! Here&apos;s your overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 hidden sm:block">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm disabled:opacity-50 text-sm font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} variants={itemVariants}>
              <Link href={card.href}>
                <div className="group relative bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-pointer overflow-hidden">
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-[60px] bg-gradient-to-br ${card.gradient} opacity-[0.07] group-hover:opacity-[0.12] transition-opacity`} />
                  <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${card.text}`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{card.sub}</p>
                  <ArrowUpRight className="absolute bottom-4 right-4 w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donation Trend - Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
              <p className="text-sm text-gray-500">Monthly donation trends</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-gray-500">Revenue</span>
              </div>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  name="Revenue"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                  dot={false}
                  activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2, fill: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Donation Type Breakdown - Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <PieIcon className="w-5 h-5 text-gray-400" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Donation Types</h2>
              <p className="text-sm text-gray-500">One-time vs Monthly</p>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.donationBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.donationBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={((value: any) => [`$${Number(value || 0).toLocaleString()}`, ""]) as any}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {stats.donationBreakdown.map((item, i) => (
              <div key={item.name} className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <p className="text-lg font-bold text-gray-900">${item.value.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{item.count} donations</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Campaign Progress + Campaign Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Progress Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Campaign Progress</h2>
              <p className="text-sm text-gray-500">{stats.campaigns.length} active campaigns</p>
            </div>
            <Link
              href="/admin/campaigns"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-5">
            {stats.campaigns.map((campaign) => {
              const pct = Math.min((campaign.raised / campaign.goal) * 100, 100);
              return (
                <div key={campaign.id} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">{campaign.title}</span>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-xs text-gray-400">Raised: ${campaign.raised.toLocaleString()}</span>
                    <span className="text-xs text-gray-400">Goal: ${campaign.goal.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
            {stats.campaigns.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">No active campaigns</p>
            )}
          </div>
        </motion.div>

        {/* Campaign Distribution - Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Campaign Comparison</h2>
            <p className="text-sm text-gray-500">Raised vs Goal</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.campaignDistribution} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}`}
                />
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={((value: any, name: any) => [`$${Number(value || 0).toLocaleString()}`, name]) as any}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="value" name="Raised" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="goal" name="Goal" fill="#e5e7eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Average Donation</p>
              <p className="text-3xl font-bold mt-1">${avgDonation.toFixed(0)}</p>
              <p className="text-emerald-200 text-xs mt-1">per transaction</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Campaigns</p>
              <p className="text-3xl font-bold mt-1">{stats.campaignDistribution.length}</p>
              <p className="text-blue-200 text-xs mt-1">{stats.campaigns.length} currently active</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <HandHeart className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-violet-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-violet-100 text-sm font-medium">Engagement</p>
              <p className="text-3xl font-bold mt-1">
                {stats.volunteers + stats.newsletters}
              </p>
              <p className="text-violet-200 text-xs mt-1">
                {stats.volunteers} volunteers + {stats.newsletters} subscribers
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Members */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Members</h2>
              <p className="text-sm text-gray-500">Latest registrations</p>
            </div>
            <Link
              href="/admin/members"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="px-6 pb-6 space-y-1">
            {stats.recentMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm">
                    <span className="text-sm font-semibold text-white">
                      {(member.name || member.email).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {member.name || "No Name"}
                    </p>
                    <p className="text-xs text-gray-400">{member.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block text-[10px] font-medium uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {member.role}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />
                    {timeAgo(member.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            {stats.recentMembers.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">No members yet</p>
            )}
          </div>
        </motion.div>

        {/* Recent Donations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Donations</h2>
              <p className="text-sm text-gray-500">Latest transactions</p>
            </div>
            <Link
              href="/admin/donations"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="px-6 pb-6 space-y-1">
            {stats.recentDonations.map((donation) => (
              <div
                key={donation.id}
                className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-sm">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {donation.donorName || donation.donorEmail}
                    </p>
                    <p className="text-xs text-gray-400">
                      {donation.campaign?.title || "General Fund"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-600">
                    +${donation.amount.toLocaleString()}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />
                    {timeAgo(donation.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            {stats.recentDonations.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">No donations yet</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: "Add Member",
              icon: UserPlus,
              href: "/admin/members",
              gradient: "from-blue-500 to-indigo-600",
            },
            {
              label: "Create Event",
              icon: Calendar,
              href: "/admin/events",
              gradient: "from-violet-500 to-purple-600",
            },
            {
              label: "Write Blog Post",
              icon: FileText,
              href: "/admin/content",
              gradient: "from-amber-500 to-orange-600",
            },
            {
              label: "New Campaign",
              icon: HandHeart,
              href: "/admin/campaigns",
              gradient: "from-emerald-500 to-teal-600",
            },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} href={action.href}>
                <div className={`group relative flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r ${action.gradient} text-white hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="font-medium text-sm relative z-10">{action.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
