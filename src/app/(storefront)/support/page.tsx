"use client";

import React, { useState } from "react";
import { HelpCircle, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orderNr, setOrderNr] = useState("");
  const [details, setDetails] = useState("");

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    if (!name || !email || !details) {
      setErrorMsg("Please complete all required fields.");
      setStatus("error");
      return;
    }

    setTimeout(() => {
      setStatus("success");
      setName("");
      setEmail("");
      setOrderNr("");
      setDetails("");
    }, 1200);
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-20 px-6 md:px-12 lg:px-20 min-h-[calc(100vh-160px)]">
      <div className="max-w-[700px] mx-auto space-y-12">
        
        {/* Editorial Header */}
        <div className="space-y-4 border-b border-zinc-100 dark:border-zinc-800 pb-8 text-center sm:text-left">
          <span className="text-[9px] font-bold tracking-[0.25em] text-zinc-400 uppercase block">
            Boutique Concierge
          </span>
          <h1 className="text-3xl font-light tracking-tight uppercase text-zinc-900 dark:text-zinc-50">
            Contact Fellowship Support
          </h1>
          <p className="text-xs text-zinc-500 max-w-lg leading-relaxed">
            Need sizing assistance, order details updates, or drop exchanges? Drop us a line and our fellowship support concierge will resolve it within 12 hours.
          </p>
        </div>

        {status === "success" && (
          <div className="p-5 bg-emerald-50 text-emerald-850 border border-emerald-250 text-xs flex gap-3 items-start rounded-none">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wide">Query Registered Successfully</span>
              <p className="text-[11px] text-zinc-650 leading-relaxed font-mono">
                We have received your support ticket. A concierge fellow will contact you shortly.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-750 border border-red-100 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid grid-cols-1 gap-2">
                <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3.5 border border-zinc-200 dark:border-zinc-800 focus:border-[#670000] outline-none text-xs bg-white dark:bg-zinc-950 font-medium rounded-none"
                  placeholder="Enter your name"
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 border border-zinc-200 dark:border-zinc-800 focus:border-[#670000] outline-none text-xs bg-white dark:bg-zinc-950 font-medium rounded-none font-mono"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Order Number (Optional)</label>
              <input
                type="text"
                value={orderNr}
                onChange={(e) => setOrderNr(e.target.value)}
                className="w-full px-4 py-3.5 border border-zinc-200 dark:border-zinc-800 focus:border-[#670000] outline-none text-xs bg-white dark:bg-zinc-950 font-medium rounded-none font-mono"
                placeholder="e.g. RU-83921"
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Query Details *</label>
              <textarea
                required
                rows={5}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-4 py-3.5 border border-zinc-200 dark:border-zinc-800 focus:border-[#670000] outline-none text-xs bg-white dark:bg-zinc-950 font-medium rounded-none resize-none leading-relaxed"
                placeholder="Provide detailed information regarding your query..."
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
            <button
              type="submit"
              disabled={status === "sending"}
              className="px-8 py-3.5 bg-zinc-950 text-white hover:bg-[#670000] text-[10px] font-bold uppercase tracking-widest rounded-none transition-all disabled:opacity-50 cursor-pointer"
            >
              {status === "sending" ? "Submitting query..." : "Submit Support Query"}
            </button>
            
            <Link
              href="/shop"
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-950 text-center py-2 transition-colors"
            >
              &larr; Return to Shopping
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
}
