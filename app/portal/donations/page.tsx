"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Gift,
  Download,
  Search,
  Heart,
  TrendingUp,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface Donation {
  id: number;
  date: string;
  amount: number;
  currency: string;
  campaign: string;
  paymentMethod: string;
  status: string;
  type: string;
}

interface Summary {
  totalDonated: number;
  totalTransactions: number;
  monthlyAmount: number;
  currency: string;
}

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/portal/donations")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setDonations(d.donations || []);
          setSummary(d.summary || null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return donations;
    const q = search.toLowerCase();
    return donations.filter(
      (d) =>
        d.campaign.toLowerCase().includes(q) ||
        d.paymentMethod.toLowerCase().includes(q) ||
        d.status.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q)
    );
  }, [donations, search]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const cur = "GH₵";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Donations</h1>
        <Link
          href="/portal/donate"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          <Heart className="w-4 h-4" />
          Make a Donation
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
            <Heart className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">
            {cur}{(summary?.totalDonated || 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Donated</p>
        </div>
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
            <Gift className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">
            {summary?.totalTransactions || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Transactions</p>
        </div>
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-violet-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">
            {summary?.monthlyAmount
              ? `${cur}${summary.monthlyAmount.toLocaleString()}/mo`
              : "—"}
          </p>
          <p className="text-xs text-gray-500 mt-1">Monthly Giving</p>
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Gift className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {donations.length === 0
                ? "No donations yet"
                : "No matching donations"}
            </p>
            {donations.length === 0 && (
              <Link
                href="/portal/donate"
                className="inline-block mt-3 text-sm text-emerald-600 font-semibold hover:underline"
              >
                Make your first donation
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-gray-50">
              {filtered.map((d) => (
                <div key={d.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">
                      {d.campaign}
                    </p>
                    <p className="text-sm font-bold text-emerald-600">
                      {cur}{d.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(d.date)}</span>
                    <span>{d.paymentMethod}</span>
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
                    <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full font-semibold capitalize">
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
                  {filtered.map((d) => (
                    <tr
                      key={d.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(d.date)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {d.campaign}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-600">
                        {cur}{d.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {d.paymentMethod}
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
                        <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full font-semibold capitalize">
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
