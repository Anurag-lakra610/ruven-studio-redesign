"use client";

import React from "react";
import { useAccount } from "../AccountContext";
import { Award, Check, ShieldCheck } from "lucide-react";

export default function RewardsPage() {
  const { loyaltyPoints, lifetimeValue, memberSince, orders } = useAccount();

  // Determine rewards level and next progress
  const tierLimits = { Bronze: 250, Silver: 500, Gold: 1000, Sovereign: 2500 };
  let currentTier = "Bronze";
  let nextTier = "Silver";
  let pointsForNext = 250;

  if (loyaltyPoints >= tierLimits.Sovereign) {
    currentTier = "Sovereign";
    nextTier = "Max Tier";
    pointsForNext = loyaltyPoints;
  } else if (loyaltyPoints >= tierLimits.Gold) {
    currentTier = "Gold";
    nextTier = "Sovereign";
    pointsForNext = tierLimits.Sovereign;
  } else if (loyaltyPoints >= tierLimits.Silver) {
    currentTier = "Silver";
    nextTier = "Gold";
    pointsForNext = tierLimits.Gold;
  } else if (loyaltyPoints >= tierLimits.Bronze) {
    currentTier = "Bronze";
    nextTier = "Silver";
    pointsForNext = tierLimits.Silver;
  }
  const progressPercent = Math.min(100, Math.round((loyaltyPoints / pointsForNext) * 100));

  return (
    <div className="space-y-10">
      <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-50">
          Membership & Benefits
        </h2>
      </div>

      <div className="space-y-8">
        
        {/* Core Member Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-50 dark:bg-zinc-900/40 p-8 border border-zinc-100 dark:border-zinc-800/60">
          <div className="space-y-1">
            <span className="text-[8px] uppercase tracking-widest text-zinc-400 block font-mono">Membership Tier</span>
            <span className="text-xl font-semibold uppercase text-[#670000] dark:text-red-400 flex items-center gap-1.5 pt-0.5">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              {currentTier} Level
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[8px] uppercase tracking-widest text-zinc-400 block font-mono">Member Since</span>
            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide pt-1 block">{memberSince}</span>
          </div>
          <div className="space-y-1">
            <span className="text-[8px] uppercase tracking-widest text-zinc-400 block font-mono">Lifetime Acquisitions</span>
            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide pt-1 block">{orders.length} orders (₹{lifetimeValue.toLocaleString()})</span>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="p-8 border border-zinc-100 dark:border-zinc-800 space-y-4">
          <div className="flex justify-between items-baseline text-xs uppercase tracking-wider text-zinc-500 font-bold">
            <span>Tier Status Milestone</span>
            <span className="font-mono text-[#670000] dark:text-red-400">{loyaltyPoints} / {pointsForNext} XP</span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 relative">
            <div 
              className="absolute top-0 left-0 h-full bg-[#670000] dark:bg-red-500 transition-all duration-500" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
          <p className="text-[10px] text-zinc-400 font-mono">
            {loyaltyPoints >= tierLimits.Sovereign ? (
              "Maximum Sovereign level achieved. You are eligible for early drop campaigns."
            ) : (
              `Acquire ${pointsForNext - loyaltyPoints} more milestone points to upgrade to ${nextTier} Tier.`
            )}
          </p>
        </div>

        {/* Exclusive Lounge Benefits */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-50">Lounge Member Privileges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Complimentary Staged Shipping", desc: "Expedited shipping on all boutique drop acquisitions." },
              { title: "Drop Pre-Access", desc: "Reserve limited batch garment runs 24 hours before public drop." },
              { title: "Devotional Scripture Keepsakes", desc: "Signature linear metal tags and scripture prints included in orders." },
              { title: "Fellowship Invitation", desc: "Access to private local Christian art events and creative panel gatherings." }
            ].map((benefit, i) => (
              <div key={i} className="p-6 border border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/10 flex gap-4 items-start">
                <Check className="w-4 h-4 text-[#670000] dark:text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-wide text-zinc-850 dark:text-zinc-100">{benefit.title}</h4>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
