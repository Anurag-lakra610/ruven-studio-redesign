"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Heart, ShoppingCart, Trash2, Share2 } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlist, addToCart, removeFromWishlist } = useCart();
  const [successToast, setSuccessToast] = useState("");

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

  const handleShareWishlist = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setSuccessToast("Wishlist link copied to clipboard.");
      setTimeout(() => setSuccessToast(""), 3000);
    }
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
          My Saved Pieces
        </h2>
        {wishlist.length > 0 && (
          <button
            onClick={handleShareWishlist}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share List</span>
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="py-24 text-center space-y-6">
          <Heart className="w-8 h-8 text-zinc-300 mx-auto stroke-[1.0]" />
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-widest">
              You haven't saved any products yet.
            </h4>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-xs mx-auto leading-relaxed">
              Stroll through our seasonal collections and save articles for early drop access.
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {wishlist.map((item) => (
            <div key={item.id} className="group relative space-y-4">
              <div className="aspect-[3/4] bg-zinc-50 dark:bg-zinc-900 relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="p-2 bg-white text-zinc-850 hover:text-[#670000] transition-colors shadow-sm cursor-pointer"
                    title="Remove item"
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
