"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Loader2,
  CheckCircle,
  ChevronLeft,
  Smartphone,
  CreditCard,
  Building2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface Campaign {
  id: number;
  title: string;
  description: string;
  goal: number;
  raised: number;
}

const presetAmounts = [50, 100, 200, 500, 1000, 2000];

const paymentMethods = [
  { id: "mobile_money", label: "Mobile Money", icon: Smartphone },
  { id: "card", label: "Card", icon: CreditCard },
  { id: "bank_transfer", label: "Bank Transfer", icon: Building2 },
];

const impactMessages: Record<number, string> = {
  50: "Provides school supplies for 1 child",
  100: "Feeds a family for a week",
  200: "Provides clean water for a community",
  500: "Sponsors a child's education for a month",
  1000: "Funds medical care for a family",
  2000: "Builds infrastructure for a community",
};

export default function PortalDonatePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);

  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [amount, setAmount] = useState<number | null>(100);
  const [customAmount, setCustomAmount] = useState("");
  const [isMonthly, setIsMonthly] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mobile_money");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [donationResult, setDonationResult] = useState<{
    amount: number;
    campaign: string;
  } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/campaigns")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setCampaigns(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoadingCampaigns(false));
  }, []);

  const finalAmount = amount || parseFloat(customAmount) || 0;

  const handlePresetClick = (val: number) => {
    setAmount(val);
    setCustomAmount("");
  };

  const handleCustomChange = (val: string) => {
    setCustomAmount(val);
    setAmount(null);
  };

  const handleSubmit = async () => {
    if (finalAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/portal/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          campaignId: selectedCampaign || undefined,
          isMonthly,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setDonationResult({
        amount: data.donation.amount,
        campaign: data.donation.campaign,
      });
      setSuccess(true);
    } catch {
      setError("Failed to process donation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success && donationResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center py-12"
      >
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Thank You for Your Donation!
        </h2>
        <p className="text-gray-600 mb-1">
          You donated{" "}
          <span className="font-bold text-emerald-600">
            GH₵{donationResult.amount.toLocaleString()}
          </span>
        </p>
        <p className="text-gray-500 text-sm mb-6">
          {donationResult.campaign !== "General Donation"
            ? `to ${donationResult.campaign}`
            : "as a general donation"}
          {isMonthly && " (monthly recurring)"}
        </p>
        <div className="bg-emerald-50 rounded-2xl p-4 mb-8 inline-block">
          <Sparkles className="w-5 h-5 text-emerald-600 inline mr-2" />
          <span className="text-sm text-emerald-700 font-medium">
            Your generosity makes a real difference!
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/portal/donations"
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            View My Donations
          </Link>
          <button
            onClick={() => {
              setSuccess(false);
              setDonationResult(null);
              setAmount(100);
              setCustomAmount("");
              setSelectedCampaign("");
              setIsMonthly(false);
            }}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Donate Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/portal/donations"
          className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Make a Donation</h1>
          <p className="text-sm text-gray-500">
            Support our mission with a contribution
          </p>
        </div>
      </div>

      {/* Campaign Selection */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-4">
        <label className="text-sm font-semibold text-gray-900 mb-3 block">
          Select a Campaign (optional)
        </label>
        {loadingCampaigns ? (
          <div className="flex items-center gap-2 text-sm text-gray-400 py-3">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading campaigns...
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={() => setSelectedCampaign("")}
              className={`w-full text-left p-3 rounded-xl border-2 transition-all text-sm ${
                selectedCampaign === ""
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <p className="font-medium text-gray-900">General Donation</p>
              <p className="text-xs text-gray-500">
                Support wherever the need is greatest
              </p>
            </button>
            {campaigns.map((c) => {
              const progress = Math.min(
                Math.round((c.raised / c.goal) * 100),
                100
              );
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCampaign(c.id.toString())}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all text-sm ${
                    selectedCampaign === c.id.toString()
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">{c.title}</p>
                    <span className="text-xs text-emerald-600 font-semibold">
                      {progress}% funded
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    GH₵{c.raised.toLocaleString()} raised of GH₵
                    {c.goal.toLocaleString()}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Amount Selection */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-4">
        <label className="text-sm font-semibold text-gray-900 mb-3 block">
          Donation Amount
        </label>

        {/* One-time / Monthly Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
          <button
            onClick={() => setIsMonthly(false)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              !isMonthly
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            One-Time
          </button>
          <button
            onClick={() => setIsMonthly(true)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              isMonthly
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Monthly
          </button>
        </div>

        {/* Preset Amounts */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {presetAmounts.map((val) => (
            <button
              key={val}
              onClick={() => handlePresetClick(val)}
              className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                amount === val
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-gray-100 text-gray-700 hover:border-gray-200"
              }`}
            >
              GH₵{val.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">
            GH₵
          </span>
          <input
            type="number"
            placeholder="Enter custom amount"
            value={customAmount}
            onChange={(e) => handleCustomChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Impact Message */}
        <AnimatePresence mode="wait">
          {(amount && impactMessages[amount]) && (
            <motion.div
              key={amount}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-3 flex items-center gap-2 text-sm text-emerald-600"
            >
              <Sparkles className="w-4 h-4" />
              <span>{impactMessages[amount]}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-6">
        <label className="text-sm font-semibold text-gray-900 mb-3 block">
          Payment Method
        </label>
        <div className="grid grid-cols-3 gap-2">
          {paymentMethods.map((pm) => (
            <button
              key={pm.id}
              onClick={() => setPaymentMethod(pm.id)}
              className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl border-2 text-sm transition-all ${
                paymentMethod === pm.id
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-gray-100 text-gray-600 hover:border-gray-200"
              }`}
            >
              <pm.icon className="w-5 h-5" />
              <span className="font-medium text-xs sm:text-sm">{pm.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {/* Summary & Submit */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">
            {isMonthly ? "Monthly" : "One-time"} donation
          </span>
          <span className="text-xl font-bold text-gray-900">
            GH₵{finalAmount.toLocaleString()}
          </span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting || finalAmount <= 0}
          className="w-full py-3.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Heart className="w-4 h-4" />
              Donate GH₵{finalAmount.toLocaleString()}
              {isMonthly && " / month"}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
