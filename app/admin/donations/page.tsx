"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Search,
  TrendingUp,
  Heart,
  Loader2,
  RefreshCw,
} from "lucide-react";


interface Donation {
  id: number;
  amount: number;
  currency: string;
  status: string;
  message: string | null;
  anonymous: boolean;
  paymentMethod: string | null;
  isMonthly: boolean;
  createdAt: string;
  user: { name: string | null; email: string } | null;
  campaign: { title: string } | null;
}

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/donations");
      if (res.ok) {
        const data = await res.json();
        setDonations(Array.isArray(data) ? data : data.donations || []);
      }
    } catch (err) {
      console.error("Failed to fetch donations", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDonations(); }, [fetchDonations]);

  const totalAmount = donations.reduce((s, d) => s + d.amount, 0);
  const avgAmount = donations.length > 0 ? Math.round(totalAmount / donations.length) : 0;

  const filtered = donations.filter((d) => {
    const donor = d.anonymous ? "Anonymous" : d.user?.name || d.user?.email || "";
    return donor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.campaign?.title || "").toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Donations</h1>
            <p className="text-gray-500 mt-1">Track and manage all donations</p>
          </div>
          <button onClick={fetchDonations} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">GH₵{totalAmount.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Total Revenue</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{donations.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total Donations</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-violet-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">GH₵{avgAmount}</p>
            <p className="text-xs text-gray-500 mt-1">Average Amount</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text" value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search donations..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Donor</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Amount</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Campaign</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Date</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Method</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d) => (
                    <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900">
                          {d.anonymous ? "Anonymous" : d.user?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500">{d.anonymous ? "" : d.user?.email || ""}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-600">
                        GH₵{d.amount.toLocaleString()}
                        {d.isMonthly && <span className="ml-1 text-xs text-gray-400">/mo</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{d.campaign?.title || "General Fund"}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(d.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 capitalize">{d.paymentMethod || "card"}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          d.status === "completed" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        }`}>{d.status}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">No donations found</p>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
