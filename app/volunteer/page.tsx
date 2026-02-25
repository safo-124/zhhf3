"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HandHeart,
  CheckCircle,
  ArrowRight,
  Heart,
  Users,
  Globe,
  Calendar,
  Star,
  MapPin,
  Clock,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerContainer";

const roles = [
  { title: "Community Outreach", description: "Help coordinate events and connect with local communities.", icon: Users },
  { title: "Health & Wellness", description: "Assist in medical camps as a healthcare volunteer.", icon: Heart },
  { title: "Education Support", description: "Tutor students and support our scholarship programs.", icon: Star },
  { title: "Administrative", description: "Help with office work, data entry, and organization.", icon: Calendar },
  { title: "Fundraising", description: "Plan and execute campaigns to raise funds for our programs.", icon: Globe },
  { title: "Field Operations", description: "Travel to communities and assist with project implementation.", icon: MapPin },
];

export default function VolunteerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    availability: "",
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
            <HandHeart className="w-12 h-12 text-emerald-200 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Become a <span className="text-emerald-300">Volunteer</span>
            </h1>
            <p className="text-lg text-emerald-100 max-w-xl mx-auto">
              Lend your time, skills, and passion to help us create lasting
              change in communities that need it most.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { value: 2500, suffix: "+", label: "Active Volunteers" },
              { value: 50000, suffix: "+", label: "Hours Contributed" },
              { value: 45, suffix: "", label: "Communities Served" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">
                  <AnimatedCounter end={s.value} suffix={s.suffix} />
                </div>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Roles */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-emerald-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                Opportunities
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Ways You Can <span className="gradient-text">Help</span>
              </h2>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <StaggerItem key={role.title}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <role.icon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {role.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{role.description}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
                      Application Received!
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Thank you for your interest in volunteering with ZHHF.
                      Our team will review your application and get back to you
                      within 3-5 business days.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setForm({
                          name: "",
                          email: "",
                          phone: "",
                          role: "",
                          availability: "",
                          message: "",
                        });
                      }}
                      className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                      Submit Another Application
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
                          Volunteer Application
                        </h2>
                        <p className="text-gray-500 text-sm mb-8">
                          Tell us about yourself and how you&apos;d like to help.
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
                                Email *
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
                          <div className="grid md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Phone
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="+233 XX XXX XXXX"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Area of Interest *
                              </label>
                              <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                              >
                                <option value="">Select a role</option>
                                {roles.map((r) => (
                                  <option key={r.title}>{r.title}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Availability *
                            </label>
                            <select
                              name="availability"
                              value={form.availability}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                            >
                              <option value="">
                                Select your availability
                              </option>
                              <option>Weekdays (Full-time)</option>
                              <option>Weekdays (Part-time)</option>
                              <option>Weekends Only</option>
                              <option>Flexible / As Needed</option>
                              <option>Remote / Virtual</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Why do you want to volunteer?
                            </label>
                            <textarea
                              name="message"
                              value={form.message}
                              onChange={handleChange}
                              rows={4}
                              placeholder="Tell us about your motivation and any relevant experience..."
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
                                <HandHeart className="w-5 h-5" />
                                Submit Application
                                <ArrowRight className="w-4 h-4" />
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

            {/* Sidebar - Benefits */}
            <div className="lg:col-span-2">
              <ScrollReveal variant="fadeRight">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl p-6 text-white mb-6">
                  <Star className="w-8 h-8 text-emerald-200 mb-3" />
                  <h3 className="font-bold text-lg mb-4">
                    Why Volunteer With Us?
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Make real community impact",
                      "Gain valuable experience",
                      "Join 2,500+ changemakers",
                      "Receive recognition & certificates",
                      "Flexible scheduling",
                      "Professional networking",
                    ].map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-start gap-3 text-sm"
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-200 flex-shrink-0 mt-0.5" />
                        <span className="text-emerald-50">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fadeRight" delay={0.1}>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <Clock className="w-8 h-8 text-emerald-500 mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">
                    Quick Process
                  </h3>
                  <div className="space-y-4">
                    {[
                      { step: "1", text: "Submit your application" },
                      { step: "2", text: "We review within 3-5 days" },
                      { step: "3", text: "Brief orientation session" },
                      { step: "4", text: "Start making an impact!" },
                    ].map((s) => (
                      <div key={s.step} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold flex items-center justify-center flex-shrink-0">
                          {s.step}
                        </div>
                        <span className="text-sm text-gray-600">{s.text}</span>
                      </div>
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
