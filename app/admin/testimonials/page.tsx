"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Loader2,
  X,
  RefreshCw,
  Star,
} from "lucide-react";


interface Testimonial {
  id: number;
  name: string;
  role: string | null;
  content: string;
  image: string | null;
  featured: boolean;
  createdAt: string;
}

interface TestForm {
  name: string;
  role: string;
  content: string;
  image: string;
  featured: boolean;
}

const emptyForm: TestForm = { name: "", role: "", content: "", image: "", featured: false };

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<TestForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials");
      if (res.ok) setTestimonials(await res.json());
    } catch (err) {
      console.error("Failed to fetch testimonials", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setForm({
      name: t.name,
      role: t.role || "",
      content: t.content,
      image: t.image || "",
      featured: t.featured,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        name: form.name,
        role: form.role || null,
        content: form.content,
        image: form.image || null,
        featured: form.featured,
      };
      if (editingId) {
        await fetch(`/api/admin/testimonials/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await fetch("/api/admin/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      setShowModal(false);
      fetchTestimonials();
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    fetchTestimonials();
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Testimonials</h1>
            <p className="text-gray-500 mt-1">{testimonials.length} testimonials</p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchTestimonials} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={openCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">
              <Plus className="w-4 h-4" /> Add Testimonial
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-lg">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{t.name}</h3>
                      {t.role && <p className="text-sm text-gray-500">{t.role}</p>}
                    </div>
                  </div>
                  {t.featured && (
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  )}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(t)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <Edit className="w-4 h-4 text-gray-400" />
                    </button>
                    <button onClick={() => handleDelete(t.id)} className="p-2 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && testimonials.length === 0 && (
          <div className="text-center py-20">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">No testimonials yet</p>
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
                className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">{editingId ? "Edit Testimonial" : "Add Testimonial"}</h2>
                  <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role / Title</label>
                    <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                      placeholder="e.g. Community Member"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial</label>
                    <textarea rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="featured" checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="rounded border-gray-300" />
                    <label htmlFor="featured" className="text-sm text-gray-700">Featured testimonial</label>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setShowModal(false)}
                      className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50">Cancel</button>
                    <button onClick={handleSave} disabled={saving}
                      className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50">
                      {saving ? "Saving..." : editingId ? "Update" : "Add"}
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
