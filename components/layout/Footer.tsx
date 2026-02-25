"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  HandHeart,
  Heart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ArrowUp,
} from "lucide-react";

const footerLinks = {
  "Quick Links": [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Programs", href: "/programs" },
    { name: "Events", href: "/events" },
    { name: "Blog", href: "/blog" },
  ],
  "Get Involved": [
    { name: "Donate", href: "/donate" },
    { name: "Volunteer", href: "/volunteer" },
    { name: "Partner With Us", href: "/contact" },
    { name: "Fundraise", href: "/donate" },
  ],
  Resources: [
    { name: "Annual Report", href: "/about" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "FAQ", href: "/faq" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gradient-to-b from-emerald-950 to-emerald-950 text-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-900/20 rounded-full -translate-x-48 -translate-y-48 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-800/10 rounded-full translate-x-36 translate-y-36 blur-3xl" />

      {/* CTA Banner */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-8 md:p-12 overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 border-2 border-white rounded-full" />
            <div className="absolute bottom-4 left-4 w-24 h-24 border-2 border-white rounded-full" />
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Ready to Make a Difference?
              </h3>
              <p className="text-emerald-100 text-lg">
                Join us in creating lasting change in communities worldwide.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 font-bold rounded-full shadow-xl hover:shadow-2xl transition-all text-lg whitespace-nowrap"
              >
                <Heart className="w-5 h-5" />
                Donate Now
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <HandHeart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">
                  Zion Helping Hand
                </h4>
                <span className="text-xs text-emerald-300 tracking-wider uppercase">
                  Foundation
                </span>
              </div>
            </Link>
            <p className="text-emerald-200/80 text-sm leading-relaxed mb-6 max-w-sm">
              Empowering communities through compassion, education, and
              sustainable development. Together, we can build a brighter future
              for those in need.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:info@zhhf.org"
                className="flex items-center gap-3 text-sm text-emerald-200/80 hover:text-emerald-300 transition-colors"
              >
                <Mail className="w-4 h-4 text-emerald-400" />
                info@zhhf.org
              </a>
              <a
                href="tel:+15551234567"
                className="flex items-center gap-3 text-sm text-emerald-200/80 hover:text-emerald-300 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                +1 (555) 123-4567
              </a>
              <div className="flex items-center gap-3 text-sm text-emerald-200/80">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                123 Hope Street, Charity City, CC 12345
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {title}
              </h5>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-emerald-200/70 hover:text-emerald-300 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-emerald-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-emerald-300/60 text-center md:text-left">
              &copy; {new Date().getFullYear()} Zion Helping Hand Foundation.
              All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-full bg-emerald-800/50 flex items-center justify-center text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.1, y: -3 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 w-12 h-12 bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center hover:bg-emerald-500 transition-colors z-40"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
}
