"use client";

import React, { useState } from "react";
import { Settings, CheckCircle2, Lock } from "lucide-react";

export default function SettingsPage() {
  const [successToast, setSuccessToast] = useState("");

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessToast("Lounge settings and communication preferences updated.");
    setTimeout(() => setSuccessToast(""), 3000);
  };

  return (
    <div className="space-y-8">
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-6 py-4 rounded-none shadow-xl border border-zinc-800 dark:border-zinc-200 text-xs tracking-wider uppercase font-semibold flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{successToast}</span>
        </div>
      )}

      <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-50">
          Preferences & Privacy
        </h2>
      </div>

      <form onSubmit={handleSavePreferences} className="space-y-8 max-w-xl">
        {/* Newsletters */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-850 dark:text-zinc-150">Communication Staging</h3>
          <div className="space-y-3">
            {[
              { id: "newsletter", title: "Reflections & Journal devotionals", desc: "Monthly scriptural essays and collection design insights", checked: true },
              { id: "drops", title: "Drop early notifications", desc: "Receive early invite links 24 hours prior to public batch releases", checked: true },
              { id: "sms", title: "SMS dispatch alerts", desc: "Real-time shipping timeline updates sent directly to your phone", checked: false }
            ].map((item) => (
              <label key={item.id} className="flex gap-4 p-4 border border-zinc-100 dark:border-zinc-800 bg-zinc-50/10 dark:bg-zinc-900/10 select-none cursor-pointer">
                <input 
                  type="checkbox" 
                  defaultChecked={item.checked} 
                  className="w-4 h-4 mt-0.5 border-zinc-300 rounded-none text-[#670000] focus:ring-[#670000] shrink-0" 
                />
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-wide block text-zinc-900 dark:text-zinc-100">{item.title}</span>
                  <p className="text-[10px] text-zinc-450 leading-relaxed">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Visual theme preference */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-850 dark:text-zinc-150">Lounge Canvas Theme</h3>
          <div className="flex gap-4">
            {["Light", "Dark"].map((themeVal) => (
              <button
                key={themeVal}
                type="button"
                onClick={() => {
                  if (themeVal === "Dark") {
                    document.documentElement.classList.add("dark");
                  } else {
                    document.documentElement.classList.remove("dark");
                  }
                  setSuccessToast(`Visual preference set to ${themeVal} mode.`);
                  setTimeout(() => setSuccessToast(""), 3000);
                }}
                className="px-6 py-2.5 border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer rounded-none text-zinc-700 dark:text-zinc-300"
              >
                {themeVal} Theme
              </button>
            ))}
          </div>
        </div>

        {/* Locked security info */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-850 dark:text-zinc-150">Security</h3>
          <div className="p-5 border border-zinc-100 dark:border-zinc-800 flex items-start gap-4 text-xs">
            <Lock className="w-4 h-4 text-zinc-450 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <span className="font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide block">Verification Tokens</span>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                Your account runs exclusively on passwordless OTP verification links to ensure maximum security.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-3.5 bg-zinc-950 text-white hover:bg-[#670000] text-[9px] font-bold uppercase tracking-widest rounded-none transition-all cursor-pointer"
          >
            Update Preference Settings
          </button>
        </div>
      </form>
    </div>
  );
}
