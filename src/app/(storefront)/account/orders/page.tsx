"use client";

import React, { useState } from "react";
import { useAccount, Order } from "../AccountContext";
import { useCart } from "@/context/CartContext";
import { Package, ExternalLink, Calendar, ShoppingCart, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const { orders, loadingOrders } = useAccount();
  const { addToCart } = useCart();
  const [successToast, setSuccessToast] = useState("");

  const handleDownloadInvoice = (orderNr: string) => {
    setSuccessToast(`Downloading invoice for order ${orderNr}...`);
    setTimeout(() => setSuccessToast(""), 3000);
  };

  const handleBuyAgain = (ord: Order) => {
    // Attempt to extract item name and split by size
    addToCart({
      id: ord.number + "-reorder",
      variantId: ord.number + "-reorder-variant",
      name: ord.items.split("(")[0].trim(),
      slug: "armor-of-light-heavyweight-tee", // fallback standard slug
      price: ord.total,
      size: "M",
      color: "Charcoal",
      image: "/oversized_tee_product.png"
    }, 1);

    setSuccessToast(`Re-added items from order ${ord.number} to cart.`);
    setTimeout(() => setSuccessToast(""), 3000);
  };

  if (loadingOrders) {
    return (
      <div className="space-y-6 animate-pulse">
        {[1, 2].map((i) => (
          <div key={i} className="p-8 border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/10 flex flex-col gap-4">
            <div className="h-4 bg-zinc-100 dark:bg-zinc-800 w-1/4" />
            <div className="h-4 bg-zinc-100 dark:bg-zinc-800 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-6 py-4 rounded-none shadow-xl border border-zinc-800 dark:border-zinc-200 text-xs tracking-wider uppercase font-semibold flex items-center gap-3 animate-fade-in">
          <ShoppingCart className="w-4 h-4 text-[#670000]" />
          <span>{successToast}</span>
        </div>
      )}

      <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-50">
          My Purchase Ledger
        </h2>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center space-y-6">
          <div className="p-5 bg-zinc-50 dark:bg-zinc-900/60 text-[#670000] dark:text-red-400 inline-block rounded-none">
            <Package className="w-8 h-8 stroke-[1.0]" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-widest">
              You haven't placed your first order yet.
            </h4>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-sm mx-auto leading-relaxed">
              Explore our boutique and choose pieces woven with faith and statement.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block px-8 py-3.5 bg-zinc-950 text-white hover:bg-[#670000] text-[10px] tracking-widest font-bold uppercase transition-all rounded-none"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((ord) => (
            <div
              key={ord.number}
              className="p-8 border border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/20 flex flex-col gap-6"
            >
              {/* Card Metadata */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800/60">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono font-bold text-xs text-[#670000] dark:text-red-400 bg-[#670000]/5 px-3 py-1">
                    {ord.number}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 text-[9px] px-2.5 py-1 font-bold uppercase tracking-wider border ${
                    ord.status === "Delivered"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-950"
                      : ord.status === "Processing"
                      ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-950"
                      : "bg-zinc-50 text-zinc-600 border-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      ord.status === "Delivered" ? "bg-emerald-500" : ord.status === "Processing" ? "bg-amber-500 animate-pulse" : "bg-zinc-450"
                    }`} />
                    {ord.status}
                  </span>
                </div>
                
                <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Placed on {ord.date}</span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block">Ordered Artifacts</span>
                <h4 className="text-xs font-semibold tracking-wide text-zinc-800 dark:text-zinc-200 uppercase">
                  {ord.items}
                </h4>
              </div>

              {/* Stepper Timeline */}
              <div className="w-full py-4 border-t border-b border-zinc-100 dark:border-zinc-800/40 my-1">
                <div className="relative flex justify-between items-center w-full max-w-xl mx-auto">
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 dark:bg-zinc-800 -translate-y-1/2" />
                  
                  <div 
                    className="absolute top-1/2 left-0 h-0.5 bg-[#670000] dark:bg-red-500 -translate-y-1/2 transition-all duration-500"
                    style={{
                      width: 
                        ord.status === "Delivered" ? "100%" :
                        ord.status === "Shipped" || ord.status === "Dispatched" ? "66%" :
                        ord.status === "Processing" || ord.status === "Paid" ? "33%" : "0%"
                    }}
                  />
                  
                  {[
                    { nr: "01", label: "Ordered" },
                    { nr: "02", label: "Paid" },
                    { nr: "03", label: "Dispatched" },
                    { nr: "04", label: "Delivered" }
                  ].map((step, idx) => {
                    const isPassed = 
                      idx === 0 ||
                      (idx === 1 && (ord.status === "Processing" || ord.status === "Shipped" || ord.status === "Delivered")) ||
                      (idx === 2 && (ord.status === "Shipped" || ord.status === "Delivered")) ||
                      (idx === 3 && ord.status === "Delivered");
                    return (
                      <div key={idx} className="relative z-10 flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-white dark:border-zinc-950 transition-all ${
                          isPassed ? "bg-[#670000] text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                        }`}>
                          {step.nr}
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-400 mt-2">{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-2">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block font-mono">Amount Paid</span>
                  <span className="text-base font-bold text-zinc-950 dark:text-zinc-50 font-mono">₹{ord.total}</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/tracking?order_number=${ord.number}`}
                    className="px-5 py-3 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-[#670000] hover:text-white dark:hover:bg-[#670000] dark:hover:text-white transition-all text-[9px] font-bold uppercase tracking-widest rounded-none flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Track Cargo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDownloadInvoice(ord.number)}
                    className="px-5 py-3 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-[9px] font-bold uppercase tracking-widest rounded-none cursor-pointer"
                  >
                    Invoice PDF
                  </button>
                  <button
                    onClick={() => handleBuyAgain(ord)}
                    className="px-5 py-3 border border-[#670000] text-[#670000] hover:bg-[#670000] hover:text-white transition-all text-[9px] font-bold uppercase tracking-widest rounded-none cursor-pointer"
                  >
                    Buy Again
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
