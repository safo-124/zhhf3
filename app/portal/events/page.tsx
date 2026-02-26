"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";

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

interface EventStats {
  total: number;
  upcoming: number;
  attended: number;
}

export default function MyEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [stats, setStats] = useState<EventStats>({ total: 0, upcoming: 0, attended: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portal/events")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setEvents(d.events || []);
          setStats(d.stats || { total: 0, upcoming: 0, attended: 0 });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
        <Link
          href="/events"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
        >
          Browse Events
        </Link>
      </div>

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

      {events.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-12 text-gray-400">
          <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">You haven&apos;t registered for any events yet</p>
          <Link
            href="/events"
            className="inline-block mt-3 text-sm text-emerald-600 font-semibold hover:underline"
          >
            Browse upcoming events
          </Link>
        </div>
      ) : (
        <>
          {/* Upcoming Events */}
          {upcoming.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Upcoming Events
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
                          {event.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Past Events */}
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
                          {event.status}
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
