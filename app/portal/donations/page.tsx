"use client";

import { motion } from "framer-motion";
import {
  Gift,
  Download,
  Search,
  Heart,
  LayoutDashboard,
  Calendar,
  User,
  Settings,
  LogOut,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

const sidebarLinks = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/donations", label: "My Donations", icon: Gift, active: true },
  { href: "/portal/events", label: "My Events", icon: Calendar },
  { href: "/portal/profile", label: "Profile", icon: User },
  { href: "/portal/settings", label: "Settings", icon: Settings },
];

const donations = [
  { id: 1, date: "Jan 15, 2025", amount: 100, campaign: "Clean Water Project", method: "Card ****4242", status: "Completed", type: "One-time" },
  { id: 2, date: "Dec 20, 2024", amount: 250, campaign: "Education Fund", method: "Card ****4242", status: "Completed", type: "One-time" },
  { id: 3, date: "Dec 1, 2024", amount: 50, campaign: "Monthly Giving", method: "Card ****4242", status: "Completed", type: "Monthly" },
  { id: 4, date: "Nov 10, 2024", amount: 50, campaign: "Food Drive 2024", method: "Mobile Money", status: "Completed", type: "One-time" },
  { id: 5, date: "Nov 1, 2024", amount: 50, campaign: "Monthly Giving", method: "Card ****4242", status: "Completed", type: "Monthly" },
  { id: 6, date: "Oct 15, 2024", amount: 500, campaign: "Housing Initiative", method: "Card ****4242", status: "Completed", type: "One-time" },
  { id: 7, date: "Oct 1, 2024", amount: 50, campaign: "Monthly Giving", method: "Card ****4242", status: "Completed", type: "Monthly" },
  { id: 8, date: "Sep 5, 2024", amount: 200, campaign: "Healthcare Program", method: "Bank Transfer", status: "Completed", type: "One-time" },
];

export default function DonationsPage() {
  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);

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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  My Donations
                </h1>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                  Export Receipt
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
                    <Heart className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalDonated.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Total Donated</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                    <Gift className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {donations.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Total Transactions
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center mb-3">
                    <TrendingUp className="w-5 h-5 text-violet-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    $50/mo
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Monthly Giving
                  </p>
                </div>
              </div>

              {/* Donation Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search donations..."
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                          Date
                        </th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                          Campaign
                        </th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                          Amount
                        </th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                          Method
                        </th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                          Type
                        </th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.map((d) => (
                        <tr
                          key={d.id}
                          className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {d.date}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {d.campaign}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-emerald-600">
                            ${d.amount}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {d.method}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                                d.type === "Monthly"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {d.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full font-semibold">
                              {d.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
