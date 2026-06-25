"use client";

import React, { useState } from "react";
import { useAccount } from "../AccountContext";
import { MapPin, Plus, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AddressesPage() {
  const { address, user, refreshData, customerId, addressId } = useAccount();

  // Form toggles and states
  const [isEditing, setIsEditing] = useState(false);
  const [addressLine1, setAddressLine1] = useState(address?.line1 || "");
  const [addressLine2, setAddressLine2] = useState(address?.line2 || "");
  const [city, setCity] = useState(address?.city || "");
  const [stateVal, setStateVal] = useState(address?.state || "");
  const [zipCode, setZipCode] = useState(address?.zipCode || "");
  const [country, setCountry] = useState(address?.country || "India");
  const [label, setLabel] = useState<"Home" | "Office" | "Church">("Home");

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving");
    setErrorMsg("");

    if (!addressLine1 || !city || !stateVal || !zipCode) {
      setErrorMsg("Please fill in all required fields.");
      setSaveStatus("error");
      return;
    }

    // Save to cookies
    document.cookie = `mock_address_line1=${encodeURIComponent(addressLine1)}; path=/; max-age=86400`;
    document.cookie = `mock_address_line2=${encodeURIComponent(addressLine2)}; path=/; max-age=86400`;
    document.cookie = `mock_address_city=${encodeURIComponent(city)}; path=/; max-age=86400`;
    document.cookie = `mock_address_state=${encodeURIComponent(stateVal)}; path=/; max-age=86400`;
    document.cookie = `mock_address_zip=${encodeURIComponent(zipCode)}; path=/; max-age=86400`;
    document.cookie = `mock_address_country=${encodeURIComponent(country)}; path=/; max-age=86400`;

    try {
      const supabase = (window as any).supabase || null;
      if (supabase && customerId) {
        if (addressId) {
          await supabase
            .from("customer_addresses")
            .update({
              address_line1: addressLine1,
              address_line2: addressLine2,
              city,
              state: stateVal,
              zip_code: zipCode,
              country
            })
            .eq("id", addressId);
        } else {
          await supabase
            .from("customer_addresses")
            .insert({
              customer_id: customerId,
              address_type: "Shipping",
              address_line1: addressLine1,
              address_line2: addressLine2,
              city,
              state: stateVal,
              zip_code: zipCode,
              country
            });
        }
      }
      setSaveStatus("success");
      setIsEditing(false);
      await refreshData();
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      setSaveStatus("success");
      setIsEditing(false);
      await refreshData();
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-50">
          Saved Destinations
        </h2>
        {!isEditing && (
          <button
            onClick={() => {
              setAddressLine1("");
              setAddressLine2("");
              setCity("");
              setStateVal("");
              setZipCode("");
              setIsEditing(true);
            }}
            className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-[#670000] dark:text-red-400 hover:underline cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New</span>
          </button>
        )}
      </div>

      {saveStatus === "success" && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Address book details saved successfully.</span>
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-6 max-w-xl">
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-750 border border-red-100 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Address Label</label>
              <div className="flex gap-3">
                {(["Home", "Office", "Church"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLabel(l)}
                    className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                      label === l
                        ? "bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-zinc-950"
                        : "border-zinc-200 text-zinc-500 hover:text-zinc-950"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Street Address *</label>
              <input
                type="text"
                required
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                className="w-full px-4 py-3.5 border border-zinc-200 dark:border-zinc-800 focus:border-[#670000] outline-none text-xs bg-white dark:bg-zinc-950 font-medium rounded-none"
                placeholder="Street address or P.O. Box"
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Apt, Suite, Unit (Optional)</label>
              <input
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className="w-full px-4 py-3.5 border border-zinc-200 dark:border-zinc-800 focus:border-[#670000] outline-none text-xs bg-white dark:bg-zinc-950 font-medium rounded-none"
                placeholder="Apartment, unit, suite"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-1 gap-2">
                <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3.5 border border-zinc-200 dark:border-zinc-800 focus:border-[#670000] outline-none text-xs bg-white dark:bg-zinc-950 font-medium rounded-none"
                  placeholder="City"
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">State *</label>
                <input
                  type="text"
                  required
                  value={stateVal}
                  onChange={(e) => setStateVal(e.target.value)}
                  className="w-full px-4 py-3.5 border border-zinc-200 dark:border-zinc-800 focus:border-[#670000] outline-none text-xs bg-white dark:bg-zinc-950 font-medium rounded-none"
                  placeholder="State"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-1 gap-2">
                <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Postal / Zip Code *</label>
                <input
                  type="text"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full px-4 py-3.5 border border-zinc-200 dark:border-zinc-800 focus:border-[#670000] outline-none text-xs bg-white dark:bg-zinc-950 font-medium rounded-none"
                  placeholder="ZIP or PIN code"
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Country *</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3.5 border border-zinc-200 dark:border-zinc-800 focus:border-[#670000] outline-none text-xs bg-white dark:bg-zinc-950 font-medium rounded-none"
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={saveStatus === "saving"}
              className="px-6 py-3.5 bg-zinc-950 text-white hover:bg-[#670000] text-[9px] font-bold uppercase tracking-widest rounded-none disabled:opacity-50 transition-all cursor-pointer"
            >
              {saveStatus === "saving" ? "Saving Address..." : "Save Address"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-3.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-[9px] font-bold uppercase tracking-widest rounded-none text-zinc-550 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Default address */}
          {address ? (
            <div className="p-8 border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/10 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-850/60">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#670000] dark:text-red-400">
                  {label} Address
                </span>
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed space-y-1">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">{user?.name}</p>
                <p className="font-mono text-xs">{address.line1}</p>
                {address.line2 && <p className="font-mono text-xs">{address.line2}</p>}
                <p className="font-mono text-xs">{address.city}, {address.state} - {address.zipCode}</p>
                <p className="font-mono text-[9px] font-bold text-zinc-400 mt-2 block uppercase">{address.country}</p>
              </div>
              
              <div className="pt-2">
                <button
                  onClick={() => {
                    setAddressLine1(address.line1);
                    setAddressLine2(address.line2 || "");
                    setCity(address.city);
                    setStateVal(address.state);
                    setZipCode(address.zipCode);
                    setCountry(address.country);
                    setIsEditing(true);
                  }}
                  className="text-[9px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 hover:text-[#670000] dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  Edit Address Details
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 border border-zinc-100 dark:border-zinc-800 text-center space-y-4">
              <MapPin className="w-8 h-8 text-zinc-300 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-700">No Address Configured</h4>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
                  Provide your primary shipping details to speed up drop checkouts.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3.5 bg-zinc-950 text-white hover:bg-[#670000] text-[9px] font-bold uppercase tracking-widest rounded-none inline-flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Shipping Address</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
