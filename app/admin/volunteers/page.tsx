"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HandHeart,
  Loader2,
  RefreshCw,
  Eye,
  Trash2,
  X,
  CheckCircle,
  Clock,
  XCircle,
  Mail,
  Phone,
  User,
  Calendar,
  Search,
} from "lucide-react";

interface VolunteerApp {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  skills: string | null;
  availability: string | null;
  message: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600",
  PENDING: "bg-amber-50 text-amber-600",
  approved: "bg-emerald-50 text-emerald-600",
  APPROVED: "bg-emerald-50 text-emerald-600",
  rejected: "bg-red-50 text-red-600",
  REJECTED: "bg-red-50 text-red-600",
};

const statusIcons: Record<string, typeof Clock> = {
  pending: Clock,
  PENDING: Clock,
  approved: CheckCircle,
  APPROVED: CheckCircle,
  rejected: XCircle,
  REJECTED: XCircle,
};

export default function AdminVolunteerPage() {
  const [apps, setApps] = useState<VolunteerApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<VolunteerApp | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/volunteer");
      if (res.ok) setApps(await res.json());
    } catch (err) {
      console.error("Failed to fetch volunteer applications", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/admin/volunteers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setApps((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
      if (selectedApp?.id === id) {
        setSelectedApp({ ...selectedApp, status });
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const deleteApp = async (id: number) => {
    if (!confirm("Delete this application?")) return;
    try {
      await fetch(`/api/admin/volunteers/${id}`, { method: "DELETE" });
      setApps((prev) => prev.filter((a) => a.id !== id));
      if (selectedApp?.id === id) setSelectedApp(null);
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const filtered = apps.filter((a) => {
    const matchesFilter =
      filter === "all" || a.status.toLowerCase() === filter;
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: apps.length,
    pending: apps.filter((a) => a.status.toLowerCase() === "pending").length,
    approved: apps.filter((a) => a.status.toLowerCase() === "approved").length,
    rejected: apps.filter((a) => a.status.toLowerCase() === "rejected").length,
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Volunteer Applications</h1>
          <p className="text-gray-500 mt-1">
            {counts.pending > 0
              ? `${counts.pending} pending review`
              : "All caught up!"}
          </p>
        </div>
        <button
          onClick={fetchApps}
          className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or role..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                filter === f
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <HandHeart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No applications found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">
                    Applicant
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">
                    Role
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">
                    Availability
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">
                    Date
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => {
                  const StatusIcon =
                    statusIcons[app.status] || Clock;
                  return (
                    <tr
                      key={app.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {app.name}
                          </p>
                          <p className="text-xs text-gray-500">{app.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 font-semibold">
                          {app.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {app.availability || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${
                            statusColors[app.status] ||
                            "bg-gray-50 text-gray-600"
                          }`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(app.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg"
                            title="View details"
                          >
                            <Eye className="w-4 h-4 text-gray-400" />
                          </button>
                          {app.status.toLowerCase() === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  updateStatus(app.id, "APPROVED")
                                }
                                className="p-1.5 hover:bg-emerald-50 rounded-lg"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              </button>
                              <button
                                onClick={() =>
                                  updateStatus(app.id, "REJECTED")
                                }
                                className="p-1.5 hover:bg-red-50 rounded-lg"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4 text-red-400" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteApp(app.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedApp(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">
                  Application Details
                </h2>
                <button onClick={() => setSelectedApp(null)}>
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900">
                      {selectedApp.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a
                      href={`mailto:${selectedApp.email}`}
                      className="text-sm text-emerald-600 hover:underline"
                    >
                      {selectedApp.email}
                    </a>
                  </div>
                  {selectedApp.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {selectedApp.phone}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <HandHeart className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {selectedApp.role}
                    </span>
                  </div>
                  {selectedApp.availability && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {selectedApp.availability}
                      </span>
                    </div>
                  )}
                </div>

                {/* Message */}
                {selectedApp.message && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </h4>
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4">
                      {selectedApp.message}
                    </p>
                  </div>
                )}

                {/* Status + Actions */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">
                      Applied {formatDate(selectedApp.createdAt)}
                    </span>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        statusColors[selectedApp.status] ||
                        "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {selectedApp.status}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        updateStatus(selectedApp.id, "APPROVED")
                      }
                      className="flex-1 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        updateStatus(selectedApp.id, "REJECTED")
                      }
                      className="flex-1 py-2.5 border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
