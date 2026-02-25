"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Users,
  DollarSign,
  Calendar,
  FileText,
  MessageSquare,
  Target,
  Home,
  LogOut,
  Shield,
  Layout,
  Camera,
  Info,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/homepage", label: "Homepage", icon: Layout },
  { href: "/admin/about", label: "About Page", icon: Info },
  { href: "/admin/gallery", label: "Gallery", icon: Camera },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/donations", label: "Donations", icon: DollarSign },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/content", label: "Blog Posts", icon: FileText },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/campaigns", label: "Campaigns", icon: Target },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-screen sticky top-0 flex flex-col shadow-sm">
      {/* Brand */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight">ZHHF Admin</h2>
            <p className="text-[11px] text-gray-400 font-medium">Management Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-0.5 flex-1 mt-1">
        <p className="px-3 pt-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Menu
        </p>
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 font-semibold shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-emerald-100"
                    : "bg-gray-50 group-hover:bg-gray-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : ""}`} />
              </div>
              <span className="text-sm">{link.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 space-y-0.5">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-gray-100 flex items-center justify-center transition-colors">
            <Home className="w-4 h-4" />
          </div>
          <span className="text-sm">Back to Site</span>
          <LogOut className="w-3.5 h-3.5 ml-auto text-gray-400" />
        </Link>
      </div>
    </aside>
  );
}
