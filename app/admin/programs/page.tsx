"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  Loader2,
  X,
  RefreshCw,
  GripVertical,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface ProgramData {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  image: string | null;
  icon: string;
  color: string;
  emoji: string;
  features: string | null;
  impacts: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: string;
}

interface ProgramForm {
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  icon: string;
  color: string;
  emoji: string;
  features: string[];
  impacts: { label: string; value: string }[];
  active: boolean;
  sortOrder: number;
}

const emptyForm: ProgramForm = {
  title: "",
  slug: "",
  shortDescription: "",
  longDescription: "",
  image: "",
  icon: "Heart",
  color: "from-emerald-500 to-teal-600",
  emoji: "🌟",
  features: [],
  impacts: [],
  active: true,
  sortOrder: 0,
};

const iconOptions = [
  "GraduationCap",
  "HeartPulse",
  "Home",
  "Utensils",
  "Droplets",
  "Wrench",
  "Users",
  "Globe",
  "HandHeart",
  "Heart",
  "Sparkles",
];

const colorOptions = [
  { label: "Emerald", value: "from-emerald-500 to-green-600" },
  { label: "Rose", value: "from-rose-500 to-red-600" },
  { label: "Amber", value: "from-amber-500 to-orange-600" },
  { label: "Violet", value: "from-violet-500 to-purple-600" },
  { label: "Blue", value: "from-blue-500 to-cyan-600" },
  { label: "Teal", value: "from-teal-500 to-emerald-600" },
  { label: "Indigo", value: "from-indigo-500 to-blue-600" },
  { label: "Pink", value: "from-pink-500 to-rose-600" },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProgramForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [activeTab, setActiveTab] = useState<"basic" | "features" | "impacts">("basic");

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/programs");
      if (res.ok) setPrograms(await res.json());
    } catch (err) {
      console.error("Failed to fetch programs", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, sortOrder: programs.length });
    setActiveTab("basic");
    setShowModal(true);
  };

  const openEdit = (p: ProgramData) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      slug: p.slug,
      shortDescription: p.shortDescription,
      longDescription: p.longDescription,
      image: p.image || "",
      icon: p.icon,
      color: p.color,
      emoji: p.emoji,
      features: (() => {
        try { return p.features ? JSON.parse(p.features) : []; } catch { return []; }
      })(),
      impacts: (() => {
        try { return p.impacts ? JSON.parse(p.impacts) : []; } catch { return []; }
      })(),
      active: p.active,
      sortOrder: p.sortOrder,
    });
    setActiveTab("basic");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.slug.trim() || !form.shortDescription.trim() || !form.longDescription.trim()) {
      alert("Please fill in title, slug, short description, and long description.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        image: form.image || null,
        features: form.features.length > 0 ? form.features : null,
        impacts: form.impacts.length > 0 ? form.impacts : null,
      };

      const url = editingId
        ? `/api/admin/programs/${editingId}`
        : "/api/admin/programs";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        fetchPrograms();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save program");
      }
    } catch {
      alert("Failed to save program");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this program?")) return;
    try {
      await fetch(`/api/admin/programs/${id}`, { method: "DELETE" });
      fetchPrograms();
    } catch {
      alert("Failed to delete program");
    }
  };

  const toggleActive = async (p: ProgramData) => {
    try {
      await fetch(`/api/admin/programs/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !p.active }),
      });
      fetchPrograms();
    } catch {
      alert("Failed to toggle program");
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setForm((prev) => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addImpact = () => {
    setForm((prev) => ({
      ...prev,
      impacts: [...prev.impacts, { label: "", value: "" }],
    }));
  };

  const updateImpact = (index: number, field: "label" | "value", val: string) => {
    setForm((prev) => ({
      ...prev,
      impacts: prev.impacts.map((imp, i) =>
        i === index ? { ...imp, [field]: val } : imp
      ),
    }));
  };

  const removeImpact = (index: number) => {
    setForm((prev) => ({
      ...prev,
      impacts: prev.impacts.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Layers className="w-5 h-5 text-white" />
            </div>
            Programs
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your organization&apos;s programs
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchPrograms}
            className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow"
          >
            <Plus className="w-4 h-4" />
            Add Program
          </button>
        </div>
      </div>

      {/* Programs List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : programs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No Programs Yet
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Create your first program to get started.
          </p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Program
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {programs.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="flex items-center gap-4 p-4">
                {/* Drag handle + sort */}
                <div className="text-gray-300 hidden md:block">
                  <GripVertical className="w-5 h-5" />
                </div>

                {/* Image preview */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${p.color} opacity-20 flex items-center justify-center`}
                    >
                      <span className="text-2xl">{p.emoji}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {p.emoji} {p.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                        p.active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {p.active ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {p.shortDescription}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-gray-400">/{p.slug}</span>
                    <span className="text-xs text-gray-400">
                      Order: {p.sortOrder}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleActive(p)}
                    className={`p-2 rounded-lg transition-colors ${
                      p.active
                        ? "text-emerald-600 hover:bg-emerald-50"
                        : "text-gray-400 hover:bg-gray-50"
                    }`}
                    title={p.active ? "Hide program" : "Show program"}
                  >
                    {p.active ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => openEdit(p)}
                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">
                  {editingId ? "Edit Program" : "Create Program"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100">
                {(["basic", "features", "impacts"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "text-emerald-700 border-b-2 border-emerald-500"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab === "basic" ? "Basic Info" : tab === "features" ? "Features" : "Impact Stats"}
                  </button>
                ))}
              </div>

              {/* Modal body */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {/* Basic Tab */}
                {activeTab === "basic" && (
                  <div className="space-y-4">
                    {/* Image */}
                    <ImageUpload
                      value={form.image}
                      onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
                      label="Program Image"
                      hint="Used as hero and card image"
                      accent="emerald"
                    />

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          setForm((prev) => ({
                            ...prev,
                            title,
                            ...(editingId ? {} : { slug: slugify(title) }),
                          }));
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                        placeholder="e.g. Education Support"
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL Slug *
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">/programs/</span>
                        <input
                          type="text"
                          value={form.slug}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              slug: slugify(e.target.value),
                            }))
                          }
                          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                          placeholder="education-support"
                        />
                      </div>
                    </div>

                    {/* Short Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Short Description *
                      </label>
                      <textarea
                        value={form.shortDescription}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            shortDescription: e.target.value,
                          }))
                        }
                        rows={2}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm resize-none"
                        placeholder="Brief overview shown on program cards..."
                      />
                    </div>

                    {/* Long Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Description *
                      </label>
                      <textarea
                        value={form.longDescription}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            longDescription: e.target.value,
                          }))
                        }
                        rows={5}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm resize-none"
                        placeholder="Detailed description shown on the program detail page. Use new lines to create paragraphs..."
                      />
                    </div>

                    {/* Icon & Emoji Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Icon
                        </label>
                        <select
                          value={form.icon}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, icon: e.target.value }))
                          }
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                        >
                          {iconOptions.map((icon) => (
                            <option key={icon} value={icon}>
                              {icon}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Emoji
                        </label>
                        <input
                          type="text"
                          value={form.emoji}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, emoji: e.target.value }))
                          }
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                          placeholder="🌟"
                        />
                      </div>
                    </div>

                    {/* Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gradient Color
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {colorOptions.map((c) => (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({ ...prev, color: c.value }))
                            }
                            className={`relative h-10 rounded-xl bg-gradient-to-r ${c.value} transition-all ${
                              form.color === c.value
                                ? "ring-2 ring-offset-2 ring-emerald-500 scale-105"
                                : "hover:scale-105"
                            }`}
                          >
                            <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold">
                              {c.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sort Order & Active */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sort Order
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                sortOrder: Math.max(0, prev.sortOrder - 1),
                              }))
                            }
                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-mono font-bold text-gray-700 w-8 text-center">
                            {form.sortOrder}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                sortOrder: prev.sortOrder + 1,
                              }))
                            }
                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Visibility
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({ ...prev, active: !prev.active }))
                          }
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                            form.active
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-gray-200 bg-gray-50 text-gray-500"
                          }`}
                        >
                          {form.active ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                          {form.active ? "Active" : "Hidden"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Features Tab */}
                {activeTab === "features" && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                      Add key features or highlights of this program. These appear
                      as badges on the program card and as a feature list on the
                      detail page.
                    </p>

                    {/* Add feature */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                        placeholder="e.g. Scholarships for 500+ students"
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        className="px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Feature list */}
                    {form.features.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-6">
                        No features added yet.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {form.features.map((f, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100"
                          >
                            <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700 flex-shrink-0">
                              {i + 1}
                            </span>
                            <span className="flex-1 text-sm text-gray-700">
                              {f}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFeature(i)}
                              className="p-1 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Impacts Tab */}
                {activeTab === "impacts" && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                      Add impact statistics shown on the program detail page sidebar.
                      e.g. &quot;Students Reached&quot; → &quot;2,500+&quot;
                    </p>

                    {form.impacts.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-6">
                        No impact stats added yet.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {form.impacts.map((imp, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100"
                          >
                            <div className="grid grid-cols-2 gap-2 flex-1">
                              <input
                                type="text"
                                value={imp.label}
                                onChange={(e) => updateImpact(i, "label", e.target.value)}
                                className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Label (e.g. Students)"
                              />
                              <input
                                type="text"
                                value={imp.value}
                                onChange={(e) => updateImpact(i, "value", e.target.value)}
                                className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Value (e.g. 2,500+)"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImpact(i)}
                              className="p-1 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={addImpact}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-xl hover:bg-blue-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Impact Stat
                    </button>
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-50 transition-all"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? "Save Changes" : "Create Program"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
