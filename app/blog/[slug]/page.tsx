"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  Eye,
  BookOpen,
  ChevronRight,
  Loader2,
} from "lucide-react";

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
  Stories: "from-emerald-600 to-teal-600",
  Updates: "from-blue-600 to-indigo-600",
  Education: "from-violet-600 to-purple-600",
  Health: "from-rose-600 to-pink-600",
  Community: "from-amber-600 to-orange-600",
  Impact: "from-teal-600 to-cyan-600",
};

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchPost = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/blog/${slug}`);
      if (!res.ok) {
        setNotFound(true);
        return;
      }
      const data = await res.json();
      setPost(data.post);
      setRelatedPosts(data.related || []);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) fetchPost();
  }, [slug, fetchPost]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const readTime = (content: string) => {
    const words = content.split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
  };

  const getGradient = (category: string) =>
    categoryGradients[category] || "from-emerald-600 to-teal-600";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen">
        <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 bg-gradient-to-r from-emerald-700 to-teal-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <BookOpen className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
            <p className="text-emerald-100 mb-8">
              The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero — Blog Image */}
      <section className="relative h-[60vh] md:h-[70vh] min-h-[400px] overflow-hidden">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(post.category)}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Back button */}
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-all border border-white/20 mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>

              {/* Category badge */}
              <span className="inline-block px-4 py-1.5 bg-emerald-500/20 backdrop-blur-sm text-emerald-200 text-sm font-semibold rounded-full border border-emerald-400/30 mb-4">
                {post.category}
              </span>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                {post.author && (
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    {post.author}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.createdAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {readTime(post.content)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  {post.views.toLocaleString()} views
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-emerald-500 pl-6">
                {post.excerpt}
              </p>
            )}

            {/* Body */}
            <div className="prose prose-lg prose-emerald max-w-none text-gray-700 leading-relaxed">
              {post.content.split("\n").map((paragraph, i) =>
                paragraph.trim() ? (
                  <p key={i} className="mb-6">
                    {paragraph}
                  </p>
                ) : null
              )}
            </div>

            {/* Tags / Category */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold">
                  {post.category}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-white to-emerald-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Posts</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link key={related.id} href={`/blog/${related.slug}`}>
                  <motion.article
                    whileHover={{ y: -4 }}
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 h-full flex flex-col"
                  >
                    <div className="h-40 relative">
                      {related.image ? (
                        <Image
                          src={related.image}
                          alt={related.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${getGradient(related.category)}`} />
                      )}
                      <span className="absolute top-3 right-3 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30">
                        {related.category}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-gray-600 text-sm flex-1 line-clamp-2 mb-3">
                        {related.excerpt || related.content.substring(0, 120)}
                      </p>
                      <span className="text-emerald-600 text-sm font-semibold flex items-center gap-1">
                        Read More <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
