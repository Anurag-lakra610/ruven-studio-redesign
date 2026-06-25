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
  const { user, loadingProfile } = useAccount();

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

  const menuSections = [
    {
      label: "Overview",
      items: [
        { id: "overview", label: "Overview", icon: User, path: "/account" }
      ]
    },
    {
      label: "Orders",
      items: [
        { id: "orders", label: "Orders & Returns", icon: Package, path: "/account/orders" }
      ]
    },
    {
      label: "Favorites",
      items: [
        { id: "wishlist", label: "Wishlist", icon: Heart, path: "/account/wishlist" },
        { id: "recent", label: "Recently Viewed", icon: Clock, path: "/account/recent" },
        { id: "journal", label: "Journal Library", icon: BookOpen, path: "/account/journal" }
      ]
    },
    {
      label: "Membership",
      items: [
        { id: "rewards", label: "Rewards & Milestones", icon: Award, path: "/account/rewards" }
      ]
    },
    {
      label: "Profile Settings",
      items: [
        { id: "profile", label: "Profile Identity", icon: User, path: "/account/profile" },
        { id: "addresses", label: "Saved Addresses", icon: MapPin, path: "/account/addresses" },
        { id: "settings", label: "Preferences", icon: Settings, path: "/account/settings" }
      ]
    },
    {
      label: "Help & Care",
      items: [
        { id: "support", label: "Customer Care", icon: HelpCircle, path: "/support" }
      ]
    }
  ];

  return (
    <div className="w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-12 pb-24 min-h-[75vh] px-4 md:px-8">
      <div className="max-w-[1100px] mx-auto">
        
        {/* Clean Page Title Subheader */}
        <div className="border-b border-zinc-150 dark:border-zinc-800/80 pb-4 mb-8">
          <h1 className="text-lg font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-50">
            Account
          </h1>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono tracking-widest uppercase mt-0.5">
            {user.name}
          </p>
        </div>

        {/* Grid Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Sidebar Menu */}
          <div className="lg:col-span-3 space-y-5 lg:border-r lg:border-zinc-150 lg:dark:border-zinc-800/80 lg:pr-8">
            {menuSections.map((sec) => (
              <div key={sec.label} className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500 block px-2 mt-4 first:mt-0">
                  {sec.label}
                </span>
                
                <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-1 lg:pb-0 scrollbar-none">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const isSel = pathname === item.path;
                    return (
                      <Link
                        key={item.id}
                        href={item.path}
                        className={`flex-shrink-0 lg:flex-none text-left px-3 py-2 text-[11px] font-medium tracking-wide transition-all rounded-none flex items-center gap-2.5 ${
                          isSel
                            ? "text-[#670000] dark:text-red-400 font-semibold border-b-2 lg:border-b-0 lg:border-l-2 border-[#670000] dark:border-red-400 bg-zinc-50 dark:bg-zinc-900/30 pl-3 lg:pl-4"
                            : "text-zinc-500 dark:text-zinc-400 hover:text-[#670000] dark:hover:text-red-400 pl-3"
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isSel ? "text-[#670000] dark:text-red-400" : "text-zinc-400 dark:text-zinc-500"}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
            
            <div className="border-t border-zinc-150 dark:border-zinc-800/80 my-3 hidden lg:block" />
            
            <button
              onClick={handleLogout}
              className="hidden lg:flex text-left px-3 py-2 text-[11px] font-medium tracking-wide text-zinc-500 hover:text-red-600 dark:hover:text-red-400 items-center gap-2.5 cursor-pointer transition-colors w-full"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
              <span>Logout</span>
            </button>
          </div>

          {/* Sub-Page Content */}
          <div className="lg:col-span-9 animate-fade-in pl-0 lg:pl-2">
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
