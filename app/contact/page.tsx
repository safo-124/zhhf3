"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  Globe,
  Heart,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerContainer";

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    lines: ["P.O. Box 123, Accra", "Greater Accra Region, Ghana"],
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["+233 20 123 4567", "+233 30 456 7890"],
    color: "bg-teal-100 text-teal-600",
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["info@zhhf.org", "support@zhhf.org"],
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Clock,
    title: "Office Hours",
    lines: ["Mon - Fri: 8:00 AM - 5:00 PM", "Sat: 9:00 AM - 1:00 PM"],
    color: "bg-violet-100 text-violet-600",
  },
];

const socials = [
  { name: "Facebook", href: "#", icon: Globe },
  { name: "Twitter / X", href: "#", icon: Globe },
  { name: "Instagram", href: "#", icon: Globe },
  { name: "LinkedIn", href: "#", icon: Globe },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitted(true);
    setLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
            <MessageSquare className="w-12 h-12 text-emerald-200 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Get In <span className="text-emerald-300">Touch</span>
            </h1>
            <p className="text-lg text-emerald-100 max-w-xl mx-auto">
              Have questions or want to get involved? We&apos;d love to hear from you.
              Reach out and let&apos;s make a difference together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {contactInfo.map((info) => (
              <StaggerItem key={info.title}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all text-center h-full"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${info.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <info.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">
                    {info.title}
                  </h3>
                  {info.lines.map((line) => (
                    <p key={line} className="text-xs text-gray-500">
                      {line}
                    </p>
                  ))}
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-emerald-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Form */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl p-10 shadow-xl border border-emerald-200 text-center"
                  >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Message Sent!
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Thank you for reaching out. We&apos;ll get back to you within
                      24-48 hours.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setForm({ name: "", email: "", subject: "", message: "" });
                      }}
                      className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <ScrollReveal>
                      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          Send Us a Message
                        </h2>
                        <p className="text-gray-500 text-sm mb-8">
                          Fill out the form below and we&apos;ll respond as quickly as
                          possible.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-5">
                          <div className="grid md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Full Name *
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="Your name"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email Address *
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Subject *
                            </label>
                            <select
                              name="subject"
                              value={form.subject}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                            >
                              <option value="">Select a subject</option>
                              <option>General Inquiry</option>
                              <option>Donations & Partnerships</option>
                              <option>Volunteer Opportunities</option>
                              <option>Event Information</option>
                              <option>Media & Press</option>
                              <option>Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Message *
                            </label>
                            <textarea
                              name="message"
                              value={form.message}
                              onChange={handleChange}
                              required
                              rows={5}
                              placeholder="Tell us how we can help..."
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none"
                            />
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {loading ? (
                              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <Send className="w-5 h-5" />
                                Send Message
                              </>
                            )}
                          </motion.button>
                        </form>
                      </div>
                    </ScrollReveal>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <ScrollReveal variant="fadeRight">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                  <div className="h-52 bg-gradient-to-br from-emerald-200 to-teal-200 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                      <p className="text-emerald-800 font-semibold text-sm">
                        Accra, Ghana
                      </p>
                      <p className="text-emerald-600 text-xs">
                        Greater Accra Region
                      </p>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-1">
                      ZHHF Headquarters
                    </h3>
                    <p className="text-sm text-gray-500">
                      P.O. Box 123, Accra, Ghana
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fadeRight" delay={0.1}>
                <div className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl p-6 text-white">
                  <Heart className="w-8 h-8 text-emerald-200 mb-3" />
                  <h3 className="font-bold mb-2">Follow Us</h3>
                  <p className="text-emerald-100 text-sm mb-4">
                    Stay connected and see our impact in real-time.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {socials.map((s) => (
                      <a
                        key={s.name}
                        href={s.href}
                        className="px-4 py-2.5 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors text-center border border-white/10"
                      >
                        {s.name}
                      </a>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
