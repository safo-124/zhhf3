"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Image as ImageIcon,
  Plus,
  Trash2,
  Save,
  Loader2,
  X,
  GripVertical,
  Eye,
  EyeOff,
  Type,
  FileText,
  RefreshCw,
  CheckCircle,
  ExternalLink,
  Palette,
  Layout,
  Stamp,
} from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface HeroImage {
  id: number;
  url: string;
  alt: string | null;
  sortOrder: number;
  active: boolean;
}

interface HomepageData {
  settings: Record<string, string>;
  heroImages: HeroImage[];
}

const DEFAULT_SETTINGS: Record<string, string> = {
  hero_badge: "Transforming Lives Since 2010",
  hero_title_line1: "Extending",
  hero_title_highlight: "Hope",
  hero_title_line2: "to Every Hand",
  hero_subtitle:
    "Zion Helping Hand Foundation empowers communities through compassion, education, and sustainable development. Together, we build a brighter future for those in need.",
  hero_cta1_text: "Donate Now",
  hero_cta1_link: "/donate",
  hero_cta2_text: "Watch Our Story",
  hero_cta2_link: "/about",
  hero_trust1: "501(c)(3) Certified",
  hero_trust2: "4.9/5 Rating",
  hero_trust3: "10K+ Donors",
  stats_certified: "501(c)(3) Certified",
  stats_rating: "4.9/5 Rating",
  stats_donors: "10K+ Donors",
};

export default function AdminHomepagePage() {
  const [data, setData] = useState<HomepageData | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");
  const [addingImage, setAddingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<"branding" | "hero" | "images" | "sections">("branding");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/homepage");
      if (res.ok) {
        const d: HomepageData = await res.json();
        setData(d);
        setSettings({ ...DEFAULT_SETTINGS, ...d.settings });
      }
    } catch (err) {
      console.error("Failed to fetch homepage data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_settings", settings }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch {
      console.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const addImage = async () => {
    if (!newImageUrl.trim()) return;
    setAddingImage(true);
    try {
      const res = await fetch("/api/admin/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_hero_image",
          url: newImageUrl.trim(),
          alt: newImageAlt.trim(),
        }),
      });
      if (res.ok) {
        setNewImageUrl("");
        setNewImageAlt("");
        setShowImageModal(false);
        fetchData();
      }
    } catch {
      console.error("Failed to add image");
    } finally {
      setAddingImage(false);
    }
  };

  const toggleImage = async (img: HeroImage) => {
    try {
      await fetch(`/api/admin/homepage/${img.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !img.active }),
      });
      fetchData();
    } catch {
      console.error("Failed to toggle image");
    }
  };

  const deleteImage = async (id: number) => {
    if (!confirm("Delete this hero image?")) return;
    try {
      await fetch(`/api/admin/homepage/${id}`, { method: "DELETE" });
      fetchData();
    } catch {
      console.error("Failed to delete image");
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: "branding" as const, label: "Branding", icon: Stamp },
    { id: "hero" as const, label: "Hero Content", icon: Type },
    { id: "images" as const, label: "Hero Images", icon: ImageIcon },
    { id: "sections" as const, label: "Section Settings", icon: Layout },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500 font-medium">Loading homepage settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Homepage Manager</h1>
            <p className="text-sm text-gray-500">Control every aspect of your homepage</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-600 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Preview Site
          </a>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all text-sm font-semibold disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="border-b border-gray-100 px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-all ${
                    activeTab === tab.id
                      ? "border-emerald-500 text-emerald-700"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Branding Tab */}
          {activeTab === "branding" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Logo Upload */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">Site Logo</h3>
                    <p className="text-sm text-gray-500">Upload your organization&apos;s logo. It will appear in the navbar and footer across all pages.</p>
                  </div>
                  <ImageUpload
                    label="Logo Image"
                    value={settings.logo || ""}
                    onChange={(url) => updateSetting("logo", url)}
                    accent="emerald"
                    hint="Recommended: square or wide format, PNG with transparent background. Max 512×512px."
                  />
                  {settings.logo && (
                    <button
                      onClick={() => updateSetting("logo", "")}
                      className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                      Remove logo (use default icon)
                    </button>
                  )}
                </div>

                {/* Preview */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900">Preview</h3>
                  {/* Light navbar preview */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      {settings.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={settings.logo} alt="Logo" className="w-10 h-10 rounded-xl object-contain" />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
                          <span className="text-white text-lg">🤝</span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-emerald-800 leading-tight">Zion Helping Hand</p>
                        <p className="text-[10px] text-emerald-600 uppercase tracking-wider">Foundation</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">Light mode (scrolled navbar)</p>
                  </div>

                  {/* Dark navbar preview */}
                  <div className="bg-emerald-900 rounded-xl border border-emerald-700 p-4">
                    <div className="flex items-center gap-2">
                      {settings.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={settings.logo} alt="Logo" className="w-10 h-10 rounded-xl object-contain" />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
                          <span className="text-white text-lg">🤝</span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-white leading-tight">Zion Helping Hand</p>
                        <p className="text-[10px] text-emerald-200 uppercase tracking-wider">Foundation</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-emerald-400 mt-2">Dark mode (hero / footer)</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Hero Content Tab */}
          {activeTab === "hero" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Form */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={settings.hero_badge}
                      onChange={(e) => updateSetting("hero_badge", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Title Line 1
                      </label>
                      <input
                        type="text"
                        value={settings.hero_title_line1}
                        onChange={(e) => updateSetting("hero_title_line1", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Highlighted Word
                      </label>
                      <input
                        type="text"
                        value={settings.hero_title_highlight}
                        onChange={(e) => updateSetting("hero_title_highlight", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Title Line 2
                    </label>
                    <input
                      type="text"
                      value={settings.hero_title_line2}
                      onChange={(e) => updateSetting("hero_title_line2", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Subtitle / Description
                    </label>
                    <textarea
                      value={settings.hero_subtitle}
                      onChange={(e) => updateSetting("hero_subtitle", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        CTA Button 1 Text
                      </label>
                      <input
                        type="text"
                        value={settings.hero_cta1_text}
                        onChange={(e) => updateSetting("hero_cta1_text", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        CTA Button 1 Link
                      </label>
                      <input
                        type="text"
                        value={settings.hero_cta1_link}
                        onChange={(e) => updateSetting("hero_cta1_link", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        CTA Button 2 Text
                      </label>
                      <input
                        type="text"
                        value={settings.hero_cta2_text}
                        onChange={(e) => updateSetting("hero_cta2_text", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        CTA Button 2 Link
                      </label>
                      <input
                        type="text"
                        value={settings.hero_cta2_link}
                        onChange={(e) => updateSetting("hero_cta2_link", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Trust Badge 1
                      </label>
                      <input
                        type="text"
                        value={settings.hero_trust1}
                        onChange={(e) => updateSetting("hero_trust1", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Trust Badge 2
                      </label>
                      <input
                        type="text"
                        value={settings.hero_trust2}
                        onChange={(e) => updateSetting("hero_trust2", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Trust Badge 3
                      </label>
                      <input
                        type="text"
                        value={settings.hero_trust3}
                        onChange={(e) => updateSetting("hero_trust3", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Live Preview */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 text-white relative overflow-hidden min-h-[400px] flex flex-col justify-center">
                  <div className="absolute inset-0 opacity-10">
                    {(data?.heroImages || [])
                      .filter((img) => img.active)
                      .slice(0, 3)
                      .map((img, i) => (
                        <div
                          key={img.id}
                          className="absolute w-16 h-16 rounded-xl overflow-hidden border-2 border-white/30 shadow-lg animate-float"
                          style={{
                            top: `${20 + i * 25}%`,
                            right: `${10 + i * 15}%`,
                            animationDelay: `${i * 0.8}s`,
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.url} alt={img.alt || ""} className="w-full h-full object-cover" />
                        </div>
                      ))}
                  </div>
                  <div className="relative z-10 text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-emerald-100 text-[10px] font-medium rounded-full border border-white/20 mb-4">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      {settings.hero_badge}
                    </span>
                    <h2 className="text-2xl font-bold leading-tight">
                      {settings.hero_title_line1}{" "}
                      <span className="text-emerald-300">{settings.hero_title_highlight}</span>
                      <br />
                      {settings.hero_title_line2}
                    </h2>
                    <p className="text-xs text-emerald-100/80 mt-3 max-w-xs mx-auto line-clamp-3">
                      {settings.hero_subtitle}
                    </p>
                    <div className="flex justify-center gap-2 mt-4">
                      <span className="px-3 py-1.5 bg-white text-emerald-700 text-[10px] font-bold rounded-full">
                        {settings.hero_cta1_text}
                      </span>
                      <span className="px-3 py-1.5 bg-white/10 text-white text-[10px] font-semibold rounded-full border border-white/20">
                        {settings.hero_cta2_text}
                      </span>
                    </div>
                    <div className="flex justify-center gap-4 mt-3 text-[9px] text-white/40">
                      <span>✓ {settings.hero_trust1}</span>
                      <span>★ {settings.hero_trust2}</span>
                      <span>♥ {settings.hero_trust3}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 text-[9px] text-white/30 flex items-center gap-1">
                    <Palette className="w-3 h-3" />
                    Live Preview
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Hero Images Tab */}
          {activeTab === "images" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Hero Floating Images</h3>
                  <p className="text-sm text-gray-500">
                    These images float and animate across the hero section. Add photos of your community, events, or impact.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={fetchData}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowImageModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 text-sm font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Image
                  </button>
                </div>
              </div>

              {/* Image Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {(data?.heroImages || []).map((img) => (
                  <motion.div
                    key={img.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`relative group rounded-2xl overflow-hidden border-2 transition-all ${
                      img.active
                        ? "border-emerald-300 shadow-md shadow-emerald-500/10"
                        : "border-gray-200 opacity-60"
                    }`}
                  >
                    <div className="aspect-square bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.alt || "Hero image"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleImage(img)}
                        className={`p-1.5 rounded-lg backdrop-blur-sm transition-colors ${
                          img.active
                            ? "bg-emerald-500/80 text-white"
                            : "bg-gray-500/80 text-white"
                        }`}
                        title={img.active ? "Disable" : "Enable"}
                      >
                        {img.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteImage(img.id)}
                        className="p-1.5 rounded-lg bg-red-500/80 text-white backdrop-blur-sm hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {img.active && (
                      <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow" />
                    )}
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
                      <GripVertical className="w-3 h-3" />
                      #{img.sortOrder + 1}
                    </div>
                  </motion.div>
                ))}
              </div>

              {(data?.heroImages || []).length === 0 && (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No hero images yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Add images to create beautiful floating animations in your hero section
                  </p>
                  <button
                    onClick={() => setShowImageModal(true)}
                    className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 inline mr-1" />
                    Add First Image
                  </button>
                </div>
              )}

              {/* Animation preview */}
              {(data?.heroImages || []).filter((i) => i.active).length > 0 && (
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 relative overflow-hidden h-64">
                  <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-2">
                    Animation Preview
                  </p>
                  {(data?.heroImages || [])
                    .filter((i) => i.active)
                    .map((img, i) => {
                      const positions = [
                        { top: "10%", left: "5%", delay: 0 },
                        { top: "60%", right: "8%", delay: 1.5 },
                        { top: "20%", right: "25%", delay: 0.8 },
                        { bottom: "15%", left: "20%", delay: 2 },
                        { top: "40%", left: "45%", delay: 1 },
                        { bottom: "25%", right: "35%", delay: 0.5 },
                        { top: "15%", left: "65%", delay: 1.8 },
                        { bottom: "10%", left: "55%", delay: 2.5 },
                      ];
                      const pos = positions[i % positions.length];
                      return (
                        <motion.div
                          key={img.id}
                          className="absolute w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 border-white/30 shadow-xl"
                          style={pos}
                          animate={{
                            y: [0, -15, 0, 10, 0],
                            x: [0, 8, 0, -8, 0],
                            rotate: [0, 3, 0, -3, 0],
                          }}
                          transition={{
                            duration: 6 + i * 0.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: pos.delay,
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.url} alt={img.alt || ""} className="w-full h-full object-cover" />
                        </motion.div>
                      );
                    })}
                </div>
              )}
            </motion.div>
          )}

          {/* Section Settings Tab */}
          {activeTab === "sections" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 flex items-start gap-3">
                <FileText className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Homepage Sections</p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    The homepage sections (Events, Testimonials, Campaigns, Newsletter) are already linked to your database.
                    Manage their content from their respective admin pages.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Events", desc: "Manage upcoming events shown on homepage", link: "/admin/events", icon: "📅" },
                  { title: "Testimonials", desc: "Manage featured testimonials", link: "/admin/testimonials", icon: "💬" },
                  { title: "Campaigns", desc: "Manage donation campaigns & progress bars", link: "/admin/campaigns", icon: "🎯" },
                  { title: "Blog Posts", desc: "Manage blog content", link: "/admin/content", icon: "📝" },
                  { title: "Members", desc: "Manage registered members", link: "/admin/members", icon: "👥" },
                  { title: "Donations", desc: "View donation records", link: "/admin/donations", icon: "💰" },
                ].map((section) => (
                  <a
                    key={section.title}
                    href={section.link}
                    className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {section.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900">{section.title}</h4>
                      <p className="text-xs text-gray-500">{section.desc}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Add Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Add Hero Image</h3>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <ImageUpload
                  label="Hero Image"
                  value={newImageUrl}
                  onChange={(url) => setNewImageUrl(url)}
                  accent="emerald"
                  hint="Upload an image or paste a URL. Images will appear as floating elements in the hero section."
                />
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Alt Text (optional)
                  </label>
                  <input
                    type="text"
                    value={newImageAlt}
                    onChange={(e) => setNewImageAlt(e.target.value)}
                    placeholder="Description of the image"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => setShowImageModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addImage}
                  disabled={!newImageUrl.trim() || addingImage}
                  className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                >
                  {addingImage ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {addingImage ? "Adding..." : "Add Image"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
