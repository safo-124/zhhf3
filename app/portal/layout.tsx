"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Gift,
  Calendar,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  ChevronRight,
} from "lucide-react";

const sidebarLinks = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/donations", label: "My Donations", icon: Gift },
  { href: "/portal/events", label: "My Events", icon: Calendar },
  { href: "/portal/profile", label: "Profile", icon: User },
  { href: "/portal/settings", label: "Settings", icon: Settings },
];

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<{
    name: string | null;
    email: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.session) setSession(d.session);
      })
      .catch(() => {});
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  };

  const initials = session?.name
    ? session.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "ME";

  const displayName = session?.name || "Member";
  const displayRole = session?.role === "admin" ? "Admin" : "Member";

  const isActive = (href: string) => {
    if (href === "/portal") return pathname === "/portal";
    return pathname.startsWith(href);
  };

  // Current page title for mobile header
  const currentPage =
    sidebarLinks.find((l) => isActive(l.href))?.label || "Portal";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ====== Mobile Top Bar ====== */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="font-bold text-gray-900 text-sm">{currentPage}</h1>
          <Link
            href="/"
            className="p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Home className="w-5 h-5 text-gray-500" />
          </Link>
        </div>
      </div>

      {/* ====== Mobile Sidebar Overlay ====== */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />

            {/* Sidebar Panel */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white relative">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold mb-3 border-2 border-white/30">
                  {initials}
                </div>
                <h3 className="font-bold text-base">{displayName}</h3>
                <p className="text-emerald-100 text-sm">{displayRole}</p>
              </div>

              {/* Nav */}
              <nav className="flex-1 p-3 overflow-y-auto">
                {sidebarLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors mb-1 ${
                        active
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <link.icon className="w-5 h-5" />
                        {link.label}
                      </span>
                      {active && (
                        <ChevronRight className="w-4 h-4 text-emerald-400" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="p-3 border-t border-gray-100">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors mb-1"
                >
                  <Home className="w-5 h-5" />
                  Back to Site
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ====== Desktop Layout ====== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 lg:pt-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar (hidden on mobile) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
              {/* Profile Header */}
              <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-500 text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mb-3 border-2 border-white/30">
                  {initials}
                </div>
                <h3 className="font-bold">{displayName}</h3>
                <p className="text-emerald-100 text-sm">{displayRole}</p>
              </div>

              {/* Nav Links */}
              <nav className="p-3">
                {sidebarLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors mb-1 ${
                        active
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}
                <hr className="my-2" />
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors mb-1"
                >
                  <Home className="w-5 h-5" />
                  Back to Site
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
