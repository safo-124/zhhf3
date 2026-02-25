"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Calendar,
  Clock,
  Search,
  User,
  ChevronRight,
  Loader2,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerContainer";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image: string | null;
  category: string;
  author: string | null;
  views: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const categoryGradients: Record<string, string> = {
  Stories: "from-emerald-500 to-teal-500",
  Updates: "from-blue-500 to-indigo-500",
  Education: "from-violet-500 to-purple-500",
  Health: "from-rose-500 to-pink-500",
  Community: "from-amber-500 to-orange-500",
  Impact: "from-teal-500 to-cyan-500",
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blog");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Failed to fetch blog posts", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

  const filtered = posts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filtered.slice(0, 2);
  const restPosts = filtered.slice(2);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const readTime = (content: string) => {
    const words = content.split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
  };

  const getGradient = (category: string) =>
    categoryGradients[category] || "from-emerald-500 to-teal-500";

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 bg-gradient-to-r from-emerald-700 to-teal-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 border-2 border-white rounded-full" />
          <div className="absolute bottom-10 left-10 w-56 h-56 border-2 border-white rounded-full" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <BookOpen className="w-12 h-12 text-emerald-200 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Our <span className="text-emerald-300">Blog</span>
            </h1>
            <p className="text-lg text-emerald-100 max-w-xl mx-auto">
              Stories of hope, updates from the field, and insights on how we&apos;re
              making a difference together.
            </p>
          </motion.div>
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : posts.length === 0 ? (
        <section className="py-24 bg-white text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-400 mb-2">No Blog Posts Yet</h2>
          <p className="text-gray-400">Check back soon for stories and updates.</p>
        </section>
      ) : (
        <>
          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section className="py-16 bg-white border-b border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredPosts.map((post, i) => (
                    <ScrollReveal key={post.id} delay={i * 0.1}>
                      <Link href={`/blog/${post.slug}`}>
                        <motion.article
                          whileHover={{ y: -4 }}
                          className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 h-full"
                        >
                          <div className="h-52 relative">
                            {post.image ? (
                              <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className={`w-full h-full bg-gradient-to-br ${getGradient(post.category)}`} />
                            )}
                            <div className="absolute inset-0 bg-black/30" />
                            <div className="absolute bottom-4 left-4 right-4">
                              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30 mb-2">
                                {post.category}
                              </span>
                              <h2 className="text-xl font-bold text-white leading-tight line-clamp-2">
                                {post.title}
                              </h2>
                            </div>
                          </div>
                          <div className="p-6">
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {post.excerpt || post.content.substring(0, 160)}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                {post.author && (
                                  <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {post.author}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(post.createdAt)}
                                </span>
                              </div>
                              <motion.span
                                whileHover={{ x: 4 }}
                                className="text-emerald-600 text-sm font-semibold flex items-center gap-1"
                              >
                                Read <ChevronRight className="w-4 h-4" />
                              </motion.span>
                            </div>
                          </div>
                        </motion.article>
                      </Link>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* All Posts */}
          <section className="py-16 md:py-24 bg-gradient-to-b from-white to-emerald-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Filters */}
              <ScrollReveal>
                <div className="flex flex-col md:flex-row gap-4 mb-10">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search articles..."
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          activeCategory === cat
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                            : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory + searchQuery}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {restPosts.length === 0 && featuredPosts.length === 0 ? (
                    <div className="text-center py-16">
                      <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-400 mb-2">
                        No Articles Found
                      </h3>
                      <p className="text-gray-400">
                        Try a different search or category
                      </p>
                    </div>
                  ) : restPosts.length === 0 ? null : (
                    <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {restPosts.map((post) => (
                        <StaggerItem key={post.id}>
                          <Link href={`/blog/${post.slug}`}>
                            <motion.article
                              whileHover={{ y: -4 }}
                              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 h-full flex flex-col"
                            >
                              <div className="h-44 relative">
                                {post.image ? (
                                  <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className={`w-full h-full bg-gradient-to-br ${getGradient(post.category)}`} />
                                )}
                                <span className="absolute top-3 right-3 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30">
                                  {post.category}
                                </span>
                              </div>
                              <div className="p-5 flex flex-col flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                  {post.title}
                                </h3>
                                <p className="text-gray-600 text-sm flex-1 line-clamp-3 mb-4">
                                  {post.excerpt || post.content.substring(0, 160)}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
                                  <div className="flex items-center gap-3">
                                    {post.author && (
                                      <span className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        {post.author}
                                      </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {readTime(post.content)}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-400">
                                    {formatDate(post.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </motion.article>
                          </Link>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
