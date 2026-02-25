"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Loader2,
  RefreshCw,
  CheckCircle,
  FileText,
  Image as ImageIcon,
  Users,
  Calendar,
  Target,
  Eye,
  Gem,
  BarChart3,
  Plus,
  Trash2,
  X,
  Award,
} from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface AboutData {
  [key: string]: string;
}

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  color: string;
  image?: string;
}

const TEAM_COLORS = [
  "bg-emerald-500",
  "bg-teal-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-indigo-500",
  "bg-cyan-500",
];

const TABS = [
  { id: "hero", label: "Hero Section", icon: ImageIcon },
  { id: "content", label: "Content", icon: FileText },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "timeline", label: "Timeline", icon: Calendar },
  { id: "team", label: "Team", icon: Users },
  { id: "cta", label: "CTA Section", icon: Award },
];

export default function AdminAboutPage() {
  const [data, setData] = useState<AboutData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

  // Parsed complex data
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/about");
      if (res.ok) {
        const settings: { key: string; value: string }[] = await res.json();
        const map: AboutData = {};
        settings.forEach((s) => (map[s.key] = s.value));
        setData(map);

        // Parse timeline
        try {
          setTimeline(JSON.parse(map.about_timeline || "[]"));
        } catch {
          setTimeline([]);
        }

        // Parse team
        try {
          setTeam(JSON.parse(map.about_team || "[]"));
        } catch {
          setTeam([]);
        }
      }
    } catch {
      console.error("Failed to fetch about data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateField = (key: string, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      // Merge timeline and team into data
      const allData = {
        ...data,
        about_timeline: JSON.stringify(timeline),
        about_team: JSON.stringify(team),
      };

      const settings = Object.entries(allData)
        .filter(([key]) => key.startsWith("about_"))
        .map(([key, value]) => ({ key, value }));

      const res = await fetch("/api/admin/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      console.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // Timeline helpers
  const addTimelineItem = () => {
    setTimeline([...timeline, { year: new Date().getFullYear().toString(), title: "", description: "" }]);
  };
  const updateTimelineItem = (index: number, field: keyof TimelineItem, value: string) => {
    const updated = [...timeline];
    updated[index] = { ...updated[index], [field]: value };
    setTimeline(updated);
  };
  const removeTimelineItem = (index: number) => {
    setTimeline(timeline.filter((_, i) => i !== index));
  };

  // Team helpers
  const addTeamMember = () => {
    setTeam([...team, { name: "", role: "", avatar: "", color: TEAM_COLORS[team.length % TEAM_COLORS.length], image: "" }]);
  };
  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...team];
    updated[index] = { ...updated[index], [field]: value };
    // Auto-generate avatar from name initials
    if (field === "name") {
      const initials = value
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
      updated[index].avatar = initials;
    }
    setTeam(updated);
  };
  const removeTeamMember = (index: number) => {
    setTeam(team.filter((_, i) => i !== index));
  };

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">About Page</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the About page content, background image, team, and timeline
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={saveAll}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg shadow-blue-500/20"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : saved ? "Saved!" : "Save All Changes"}
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 bg-blue-50/50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Hero Tab */}
            {activeTab === "hero" && (
              <motion.div
                key="hero"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Badge Text</label>
                      <input
                        value={data.about_hero_badge || ""}
                        onChange={(e) => updateField("about_hero_badge", e.target.value)}
                        placeholder="Our Story"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Title (first part)</label>
                      <input
                        value={data.about_hero_title || ""}
                        onChange={(e) => updateField("about_hero_title", e.target.value)}
                        placeholder="About Zion Helping"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Title Highlight (colored part)</label>
                      <input
                        value={data.about_hero_highlight || ""}
                        onChange={(e) => updateField("about_hero_highlight", e.target.value)}
                        placeholder="Hand Foundation"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Subtitle</label>
                      <textarea
                        value={data.about_hero_subtitle || ""}
                        onChange={(e) => updateField("about_hero_subtitle", e.target.value)}
                        rows={3}
                        placeholder="For over 15 years..."
                        className={inputClass + " resize-none"}
                      />
                    </div>
                  </div>

                  <div>
                    <ImageUpload
                      label="Hero Background Image"
                      value={data.about_hero_image || ""}
                      onChange={(url) => updateField("about_hero_image", url)}
                      accent="blue"
                      hint="This image will be displayed as the background of the About page hero section"
                    />

                    {/* Preview */}
                    {(data.about_hero_title || data.about_hero_highlight) && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-gray-200">
                        <div className="relative h-40 bg-gradient-to-r from-emerald-700 to-teal-600 flex items-center justify-center">
                          {data.about_hero_image && (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={data.about_hero_image}
                                alt="Preview"
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/80 via-emerald-800/75 to-teal-900/85" />
                            </>
                          )}
                          <div className="relative text-center px-4">
                            <p className="text-emerald-300 text-xs mb-1">{data.about_hero_badge}</p>
                            <h3 className="text-white font-bold text-sm">
                              {data.about_hero_title}{" "}
                              <span className="text-emerald-300">{data.about_hero_highlight}</span>
                            </h3>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Content Tab */}
            {activeTab === "content" && (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {[
                  { key: "about_mission", label: "Mission Statement", icon: Target, color: "emerald" },
                  { key: "about_vision", label: "Vision Statement", icon: Eye, color: "teal" },
                  { key: "about_values", label: "Core Values", icon: Gem, color: "cyan" },
                ].map((field) => (
                  <div key={field.key} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <field.icon className="w-4 h-4 text-gray-500" />
                      {field.label}
                    </label>
                    <textarea
                      value={data[field.key] || ""}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      rows={4}
                      className={inputClass + " resize-none"}
                    />
                  </div>
                ))}
              </motion.div>
            )}

            {/* Stats Tab */}
            {activeTab === "stats" && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <p className="text-sm text-gray-500">Edit the four stat counters shown on the About page.</p>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Stat #{n}</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500">Value (number)</label>
                          <input
                            type="number"
                            value={data[`about_stat${n}_value`] || ""}
                            onChange={(e) => updateField(`about_stat${n}_value`, e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">Label</label>
                          <input
                            value={data[`about_stat${n}_label`] || ""}
                            onChange={(e) => updateField(`about_stat${n}_label`, e.target.value)}
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Timeline Tab */}
            {activeTab === "timeline" && (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Add milestones to your foundation&apos;s journey.</p>
                  <button
                    onClick={addTimelineItem}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Milestone
                  </button>
                </div>

                {timeline.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-5 border border-gray-100 relative group">
                    <button
                      onClick={() => removeTimelineItem(index)}
                      className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500">Year</label>
                        <input
                          value={item.year}
                          onChange={(e) => updateTimelineItem(index, "year", e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">Title</label>
                        <input
                          value={item.title}
                          onChange={(e) => updateTimelineItem(index, "title", e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-medium text-gray-500">Description</label>
                        <input
                          value={item.description}
                          onChange={(e) => updateTimelineItem(index, "description", e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {timeline.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p>No timeline milestones yet. Click &quot;Add Milestone&quot; to start.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Team Tab */}
            {activeTab === "team" && (
              <motion.div
                key="team"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Add your team members and leadership.</p>
                  <button
                    onClick={addTeamMember}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Member
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {team.map((member, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-5 border border-gray-100 relative group">
                      <button
                        onClick={() => removeTeamMember(index)}
                        className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="space-y-4">
                        {/* Photo + Name row */}
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            {member.image ? (
                              <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-200 group/img">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={member.image} alt={member.name || "Member"} className="w-full h-full object-cover" />
                                <button
                                  onClick={() => updateTeamMember(index, "image", "")}
                                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                                >
                                  <X className="w-5 h-5 text-white" />
                                </button>
                              </div>
                            ) : (
                              <div
                                className={`w-20 h-20 rounded-xl ${member.color} flex items-center justify-center text-white text-xl font-bold`}
                              >
                                {member.avatar || "??"}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div>
                              <label className="text-xs font-medium text-gray-500">Full Name</label>
                              <input
                                value={member.name}
                                onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                                placeholder="John Doe"
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500">Role</label>
                              <input
                                value={member.role}
                                onChange={(e) => updateTeamMember(index, "role", e.target.value)}
                                placeholder="Program Director"
                                className={inputClass}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Image Upload */}
                        <ImageUpload
                          label="Member Photo"
                          value={member.image || ""}
                          onChange={(url) => updateTeamMember(index, "image", url)}
                          accent="blue"
                          hint="Upload a photo or paste a URL for this team member"
                        />

                        {/* Badge Color */}
                        <div>
                          <label className="text-xs font-medium text-gray-500">Fallback Badge Color (used when no photo)</label>
                          <select
                            value={member.color}
                            onChange={(e) => updateTeamMember(index, "color", e.target.value)}
                            className={inputClass}
                          >
                            {TEAM_COLORS.map((c) => (
                              <option key={c} value={c}>
                                {c.replace("bg-", "").replace("-500", "")}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {team.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p>No team members yet. Click &quot;Add Member&quot; to start.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* CTA Tab */}
            {activeTab === "cta" && (
              <motion.div
                key="cta"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div>
                  <label className={labelClass}>CTA Title</label>
                  <input
                    value={data.about_cta_title || ""}
                    onChange={(e) => updateField("about_cta_title", e.target.value)}
                    placeholder="Ready to Join Our Mission?"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>CTA Subtitle</label>
                  <textarea
                    value={data.about_cta_subtitle || ""}
                    onChange={(e) => updateField("about_cta_subtitle", e.target.value)}
                    rows={3}
                    placeholder="Whether through volunteering, donating..."
                    className={inputClass + " resize-none"}
                  />
                </div>

                {/* Preview */}
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-8 text-center">
                    <Award className="w-8 h-8 text-emerald-200 mx-auto mb-2" />
                    <h3 className="text-xl font-bold text-white mb-2">
                      {data.about_cta_title || "CTA Title"}
                    </h3>
                    <p className="text-emerald-100 text-sm max-w-md mx-auto">
                      {data.about_cta_subtitle || "CTA subtitle..."}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
