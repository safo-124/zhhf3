"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Plus,
  Edit,
  Trash2,
  Loader2,
  X,
  RefreshCw,
  DollarSign,
} from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";


interface Campaign {
  id: number;
  title: string;
  description: string;
  goal: number;
  raised: number;
  image: string | null;
  active: boolean;
  createdAt: string;
  _count?: { donations: number };
}

interface CampaignForm {
  title: string;
  description: string;
  goal: string;
  raised: string;
  image: string;
  active: boolean;
}

const emptyForm: CampaignForm = {
  title: "", description: "", goal: "", raised: "0", image: "", active: true,
};

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CampaignForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/campaigns");
      if (res.ok) setCampaigns(await res.json());
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (c: Campaign) => {
    setEditingId(c.id);
    setForm({
      title: c.title,
      description: c.description,
      goal: c.goal.toString(),
      raised: c.raised.toString(),
      image: c.image || "",
      active: c.active,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        title: form.title,
        description: form.description,
        goal: parseFloat(form.goal),
        raised: parseFloat(form.raised) || 0,
        image: form.image || null,
        active: form.active,
      };
      if (editingId) {
        await fetch(`/api/admin/campaigns/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await fetch("/api/admin/campaigns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      setShowModal(false);
      fetchCampaigns();
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this campaign?")) return;
    await fetch(`/api/admin/campaigns/${id}`, { method: "DELETE" });
    fetchCampaigns();
  };

  const totalRaised = campaigns.reduce((s, c) => s + c.raised, 0);
  const totalGoal = campaigns.reduce((s, c) => s + c.goal, 0);

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Campaigns</h1>
            <p className="text-gray-500 mt-1">{campaigns.length} campaigns</p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchCampaigns} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={openCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">
              <Plus className="w-4 h-4" /> New Campaign
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-gray-900">${totalRaised.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Total Raised</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-gray-900">${totalGoal.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Total Goal</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-gray-900">
              {totalGoal > 0 ? Math.round((totalRaised / totalGoal) * 100) : 0}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Overall Progress</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : (
          <div className="space-y-6">
            {campaigns.map((c, i) => {
              const pct = c.goal > 0 ? Math.min((c.raised / c.goal) * 100, 100) : 0;
              return (
                <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{c.title}</h3>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          c.active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
                        }`}>{c.active ? "Active" : "Inactive"}</span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">{c.description}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button onClick={() => openEdit(c)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <Edit className="w-4 h-4 text-gray-400" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="p-2 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-1 text-sm">
                      <DollarSign className="w-4 h-4 text-emerald-500" />
                      <span className="font-semibold text-emerald-600">${c.raised.toLocaleString()}</span>
                      <span className="text-gray-400">of ${c.goal.toLocaleString()}</span>
                    </div>
                    <span className="text-sm text-gray-400">{c._count?.donations ?? 0} donations</span>
                    <span className="text-sm font-semibold text-gray-700">{Math.round(pct)}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && campaigns.length === 0 && (
          <div className="text-center py-20">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">No campaigns yet. Create your first campaign!</p>
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
                  <h2 className="text-xl font-bold text-gray-900">{editingId ? "Edit Campaign" : "New Campaign"}</h2>
                  <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500 resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Goal ($)</label>
                      <input type="number" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Raised ($)</label>
                      <input type="number" value={form.raised} onChange={(e) => setForm({ ...form, raised: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500" />
                    </div>
                  </div>
                  <ImageUpload
                    label="Campaign Image"
                    value={form.image}
                    onChange={(url) => setForm({ ...form, image: url })}
                    accent="emerald"
                    hint="Upload an image or paste a URL for this campaign"
                  />
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="active" checked={form.active}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
                      className="rounded border-gray-300" />
                    <label htmlFor="active" className="text-sm text-gray-700">Active campaign</label>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setShowModal(false)}
                      className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50">Cancel</button>
                    <button onClick={handleSave} disabled={saving}
                      className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50">
                      {saving ? "Saving..." : editingId ? "Update" : "Create"}
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
