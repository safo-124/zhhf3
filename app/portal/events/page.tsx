"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  Loader2,
  Users,
  ArrowRight,
} from "lucide-react";

interface EventItem {
  id: number;
  registrationId: number;
  title: string;
  date: string;
  endDate: string | null;
  time: string | null;
  location: string;
  category: string;
  status: "Upcoming" | "Attended";
  gradient: string;
}

interface AvailableEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  endDate: string | null;
  time: string | null;
  location: string;
  category: string;
  capacity: number | null;
  registered: number;
  spotsLeft: number | null;
  gradient: string;
}

interface EventStats {
  total: number;
  upcoming: number;
  attended: number;
}

export default function MyEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [available, setAvailable] = useState<AvailableEvent[]>([]);
  const [stats, setStats] = useState<EventStats>({ total: 0, upcoming: 0, attended: 0 });
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchEvents = () => {
    fetch("/api/portal/events")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setEvents(d.events || []);
          setAvailable(d.availableEvents || []);
          setStats(d.stats || { total: 0, upcoming: 0, attended: 0 });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = async (eventId: number) => {
    setRegistering(eventId);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/portal/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Registration failed");
        return;
      }

      setSuccessMsg(`Registered for ${data.registration.title}!`);
      setTimeout(() => setSuccessMsg(""), 4000);

      // Refresh data so event moves from available to registered
      fetchEvents();
    } catch {
      setErrorMsg("Failed to register. Please try again.");
    } finally {
      setRegistering(null);
    }
  };

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

  const upcoming = events.filter((e) => e.status === "Upcoming");
  const past = events.filter((e) => e.status !== "Upcoming");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
      </div>

      {/* Success / Error Messages */}
      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          {successMsg}
        </motion.div>
      )}
      {errorMsg && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
          {errorMsg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-xl sm:text-2xl font-bold text-gray-900">
            {stats.total}
          </p>
          <p className="text-xs text-gray-500">Total Registered</p>
        </div>
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-xl sm:text-2xl font-bold text-emerald-600">
            {stats.upcoming}
          </p>
          <p className="text-xs text-gray-500">Upcoming</p>
        </div>
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-xl sm:text-2xl font-bold text-blue-600">
            {stats.attended}
          </p>
          <p className="text-xs text-gray-500">Attended</p>
        </div>
      </div>

      {/* ====== Available Events to Register ====== */}
      {available.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Available Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {available.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ y: -2 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
              >
                <div className={`h-2 bg-gradient-to-r ${event.gradient}`} />
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                      {event.title}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full whitespace-nowrap">
                      {event.category}
                    </span>
                  </div>

                  {event.description && (
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                      {formatDate(event.date)}
                    </span>
                    {event.time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        {event.time}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      {event.location}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {event.capacity && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Users className="w-3.5 h-3.5" />
                          {event.registered}/{event.capacity}
                        </span>
                      )}
                      {event.spotsLeft !== null && (
                        <span
                          className={`text-xs font-semibold ${
                            event.spotsLeft > 10
                              ? "text-emerald-600"
                              : event.spotsLeft > 0
                              ? "text-amber-600"
                              : "text-red-600"
                          }`}
                        >
                          {event.spotsLeft > 0
                            ? `${event.spotsLeft} spots left`
                            : "Fully booked"}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleRegister(event.id)}
                      disabled={registering === event.id || event.spotsLeft === 0}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {registering === event.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Registering...
                        </>
                      ) : event.spotsLeft === 0 ? (
                        "Full"
                      ) : (
                        <>
                          Register <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ====== My Registered Events ====== */}
      {events.length === 0 && available.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-12 text-gray-400">
          <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No events available right now</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                My Upcoming Events
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
                    <div className="p-4 sm:p-5 flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 truncate">
                            {event.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              {formatDate(event.date)}
                            </span>
                            {event.time && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                {event.time}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                        <span className="self-start px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full whitespace-nowrap">
                          Registered
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
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
                    <div className="p-4 sm:p-5 flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 truncate">
                            {event.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 flex-shrink-0" />
                              {formatDate(event.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                        <span className="self-start px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 whitespace-nowrap bg-blue-50 text-blue-600">
                          <CheckCircle className="w-3 h-3" />
                          Attended
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
