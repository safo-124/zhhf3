"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Loader2,
  X,
  RefreshCw,
  Camera,
  Tag,
  FileText,
  Search,
  Grid3X3,
} from "lucide-react";
import ImageUpload, { MultiImageUpload } from "@/components/admin/ImageUpload";

interface GalleryImage {
  id: number;
  url: string;
  caption: string | null;
  category: string | null;
  createdAt: string;
}

const CATEGORIES = ["General", "Events", "Community", "Education", "Healthcare", "Volunteers", "Impact"];

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkUrls, setBulkUrls] = useState("");

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch (err) {
      console.error("Failed to fetch gallery", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const addImage = async () => {
    if (!newUrl.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: newUrl.trim(),
          caption: newCaption.trim() || null,
          category: newCategory,
        }),
      });
      if (res.ok) {
        setNewUrl("");
        setNewCaption("");
        setNewCategory("General");
        setShowModal(false);
        fetchImages();
      }
    } catch {
      console.error("Failed to add image");
    } finally {
      setAdding(false);
    }
  };

  const addBulkImages = async () => {
    const urls = bulkUrls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);
    if (urls.length === 0) return;
    setAdding(true);
    try {
      for (const url of urls) {
        await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, category: newCategory }),
        });
      }
      setBulkUrls("");
      setBulkMode(false);
      setShowModal(false);
      fetchImages();
    } catch {
      console.error("Failed to add bulk images");
    } finally {
      setAdding(false);
    }
  };

  const deleteImage = async (id: number) => {
    if (!confirm("Delete this gallery image?")) return;
    try {
      await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      fetchImages();
    } catch {
      console.error("Failed to delete image");
    }
  };

  const updateImage = async (id: number, data: Partial<GalleryImage>) => {
    try {
      await fetch(`/api/admin/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      fetchImages();
    } catch {
      console.error("Failed to update image");
    }
  };

  const categories = ["All", ...CATEGORIES];
  const filteredImages = images.filter((img) => {
    const matchesFilter = filter === "All" || img.category === filter;
    const matchesSearch =
      !search ||
      img.caption?.toLowerCase().includes(search.toLowerCase()) ||
      img.category?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500 font-medium">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gallery Manager</h1>
            <p className="text-sm text-gray-500">
              {images.length} images · Manage your floating gallery
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchImages}
            className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add Images
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by caption or category..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  filter === cat
                    ? "bg-violet-100 text-violet-700 border border-violet-200"
                    : "bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <AnimatePresence>
          {filteredImages.map((img) => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all bg-white"
            >
              <div className="aspect-square bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.caption || "Gallery"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {/* Top actions */}
                <div className="absolute top-2 right-2 flex gap-1.5">
                  <button
                    onClick={() => deleteImage(img.id)}
                    className="p-1.5 rounded-lg bg-red-500/90 text-white hover:bg-red-600 transition-colors backdrop-blur-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  {img.category && (
                    <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-[10px] font-medium rounded-full mb-1.5">
                      {img.category}
                    </span>
                  )}
                  {img.caption && (
                    <p className="text-white text-xs line-clamp-2">{img.caption}</p>
                  )}
                </div>
              </div>

              {/* Editable category badge */}
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <select
                  value={img.category || "General"}
                  onChange={(e) => updateImage(img.id, { category: e.target.value })}
                  className="text-[10px] bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 border-0 outline-none cursor-pointer appearance-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredImages.length === 0 && !loading && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium text-lg">
            {images.length === 0 ? "No gallery images yet" : "No images match your filter"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {images.length === 0
              ? "Add images to create a beautiful floating gallery on your homepage"
              : "Try adjusting your search or category filter"}
          </p>
          {images.length === 0 && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors"
            >
              <Plus className="w-4 h-4 inline mr-1" />
              Add First Image
            </button>
          )}
        </div>
      )}

      {/* Add Image Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  {bulkMode ? "Bulk Add Images" : "Add Gallery Image"}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setBulkMode(!bulkMode)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      bulkMode
                        ? "bg-violet-100 text-violet-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Grid3X3 className="w-3.5 h-3.5" />
                    Bulk
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {bulkMode ? (
                  <>
                    <MultiImageUpload
                      accent="violet"
                      onUpload={(urls) => {
                        setBulkUrls(urls.join("\n"));
                      }}
                    />
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                      <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-gray-400">or paste URLs</span></div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Image URLs (one per line)
                      </label>
                      <textarea
                        value={bulkUrls}
                        onChange={(e) => setBulkUrls(e.target.value)}
                        rows={5}
                        placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all resize-none font-mono"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        {bulkUrls.split("\n").filter((u) => u.trim()).length} URLs detected
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Category for all
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <ImageUpload
                      label="Gallery Image"
                      value={newUrl}
                      onChange={(url) => setNewUrl(url)}
                      accent="violet"
                      hint="Upload an image or paste a URL"
                    />
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                        <FileText className="w-4 h-4" />
                        Caption (optional)
                      </label>
                      <input
                        type="text"
                        value={newCaption}
                        onChange={(e) => setNewCaption(e.target.value)}
                        placeholder="A beautiful moment..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                        <Tag className="w-4 h-4" />
                        Category
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={bulkMode ? addBulkImages : addImage}
                  disabled={bulkMode ? !bulkUrls.trim() || adding : !newUrl.trim() || adding}
                  className="flex items-center gap-2 px-5 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 disabled:opacity-50 transition-colors"
                >
                  {adding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {adding ? "Adding..." : bulkMode ? "Add All" : "Add Image"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
