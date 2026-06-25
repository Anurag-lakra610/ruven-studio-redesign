"use client";

import React from "react";
import { AccountProvider, useAccount } from "./AccountContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  User, Package, MapPin, Heart, Clock, Award, BookOpen, Settings, LogOut, HelpCircle, ChevronRight 
} from "lucide-react";

function AccountLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loadingProfile, loyaltyPoints, orders } = useAccount();

  if (loadingProfile || !user) {
    return (
      <div className="w-full min-h-[500px] flex flex-col items-center justify-center bg-white dark:bg-zinc-950 gap-4">
        <svg className="animate-spin h-6 w-6 text-zinc-900 dark:text-zinc-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-15" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
          <path className="opacity-85" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-[9px] tracking-[0.3em] text-zinc-400 dark:text-zinc-500 uppercase font-bold animate-pulse">Resolving Session...</span>
      </div>
    );
  }

  const handleLogout = () => {
    document.cookie = "mock_customer_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "mock_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "mock_user_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "mock_user_name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "mock_user_phone=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/login");
  };

  const points = loyaltyPoints || 0;
  let level = "Bronze Member";
  let pointsForNext = 250;
  if (points >= 2500) { level = "Sovereign Member"; pointsForNext = points; }
  else if (points >= 1000) { level = "Gold Member"; pointsForNext = 2500; }
  else if (points >= 500) { level = "Silver Member"; pointsForNext = 1000; }
  else if (points >= 250) { level = "Bronze Member"; pointsForNext = 500; }
  const progressPercent = Math.min(100, Math.round((points / pointsForNext) * 100));

  return (
    <div className="w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-16 px-6 md:px-10 lg:px-12">
      <div className="max-w-[1280px] mx-auto space-y-12">
        
        {/* Lounge Header Area */}
        <div className="w-full border-b border-zinc-100 dark:border-zinc-800 pb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="space-y-3">
              <span className="text-[9px] font-bold tracking-[0.25em] text-zinc-400 uppercase">
                Ruven Member Area
              </span>
              <h1 className="text-3xl font-light tracking-tight text-zinc-900 dark:text-zinc-50 uppercase">
                Welcome back, <span className="font-semibold">{user.name}</span>
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 font-mono text-[10px] text-zinc-500">
                <span className="bg-[#670000]/5 text-[#670000] dark:bg-red-950/20 dark:text-red-400 px-2 py-0.5 font-bold uppercase tracking-wider">
                  {level}
                </span>
                <span className="text-zinc-400">|</span>
                <span>Lifetime: {orders.length} Orders</span>
                <span className="text-zinc-400">|</span>
                <div className="flex items-center gap-2">
                  <span>{points} / {pointsForNext} XP</span>
                  <div className="w-20 bg-zinc-100 dark:bg-zinc-800 h-[2px] relative inline-block">
                    <div className="absolute top-0 left-0 h-full bg-[#670000]" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/shop"
              className="px-8 py-3.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-[#670000] hover:text-white dark:hover:bg-[#670000] dark:hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest rounded-none inline-flex items-center gap-2 cursor-pointer shadow-sm group"
            >
              <span>Continue Shopping</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Sidebar Menu */}
          <div className="lg:col-span-3 space-y-6 lg:border-r lg:border-zinc-100 lg:dark:border-zinc-800/80 lg:pr-8">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 block px-2">
              Lounge Directory
            </span>
            
            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-3 lg:pb-0 scrollbar-none">
              {[
                { id: "orders", label: "My Orders", icon: Package, path: "/account/orders" },
                { id: "wishlist", label: "Wishlist", icon: Heart, path: "/account/wishlist" },
                { id: "recent", label: "Recently Viewed", icon: Clock, path: "/account/recent" },
                { id: "addresses", label: "Saved Addresses", icon: MapPin, path: "/account/addresses" },
                { id: "journal", label: "Journal Library", icon: BookOpen, path: "/account/journal" },
                { id: "rewards", label: "Rewards & Membership", icon: Award, path: "/account/rewards" },
                { id: "profile", label: "Profile Settings", icon: User, path: "/account/profile" },
                { id: "settings", label: "Settings", icon: Settings, path: "/account/settings" },
                { id: "support", label: "Support", icon: HelpCircle, path: "/support" }
              ].map((item) => {
                const Icon = item.icon;
                const isSel = pathname === item.path;
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    className={`flex-shrink-0 lg:flex-none text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider transition-all rounded-none flex items-center gap-3 ${
                      isSel
                        ? "text-[#670000] dark:text-red-400 border-b-2 lg:border-b-0 lg:border-l-2 border-[#670000] dark:border-red-400 bg-zinc-50/50 dark:bg-zinc-900/30 pl-4 lg:pl-5"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 pl-4"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isSel ? "text-[#670000] dark:text-red-400" : "text-zinc-450"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              <button
                onClick={handleLogout}
                className="flex-shrink-0 lg:flex-none text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-red-600 dark:hover:text-red-400 pl-4 flex items-center gap-3 cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4 shrink-0 text-zinc-400" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Dedicated Sub-Page Content */}
          <div className="lg:col-span-9 animate-fade-in">
            {children}
          </div>

        </div>

      </div>
    </div>
  );
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <AccountProvider>
      <AccountLayoutInner>{children}</AccountLayoutInner>
    </AccountProvider>
  );
}
