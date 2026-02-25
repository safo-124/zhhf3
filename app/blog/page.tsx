"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Clock,
  Search,
  User,
  ChevronRight,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerContainer";

type BlogCategory = "All" | "Stories" | "Updates" | "Education" | "Health" | "Community";

const blogCategories: BlogCategory[] = [
  "All",
  "Stories",
  "Updates",
  "Education",
  "Health",
  "Community",
];

const posts = [
  {
    id: 1,
    title: "How Clean Water Changed Abena's Village",
    excerpt: "When our team first arrived in the rural village of Abokobi, access to clean water was a distant dream. Today, the story is remarkably different.",
    author: "Grace Addo",
    date: "2025-01-15",
    readTime: "5 min read",
    category: "Stories" as BlogCategory,
    gradient: "from-emerald-500 to-teal-500",
    featured: true,
  },
  {
    id: 2,
    title: "2024 Annual Report: Numbers That Tell Our Story",
    excerpt: "A comprehensive look at what we accomplished together in 2024 — from the families helped to the communities transformed.",
    author: "James Asante",
    date: "2025-01-10",
    readTime: "8 min read",
    category: "Updates" as BlogCategory,
    gradient: "from-blue-500 to-indigo-500",
    featured: true,
  },
  {
    id: 3,
    title: "Scholarship Program: 200 Students and Counting",
    excerpt: "Our education initiative continues to grow. Meet some of the brilliant young minds benefiting from your generous donations.",
    author: "Samuel Osei",
    date: "2025-01-05",
    readTime: "4 min read",
    category: "Education" as BlogCategory,
    gradient: "from-violet-500 to-purple-500",
    featured: false,
  },
  {
    id: 4,
    title: "Health Camps: Reaching the Unreachable",
    excerpt: "Our mobile health camps travel to remote areas where healthcare facilities are scarce, providing essential check-ups and medicine.",
    author: "Esther Nkrumah",
    date: "2024-12-28",
    readTime: "6 min read",
    category: "Health" as BlogCategory,
    gradient: "from-rose-500 to-pink-500",
    featured: false,
  },
  {
    id: 5,
    title: "Volunteer Spotlight: Meet the Hands That Help",
    excerpt: "Behind every successful initiative are the dedicated volunteers who give their time and energy. Here are some of their stories.",
    author: "Abena Boateng",
    date: "2024-12-20",
    readTime: "5 min read",
    category: "Community" as BlogCategory,
    gradient: "from-amber-500 to-orange-500",
    featured: false,
  },
  {
    id: 6,
    title: "The Power of Partnership: Corporate Allies",
    excerpt: "How strategic partnerships with businesses are amplifying our impact and helping us reach more communities faster.",
    author: "Rev. David Mensah",
    date: "2024-12-15",
    readTime: "4 min read",
    category: "Updates" as BlogCategory,
    gradient: "from-teal-500 to-cyan-500",
    featured: false,
  },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = posts.filter((post) => {
    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = posts.filter((p) => p.featured);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-gradient-to-r from-emerald-700 to-teal-600 overflow-hidden">
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

      {/* Featured Posts */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {featuredPosts.map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 0.1}>
                <motion.article
                  whileHover={{ y: -4 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 h-full"
                >
                  <div
                    className={`h-52 bg-gradient-to-br ${post.gradient} relative`}
                  >
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30 mb-2">
                        {post.category}
                      </span>
                      <h2 className="text-xl font-bold text-white leading-tight">
                        {post.title}
                      </h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.date)}
                        </span>
                      </div>
                      <motion.span
                        whileHover={{ x: 4 }}
                        className="text-emerald-600 text-sm font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        Read <ChevronRight className="w-4 h-4" />
                      </motion.span>
                    </div>
                  </div>
                </motion.article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

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
                {blogCategories.map((cat) => (
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
              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">
                    No Articles Found
                  </h3>
                  <p className="text-gray-400">
                    Try a different search or category
                  </p>
                </div>
              ) : (
                <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((post) => (
                    <StaggerItem key={post.id}>
                      <motion.article
                        whileHover={{ y: -4 }}
                        className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 h-full flex flex-col"
                      >
                        <div
                          className={`h-36 bg-gradient-to-br ${post.gradient} relative`}
                        >
                          <span className="absolute top-3 right-3 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30">
                            {post.category}
                          </span>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 text-sm flex-1 line-clamp-3 mb-4">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {post.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {post.readTime}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">
                              {formatDate(post.date)}
                            </span>
                          </div>
                        </div>
                      </motion.article>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
