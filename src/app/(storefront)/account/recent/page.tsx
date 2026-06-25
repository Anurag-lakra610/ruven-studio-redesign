"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Clock, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";

export default function RecentPage() {
  const { addToCart } = useCart();
  const [history, setHistory] = useState<any[]>([]);
  const [successToast, setSuccessToast] = useState("");

  useEffect(() => {
    // Fetch mock stroll history from localStorage or cookies
    const getCookie = (name: string) => {
      if (typeof document === "undefined") return "";
      const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)"));
      return match ? decodeURIComponent(match[2]) : "";
    };

    const isCustomer = getCookie("mock_customer_session") === "true";
    if (isCustomer) {
      setHistory([
        { id: "f1111111-1111-1111-1111-111111111113", name: "Armor of Light Heavyweight Zip Hoodie", slug: "armor-of-light-heavyweight-zip-hoodie", price: 3799.00, image: "/faith_hoodie_product.png" },
        { id: "f1111111-1111-1111-1111-111111111114", name: "Guard Your Heart Oversized Tee", slug: "guard-your-heart-oversized-tee", price: 1999.00, image: "/oversized_tee_product.png" }
      ]);
    }
  }, []);

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      variantId: item.id + "-variant",
      name: item.name,
      slug: item.slug,
      price: item.price,
      size: "M",
      color: "Charcoal",
      image: item.image
    }, 1);

    setSuccessToast(`"${item.name}" added to your cart.`);
    setTimeout(() => setSuccessToast(""), 3000);
  };

  const handleClearHistory = (itemId: string) => {
    setHistory(prev => prev.filter(i => i.id !== itemId));
  };

  return (
    <div className="space-y-8">
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-6 py-4 rounded-none shadow-xl border border-zinc-800 dark:border-zinc-200 text-xs tracking-wider uppercase font-semibold flex items-center gap-3 animate-fade-in">
          <ShoppingCart className="w-4 h-4 text-[#670000]" />
          <span>{successToast}</span>
        </div>
      )}

      <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-50">
          Recently Strolled
        </h2>
        {history.length > 0 && (
          <button
            onClick={() => setHistory([])}
            className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-[#670000] dark:hover:text-red-400 transition-colors cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-24 text-center space-y-6">
          <Clock className="w-8 h-8 text-zinc-300 mx-auto stroke-[1.0]" />
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-widest">
              Your stroll history is empty.
            </h4>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-xs mx-auto leading-relaxed">
              Explore the storefront to discover scripture-woven premium garments.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block px-8 py-3.5 bg-zinc-950 text-white hover:bg-[#670000] text-[10px] tracking-widest font-bold uppercase transition-all rounded-none"
            >
              Continue Browsing
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {history.map((item) => (
            <div key={item.id} className="group relative space-y-4">
              <div className="aspect-[3/4] bg-zinc-50 dark:bg-zinc-900 relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleClearHistory(item.id)}
                    className="p-2 bg-white text-zinc-850 hover:text-red-700 transition-colors shadow-sm cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  onClick={() => handleAddToCart(item)}
                  className="absolute bottom-4 left-4 right-4 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 py-3 text-[9px] tracking-widest font-bold uppercase rounded-none opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[#670000] hover:text-white dark:hover:bg-[#670000] dark:hover:text-white flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold uppercase tracking-wide truncate text-zinc-900 dark:text-zinc-50">
                  {item.name}
                </h4>
                <p className="text-[10px] font-mono text-zinc-500 font-bold">₹{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
