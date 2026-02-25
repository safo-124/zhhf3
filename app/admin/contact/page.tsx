"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  Save,
  Loader2,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

interface ContactSettings {
  contact_address_line1: string;
  contact_address_line2: string;
  contact_phone1: string;
  contact_phone2: string;
  contact_email1: string;
  contact_email2: string;
  contact_hours_line1: string;
  contact_hours_line2: string;
  contact_facebook: string;
  contact_twitter: string;
  contact_instagram: string;
  contact_linkedin: string;
  contact_map_label: string;
  contact_map_sublabel: string;
  contact_hq_name: string;
  contact_hq_address: string;
}

const defaults: ContactSettings = {
  contact_address_line1: "P.O. Box 123, Accra",
  contact_address_line2: "Greater Accra Region, Ghana",
  contact_phone1: "+233 20 123 4567",
  contact_phone2: "+233 30 456 7890",
  contact_email1: "info@zhhf.org",
  contact_email2: "support@zhhf.org",
  contact_hours_line1: "Mon - Fri: 8:00 AM - 5:00 PM",
  contact_hours_line2: "Sat: 9:00 AM - 1:00 PM",
  contact_facebook: "#",
  contact_twitter: "#",
  contact_instagram: "#",
  contact_linkedin: "#",
  contact_map_label: "Accra, Ghana",
  contact_map_sublabel: "Greater Accra Region",
  contact_hq_name: "ZHHF Headquarters",
  contact_hq_address: "P.O. Box 123, Accra, Ghana",
};

const fieldGroups = [
  {
    title: "Address",
    icon: MapPin,
    color: "text-emerald-600 bg-emerald-100",
    fields: [
      { key: "contact_address_line1", label: "Address Line 1", placeholder: "P.O. Box 123, Accra" },
      { key: "contact_address_line2", label: "Address Line 2", placeholder: "Greater Accra Region, Ghana" },
    ],
  },
  {
    title: "Phone Numbers",
    icon: Phone,
    color: "text-teal-600 bg-teal-100",
    fields: [
      { key: "contact_phone1", label: "Primary Phone", placeholder: "+233 20 123 4567" },
      { key: "contact_phone2", label: "Secondary Phone", placeholder: "+233 30 456 7890" },
    ],
  },
  {
    title: "Email Addresses",
    icon: Mail,
    color: "text-blue-600 bg-blue-100",
    fields: [
      { key: "contact_email1", label: "Primary Email", placeholder: "info@zhhf.org" },
      { key: "contact_email2", label: "Secondary Email", placeholder: "support@zhhf.org" },
    ],
  },
  {
    title: "Office Hours",
    icon: Clock,
    color: "text-violet-600 bg-violet-100",
    fields: [
      { key: "contact_hours_line1", label: "Weekdays", placeholder: "Mon - Fri: 8:00 AM - 5:00 PM" },
      { key: "contact_hours_line2", label: "Weekend", placeholder: "Sat: 9:00 AM - 1:00 PM" },
    ],
  },
  {
    title: "Social Media Links",
    icon: Globe,
    color: "text-orange-600 bg-orange-100",
    fields: [
      { key: "contact_facebook", label: "Facebook URL", placeholder: "https://facebook.com/..." },
      { key: "contact_twitter", label: "X (Twitter) URL", placeholder: "https://x.com/..." },
      { key: "contact_instagram", label: "Instagram URL", placeholder: "https://instagram.com/..." },
      { key: "contact_linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/..." },
    ],
  },
  {
    title: "Map / HQ Info",
    icon: MapPin,
    color: "text-rose-600 bg-rose-100",
    fields: [
      { key: "contact_map_label", label: "Map Label", placeholder: "Accra, Ghana" },
      { key: "contact_map_sublabel", label: "Map Sub-label", placeholder: "Greater Accra Region" },
      { key: "contact_hq_name", label: "HQ Name", placeholder: "ZHHF Headquarters" },
      { key: "contact_hq_address", label: "HQ Address", placeholder: "P.O. Box 123, Accra, Ghana" },
    ],
  },
];

export default function AdminContactPage() {
  const [form, setForm] = useState<ContactSettings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contact");
      if (res.ok) {
        const data = await res.json();
        setForm({ ...defaults, ...data });
      }
    } catch (err) {
      console.error("Failed to fetch contact settings", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setSaved(true);
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Contact Settings</h1>
          <p className="text-gray-500 mt-1">Manage your contact page information</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchSettings}
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </motion.button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {fieldGroups.map((group) => (
            <div
              key={group.title}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl ${group.color} flex items-center justify-center`}>
                  <group.icon className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-gray-900">{group.title}</h2>
              </div>
              <div className="space-y-4">
                {group.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      value={form[field.key as keyof ContactSettings]}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
