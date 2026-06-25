"use client";

import React from "react";
import { useAccount } from "./AccountContext";
import Link from "next/link";
import { 
  Package, Heart, Clock, MapPin, Award, BookOpen, User, Settings, HelpCircle 
} from "lucide-react";

export default function AccountOverviewPage() {
  const { user } = useAccount();

  if (!user) return null;

  const cards = [
    {
      title: "Orders & Returns",
      desc: "Track, return, or buy items again",
      path: "/account/orders",
      icon: Package
    },
    {
      title: "Wishlist",
      desc: "All your saved editorial pieces",
      path: "/account/wishlist",
      icon: Heart
    },
    {
      title: "Recently Viewed",
      desc: "Browse items you recently explored",
      path: "/account/recent",
      icon: Clock
    },
    {
      title: "Saved Addresses",
      desc: "Manage your home, office, or church addresses",
      path: "/account/addresses",
      icon: MapPin
    },
    {
      title: "Rewards Lounge",
      desc: "View your loyalty tier, XP points, and milestones",
      path: "/account/rewards",
      icon: Award
    },
    {
      title: "Journal Library",
      desc: "Read saved devotionals and bookmarks",
      path: "/account/journal",
      icon: BookOpen
    },
    {
      title: "Profile Identity",
      desc: "Update your name, phone, and password details",
      path: "/account/profile",
      icon: User
    },
    {
      title: "Account Settings",
      desc: "Manage notification and data preferences",
      path: "/account/settings",
      icon: Settings
    },
    {
      title: "Support & Help",
      desc: "Connect with our care team for assistance",
      path: "/support",
      icon: HelpCircle
    }
  ];

  return (
    <div className="space-y-8">
      {/* Profile Header Block */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-8 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-150/80 dark:border-zinc-800/80 gap-6">
        <div className="flex items-center gap-5">
          {/* Minimalist Profile Portrait Box */}
          <div className="w-16 h-16 bg-zinc-900 dark:bg-zinc-800 text-white flex items-center justify-center select-none font-mono text-sm shrink-0 border border-zinc-800">
            {user.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "RS"}
          </div>
          <div className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
              {user.name}
            </h2>
            <p className="text-[10px] text-zinc-500 font-mono tracking-wide">
              {user.email}
            </p>
          </div>
        </div>

        <Link
          href="/account/profile"
          className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 hover:border-[#670000] dark:hover:border-[#670000] hover:text-[#670000] dark:hover:text-[#670000] text-[9px] font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-200 transition-colors bg-white dark:bg-zinc-950 rounded-none w-full md:w-auto text-center cursor-pointer font-semibold"
        >
          Edit Profile
        </Link>
      </div>

      {/* Grid of Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.path}
              href={card.path}
              className="flex flex-col items-center justify-center text-center p-6 md:p-8 border border-zinc-150/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/10 hover:border-[#670000] dark:hover:border-[#670000] transition-all group rounded-none aspect-square relative select-none"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 mb-4 group-hover:bg-[#670000]/5 transition-colors">
                <Icon className="w-5 h-5 text-zinc-400 dark:text-zinc-500 group-hover:text-[#670000] dark:group-hover:text-red-400 transition-colors" />
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-800 dark:text-zinc-100 group-hover:text-[#670000] dark:group-hover:text-red-400 transition-colors mb-2">
                {card.title}
              </h3>
              <p className="text-[9px] text-zinc-400 dark:text-zinc-500 leading-relaxed max-w-[160px] mx-auto">
                {card.desc}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
