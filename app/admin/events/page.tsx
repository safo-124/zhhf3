"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Users,
  Loader2,
  X,
  RefreshCw,
} from "lucide-react";


interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string | null;
  location: string;
  category: string;
  capacity: number | null;
  featured: boolean;
  _count?: { registrations: number };
}

interface EventForm {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: string;
  featured: boolean;
}

const emptyForm: EventForm = {
  title: "", description: "", date: "", time: "", location: "",
  category: "Community", capacity: "100", featured: false,
};

const gradients = [
  "from-emerald-500 to-teal-500",
  "from-blue-500 to-cyan-500",
  "from-violet-500 to-purple-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
];

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/events");
      if (res.ok) setEvents(await res.json());
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (e: Event) => {
    setEditingId(e.id);
    setForm({
      title: e.title,
      description: e.description,
      date: new Date(e.date).toISOString().split("T")[0],
      time: e.time || "",
      location: e.location,
      category: e.category,
      capacity: e.capacity?.toString() || "",
      featured: e.featured,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        title: form.title,
        description: form.description,
        date: new Date(form.date).toISOString(),
        time: form.time || null,
        location: form.location,
        category: form.category,
        capacity: form.capacity ? parseInt(form.capacity) : null,
        featured: form.featured,
      };
      if (editingId) {
        await fetch(`/api/admin/events/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await fetch("/api/admin/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      setShowModal(false);
      fetchEvents();
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this event and all its registrations?")) return;
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    fetchEvents();
  };

  const now = new Date();

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Events</h1>
            <p className="text-gray-500 mt-1">{events.length} total events</p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchEvents} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={openCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">
              <Plus className="w-4 h-4" /> Create Event
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event, index) => {
              const eventDate = new Date(event.date);
              const isPast = eventDate < now;
              const regs = event._count?.registrations ?? 0;
              const pct = event.capacity ? Math.min((regs / event.capacity) * 100, 100) : 0;

              return (
                <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                  <div className={`h-24 bg-gradient-to-r ${gradients[index % gradients.length]} relative`}>
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      isPast ? "bg-white/90 text-gray-700" : "bg-white/20 text-white border border-white/30"
                    }`}>{isPast ? "Completed" : "Upcoming"}</span>
                    {event.featured && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-yellow-900">Featured</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-2">{event.title}</h3>
                    <div className="space-y-1.5 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        {eventDate.toLocaleDateString()} {event.time && `at ${event.time}`}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-500" />
                        {regs}{event.capacity ? `/${event.capacity}` : ""} registered
                      </div>
                    </div>
                    {event.capacity && (
                      <div className="w-full h-2 bg-gray-100 rounded-full mb-4">
                        <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(event)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <Edit className="w-4 h-4 text-gray-400" />
                      </button>
                      <button onClick={() => handleDelete(event.id)} className="p-2 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">No events yet. Create your first event!</p>
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowModal(false)}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-8 shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">{editingId ? "Edit Event" : "Create Event"}</h2>
                  <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500">
                        <option>Community</option><option>Health</option><option>Education</option>
                        <option>Fundraiser</option><option>Workshop</option><option>Outreach</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                      <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500 resize-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="featured" checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="rounded border-gray-300" />
                    <label htmlFor="featured" className="text-sm text-gray-700">Featured event</label>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setShowModal(false)}
                      className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50">Cancel</button>
                    <button onClick={handleSave} disabled={saving}
                      className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50">
                      {saving ? "Saving..." : editingId ? "Update" : "Create Event"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
