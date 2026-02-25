"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  X,
  RefreshCw,
  ImageIcon,
} from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";


interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category: string;
  published: boolean;
  views: number;
  image: string | null;
  author: string | null;
  createdAt: string;
}

interface PostForm {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  published: boolean;
  image: string;
}

const emptyForm: PostForm = {
  title: "", content: "", excerpt: "", category: "Updates", published: false, image: "",
};

export default function AdminContentPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<PostForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [modalTab, setModalTab] = useState<"details" | "image">("details");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog");
      if (res.ok) setPosts(await res.json());
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalTab("details");
    setShowModal(true);
  };

  const openEdit = (p: BlogPost) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      content: p.content,
      excerpt: p.excerpt || "",
      category: p.category,
      published: p.published,
      image: p.image || "",
    });
    setModalTab("details");
    setShowModal(true);
  };

  const handleSave = async (publish?: boolean) => {
    setSaving(true);
    try {
      const body = {
        title: form.title,
        content: form.content,
        excerpt: form.excerpt || null,
        category: form.category,
        published: publish !== undefined ? publish : form.published,
        image: form.image || null,
      };
      if (editingId) {
        await fetch(`/api/admin/blog/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await fetch("/api/admin/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      setShowModal(false);
      fetchPosts();
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this blog post?")) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    fetchPosts();
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Blog Posts</h1>
            <p className="text-gray-500 mt-1">{posts.length} total posts</p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchPosts} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={openCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">
              <Plus className="w-4 h-4" /> New Post
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Title</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Category</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Author</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Views</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Date</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {post.image && (
                            <div className="w-10 h-10 rounded-lg overflow-hidden relative flex-shrink-0">
                              <Image src={post.image} alt="" fill className="object-cover" />
                            </div>
                          )}
                          <p className="text-sm font-semibold text-gray-900 max-w-xs truncate">{post.title}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 font-semibold">{post.category}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{post.author || "Admin"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{post.views.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          post.published ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        }`}>{post.published ? "Published" : "Draft"}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {post.published && (
                            <a href={`/blog/${post.slug}`} target="_blank" className="p-1.5 hover:bg-gray-100 rounded-lg">
                              <Eye className="w-4 h-4 text-gray-400" />
                            </a>
                          )}
                          <button onClick={() => openEdit(post)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                            <Edit className="w-4 h-4 text-gray-400" />
                          </button>
                          <button onClick={() => handleDelete(post.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {posts.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">No blog posts yet</p>
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
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-8 pt-8 pb-4">
                  <h2 className="text-xl font-bold text-gray-900">{editingId ? "Edit Post" : "New Blog Post"}</h2>
                  <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 px-8 mb-4">
                  {(["details", "image"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setModalTab(tab)}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                        modalTab === tab
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {tab === "details" ? "Details" : "Image"}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="px-8 pb-4 overflow-y-auto flex-1">
                  {modalTab === "details" ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500">
                          <option>Stories</option><option>Updates</option><option>Education</option>
                          <option>Health</option><option>Community</option><option>Impact</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                        <input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                          placeholder="Brief summary..."
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <textarea rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500 resize-none" />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <ImageUpload
                        value={form.image}
                        onChange={(url) => setForm({ ...form, image: url })}
                        label="Blog Post Cover Image"
                        hint="Recommended: 1200×630px. This image becomes the hero section when viewing the blog post."
                      />
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-8 py-5 border-t border-gray-100 bg-gray-50">
                  <button onClick={() => setShowModal(false)}
                    className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-white">Cancel</button>
                  <button onClick={() => handleSave(false)} disabled={saving}
                    className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-white disabled:opacity-50">
                    Save Draft
                  </button>
                  <button onClick={() => handleSave(true)} disabled={saving}
                    className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50">
                    {saving ? "Saving..." : "Publish"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
