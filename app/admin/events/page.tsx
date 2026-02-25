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
  Clock,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  endDate: string | null;
  time: string | null;
  location: string;
  category: string;
  image: string | null;
  capacity: number | null;
  featured: boolean;
  _count?: { registrations: number };
}

interface EventForm {
  title: string;
  description: string;
  date: string;
  endDate: string;
  time: string;
  location: string;
  category: string;
  capacity: string;
  image: string;
  featured: boolean;
}

const emptyForm: EventForm = {
  title: "", description: "", date: "", endDate: "", time: "", location: "",
  category: "Community", capacity: "100", image: "", featured: false,
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
  const [activeTab, setActiveTab] = useState<"details" | "image">("details");

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
    setActiveTab("details");
    setShowModal(true);
  };

  const openEdit = (e: Event) => {
    setEditingId(e.id);
    setForm({
      title: e.title,
      description: e.description,
      date: new Date(e.date).toISOString().split("T")[0],
      endDate: e.endDate ? new Date(e.endDate).toISOString().split("T")[0] : "",
      time: e.time || "",
      location: e.location,
      category: e.category,
      capacity: e.capacity?.toString() || "",
      image: e.image || "",
      featured: e.featured,
    });
    setActiveTab("details");
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        title: form.title,
        description: form.description,
        date: new Date(form.date).toISOString(),
        endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
        time: form.time || null,
        location: form.location,
        category: form.category,
        capacity: form.capacity ? parseInt(form.capacity) : null,
        image: form.image || null,
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
  const upcoming = events.filter(e => new Date(e.date) >= now);
  const past = events.filter(e => new Date(e.date) < now);

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Events</h1>
          <p className="text-gray-500 mt-1">
            {events.length} total &middot; {upcoming.length} upcoming &middot; {past.length} past
          </p>
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
      ) : events.length === 0 ? (
        <div className="text-center py-20">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No events yet. Create your first event!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Section */}
          {upcoming.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" /> Upcoming ({upcoming.length})
              </h2>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {upcoming.map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} now={now}
                    onEdit={() => openEdit(event)} onDelete={() => handleDelete(event.id)} />
                ))}
              </div>
            </div>
          )}

          {/* Past Section */}
          {past.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full" /> Past ({past.length})
              </h2>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {past.map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} now={now}
                    onEdit={() => openEdit(event)} onDelete={() => handleDelete(event.id)} />
                ))}
              </div>
            </div>
          )}
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
              className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal header */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">{editingId ? "Edit Event" : "Create Event"}</h2>
                <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100 px-8">
                {(["details", "image"] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                      activeTab === tab ? "border-emerald-500 text-emerald-600" : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}>
                    {tab === "details" ? "Details" : "Image"}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-8 py-6">
                {activeTab === "details" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="Event title"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date <span className="text-gray-400">(optional)</span></label>
                        <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500">
                          <option>Community</option><option>Health</option><option>Education</option>
                          <option>Fundraiser</option><option>Workshop</option><option>Outreach</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                          placeholder="Event venue"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                        <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                          placeholder="Max attendees"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Describe the event..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500 resize-none" />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                      <input type="checkbox" id="featured" checked={form.featured}
                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                      <label htmlFor="featured" className="text-sm text-gray-700 flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Featured event &mdash; shown prominently on the Events page
                      </label>
                    </div>
                  </div>
                ) : (
                  <div>
                    <ImageUpload
                      value={form.image}
                      onChange={(url) => setForm({ ...form, image: url })}
                      label="Event Cover Image"
                      hint="Recommended: 1200×600px. Used on the events page."
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-8 py-5 border-t border-gray-100 bg-gray-50">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-white">Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.title || !form.date || !form.location}
                  className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                  {saving ? "Saving..." : editingId ? "Update Event" : "Create Event"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Event Card (extracted) ---------- */

function EventCard({ event, index, now, onEdit, onDelete }: {
  event: Event; index: number; now: Date;
  onEdit: () => void; onDelete: () => void;
}) {
  const eventDate = new Date(event.date);
  const isPast = eventDate < now;
  const regs = event._count?.registrations ?? 0;
  const pct = event.capacity ? Math.min((regs / event.capacity) * 100, 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all ${isPast ? "opacity-70 hover:opacity-100" : ""}`}>
      {/* Header: image or gradient */}
      <div className="h-28 relative overflow-hidden">
        {event.image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-r ${gradients[index % gradients.length]}`} />
        )}
        <div className="absolute top-3 right-3 flex gap-1.5">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            isPast ? "bg-gray-800/70 text-white" : "bg-emerald-500 text-white"
          }`}>{isPast ? "Past" : "Upcoming"}</span>
          {event.featured && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-yellow-900 flex items-center gap-1">
              <Star className="w-3 h-3" /> Featured
            </span>
          )}
        </div>
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30">
          {event.category}
        </span>
        {!event.image && (
          <div className="absolute bottom-2 right-2 bg-black/20 rounded-full p-1">
            <ImageIcon className="w-3 h-3 text-white/60" />
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-2 truncate">{event.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{event.description}</p>

        <div className="space-y-1.5 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="truncate">
              {eventDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              {event.endDate && ` → ${new Date(event.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
            </span>
          </div>
          {event.time && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              {event.time}
            </div>
          )}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            {regs}{event.capacity ? `/${event.capacity}` : ""} registered
          </div>
        </div>

        {event.capacity && (
          <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4">
            <div className={`h-full rounded-full transition-all ${pct >= 90 ? "bg-red-500" : pct >= 60 ? "bg-amber-500" : "bg-emerald-500"}`}
              style={{ width: `${pct}%` }} />
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <button onClick={onEdit} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
            <Edit className="w-3.5 h-3.5" /> Edit
          </button>
          <button onClick={onDelete} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}
