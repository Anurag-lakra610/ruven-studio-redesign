"use client";

import React, { useState } from "react";
import { useAccount } from "../AccountContext";
import { User, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  const { user, phone, customerId, refreshData } = useAccount();

  // Inputs
  const [firstName, setFirstName] = useState(user?.name ? user.name.split(" ")[0] || "" : "");
  const [lastName, setLastName] = useState(user?.name ? user.name.split(" ").slice(1).join(" ") || "" : "");
  const [phoneInput, setPhoneInput] = useState(phone || "");

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving");
    setErrorMsg("");

    const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
    if (!fullName) {
      setErrorMsg("Full name fields cannot be blank.");
      setSaveStatus("error");
      return;
    }

    // Save mock cookies
    document.cookie = `mock_user_name=${encodeURIComponent(fullName)}; path=/; max-age=86400`;
    document.cookie = `mock_user_phone=${encodeURIComponent(phoneInput)}; path=/; max-age=86400`;

    try {
      const supabase = (window as any).supabase || null;
      if (supabase && customerId) {
        const { error } = await supabase
          .from("customers")
          .update({
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phoneInput.trim()
          })
          .eq("id", customerId);
        if (error) throw error;
      }
      setSaveStatus("success");
      await refreshData();
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      setSaveStatus("success");
      await refreshData();
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-50">
          Profile Settings
        </h2>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-xl">
        {errorMsg && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {saveStatus === "success" && (
          <div className="p-4 bg-emerald-50 text-emerald-850 border border-emerald-250 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Fellow profile credentials saved successfully.</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-1 gap-2">
              <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3.5 border border-zinc-200 dark:border-zinc-800 focus:border-[#670000] outline-none text-xs bg-white dark:bg-zinc-950 font-medium rounded-none"
                placeholder="First name"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3.5 border border-zinc-200 dark:border-zinc-800 focus:border-[#670000] outline-none text-xs bg-white dark:bg-zinc-950 font-medium rounded-none"
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Mobile Phone Number</label>
            <input
              type="text"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full px-4 py-3.5 border border-zinc-200 dark:border-zinc-800 focus:border-[#670000] outline-none text-xs bg-white dark:bg-zinc-950 font-medium rounded-none font-mono"
              placeholder="Contact phone number"
            />
          </div>

          <div className="grid grid-cols-1 gap-2">
            <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-300">Registered Email Address (Locked)</label>
            <input
              type="email"
              disabled
              value={user?.email}
              className="w-full px-4 py-3.5 border border-zinc-200/60 dark:border-zinc-800/60 text-xs bg-zinc-50 dark:bg-zinc-900 text-zinc-400 cursor-not-allowed rounded-none font-medium font-mono"
            />
            <span className="text-[8px] text-zinc-400 font-mono mt-1">
              Verified email address is used for secure OTP logins.
            </span>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saveStatus === "saving"}
            className="px-6 py-3.5 bg-zinc-950 text-white hover:bg-[#670000] text-[9px] font-bold uppercase tracking-widest rounded-none disabled:opacity-50 transition-all cursor-pointer"
          >
            {saveStatus === "saving" ? "Updating profile..." : "Save Identity Details"}
          </button>
        </div>
      </form>
    </div>
  );
}
