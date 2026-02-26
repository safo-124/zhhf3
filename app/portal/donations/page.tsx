"use client";

import { motion } from "framer-motion";
import {
  Gift,
  Download,
  Search,
  Heart,
  TrendingUp,
} from "lucide-react";

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
            <Heart className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">
            ${totalDonated.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Donated</p>
        </div>
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
            <Gift className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">
            {donations.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Total Transactions
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-violet-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">
            $50/mo
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Monthly Giving
          </p>
        </div>
      </div>

      {/* Donation Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search donations..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden divide-y divide-gray-50">
          {donations.map((d) => (
            <div key={d.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">{d.campaign}</p>
                <p className="text-sm font-bold text-emerald-600">${d.amount}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{d.date}</span>
                <span>{d.method}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    d.type === "Monthly"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {d.type}
                </span>
                <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full font-semibold">
                  {d.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
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
  );
}
