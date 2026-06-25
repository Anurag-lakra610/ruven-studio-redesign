"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { MockProduct, MockDevotional } from "@/lib/db";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import {
  Search,
  Heart,
  User,
  ShoppingBag,
  Menu,
  X,
  Plus,
  Minus,
  Trash2,
  ChevronRight,
  ArrowRight
} from "lucide-react";

// Helper to highlight matched query keyword in search results
const highlightKeyword = (text: string, query: string) => {
  if (!query.trim()) return <span className="text-text-primary">{text}</span>;
  const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
  return (
    <span className="text-text-primary">
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase().trim() ? (
          <mark key={i} className="bg-transparent text-brand-burgundy font-bold underline decoration-brand-burgundy/30 p-0">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export const Header: React.FC = () => {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("Anurag Lakra");
  const [memberLevel, setMemberLevel] = useState("Silver Member");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    document.cookie = "mock_customer_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "mock_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "mock_user_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "mock_user_name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "mock_user_phone=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    
    try {
      const supabase = createClient();
      supabase.auth.signOut().then(() => {
        setIsAuthenticated(false);
        router.push("/login");
      });
      return;
    } catch (e) {
      console.warn(e);
    }
    setIsAuthenticated(false);
    router.push("/login");
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchUserName = async () => {
      const getCookie = (name: string) => {
        if (typeof document === "undefined") return "";
        const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)"));
        return match ? decodeURIComponent(match[2]) : "";
      };
      
      const cookieName = getCookie("mock_user_name");
      if (cookieName) {
        setUserName(cookieName);
      }

      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          if (user.user_metadata?.first_name) {
            setUserName(`${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`.trim());
          } else if (user.email) {
            setUserName(user.email.split("@")[0]);
          }
          
          const { data: customer } = await supabase
            .from("customers")
            .select("first_name, last_name, loyalty_points")
            .eq("email", user.email)
            .maybeSingle();
            
          if (customer) {
            const fullName = [customer.first_name, customer.last_name].filter(Boolean).join(" ");
            if (fullName) setUserName(fullName);
            
            const points = customer.loyalty_points || 0;
            if (points >= 2500) setMemberLevel("Sovereign Member");
            else if (points >= 1000) setMemberLevel("Gold Member");
            else if (points >= 500) setMemberLevel("Silver Member");
            else setMemberLevel("Bronze Member");
          }
        }
      } catch (err) {
        console.warn("Header user metadata fetch failed:", err);
      }
    };
    
    fetchUserName();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isProfileDropdownOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".profile-dropdown-container")) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isProfileDropdownOpen]);

  useEffect(() => {
    const checkAuth = async () => {
      const getCookie = (name: string) => {
        if (typeof document === "undefined") return "";
        const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)"));
        return match ? decodeURIComponent(match[2]) : "";
      };
      const isMockCustomer = getCookie("mock_customer_session") === "true";
      const isMockAdmin = getCookie("mock_admin_session") === "true";
      if (isMockCustomer || isMockAdmin) {
        setIsAuthenticated(true);
        return;
      }

      const isDummy =
        process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("dummy") ||
        !process.env.NEXT_PUBLIC_SUPABASE_URL;

      if (isDummy) {
        return;
      }

      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    const isDummy =
      process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("dummy") ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!isDummy) {
      try {
        const supabase = createClient();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (session) {
            setIsAuthenticated(true);
          } else {
            const getCookie = (name: string) => {
              if (typeof document === "undefined") return "";
              const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)"));
              return match ? decodeURIComponent(match[2]) : "";
            };
            const isMockCustomer = getCookie("mock_customer_session") === "true";
            const isMockAdmin = getCookie("mock_admin_session") === "true";
            setIsAuthenticated(isMockCustomer || isMockAdmin);
          }
        });
        return () => {
          subscription.unsubscribe();
        };
      } catch (e) {
        console.error(e);
      }
    }
  }, []);
  
  // Custom Spotlight Search states
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<MockProduct[]>([]);
  const [allDevotionals, setAllDevotionals] = useState<MockDevotional[]>([]);
  // BUG 3: Menu product prices — loaded on mount for dynamic display
  const [menuProducts, setMenuProducts] = useState<MockProduct[]>([]);

  useEffect(() => {
    import("@/lib/db").then((db) => db.getProducts()).then(setMenuProducts);
  }, []);

  const getMenuPrice = (slug: string) => {
    const p = menuProducts.find((m) => m.slug === slug);
    return p ? `₹${p.base_price.toFixed(0)}` : "—";
  };
  const [searchResults, setSearchResults] = useState<{
    products: MockProduct[];
    devotionals: MockDevotional[];
    collections: { name: string; slug: string }[];
  }>({ products: [], devotionals: [], collections: [] });
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ruven_recent_searches");
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      } else {
        const defaults = ["tee", "hoodie", "renewal", "Romans 12:2"];
        setRecentSearches(defaults);
        localStorage.setItem("ruven_recent_searches", JSON.stringify(defaults));
      }
    }
  }, []);

  const addRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
      const next = [trimmed, ...filtered].slice(0, 5);
      localStorage.setItem("ruven_recent_searches", JSON.stringify(next));
      return next;
    });
  };

  const {
    cart,
    wishlist,
    isCartOpen,
    isWishlistOpen,
    isSearchOpen,
    searchQuery,
    setCartOpen,
    setWishlistOpen,
    setSearchOpen,
    setSearchQuery,
    removeFromCart,
    updateCartQty,
    removeFromWishlist,
    addToCart
  } = useCart();

  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Fetch search sources on overlay open
  useEffect(() => {
    if (isSearchOpen) {
      Promise.all([
        import("@/lib/db").then((db) => db.getProducts()),
        import("@/lib/db").then((db) => db.getDevotionals())
      ]).then(([productsData, devotionalsData]) => {
        setAllProducts(productsData);
        setAllDevotionals(devotionalsData);
      });
      setSearchQuery("");
      setActiveItemIndex(0);
    }
  }, [isSearchOpen, setSearchQuery]);

  // Live filter query debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ products: [], devotionals: [], collections: [] });
      setActiveItemIndex(0);
      return;
    }

    setSearching(true);
    const delayDebounce = setTimeout(() => {
      const query = searchQuery.toLowerCase().trim();

      const filteredProducts = allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (p.scripture &&
            (p.scripture.book.toLowerCase().includes(query) ||
              p.scripture.text_content.toLowerCase().includes(query)))
      );

      const filteredDevotionals = allDevotionals.filter(
        (d) =>
          d.title.toLowerCase().includes(query) ||
          d.summary.toLowerCase().includes(query)
      );

      const mockCollections = [
        { name: "Oversized Tees", slug: "oversized-tees" },
        { name: "French Terry Hoodies", slug: "hoodies" },
        { name: "Streetwear", slug: "streetwear" }
      ];
      const filteredCollections = mockCollections.filter((c) =>
        c.name.toLowerCase().includes(query)
      );

      setSearchResults({
        products: filteredProducts,
        devotionals: filteredDevotionals,
        collections: filteredCollections
      });
      setActiveItemIndex(0);
      setSearching(false);
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, allProducts, allDevotionals]);

  // Flatten results for keyboard traversal
  const flatResults: {
    type: "product" | "devotional" | "collection";
    id: string;
    title: string;
    subtitle?: string;
    url: string;
    image?: string;
  }[] = [];

  searchResults.collections.forEach((c) => {
    flatResults.push({
      type: "collection",
      id: c.slug,
      title: c.name,
      subtitle: "Collection Catalog",
      url: `/shop?category=${c.slug}`
    });
  });

  searchResults.products.forEach((p) => {
    flatResults.push({
      type: "product",
      id: p.id,
      title: p.name,
      subtitle: `₹${p.base_price.toFixed(0)} — ${p.category_slug || "Apparel"}`,
      url: `/products/${p.slug}`,
      image: p.image
    });
  });

  searchResults.devotionals.forEach((d) => {
    flatResults.push({
      type: "devotional",
      id: d.id,
      title: d.title,
      subtitle: `By ${d.author} — Journal Devotional`,
      url: `/journal/${d.slug}`,
      image: d.cover_image_url
    });
  });

  // Keyboard navigation & Shortcuts listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
      if (isSearchOpen && flatResults.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setActiveItemIndex((prev) => (prev + 1) % flatResults.length);
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setActiveItemIndex((prev) => (prev - 1 + flatResults.length) % flatResults.length);
        }
        if (e.key === "Enter") {
          e.preventDefault();
          const activeItem = flatResults[activeItemIndex];
          if (activeItem) {
            addRecentSearch(searchQuery.trim() || activeItem.title);
            setSearchOpen(false);
            router.push(activeItem.url);
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, flatResults, activeItemIndex, router, setSearchOpen]);

  const cartTotalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery.trim());
      setSearchOpen(false);
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (tag: string) => {
    addRecentSearch(tag);
    setSearchQuery(tag);
    setSearchOpen(false);
    router.push(`/shop?search=${encodeURIComponent(tag)}`);
  };

  const handleQuickAddToCart = (wishItem: any) => {
    addToCart(
      {
        id: wishItem.id,
        variantId: `${wishItem.id}-default`,
        name: wishItem.name,
        slug: wishItem.slug,
        price: wishItem.price,
        size: "M", // Default quick add size
        color: "Ink Black",
        image: wishItem.image
      },
      1
    );
    setWishlistOpen(false);
    setCartOpen(true);
  };

  return (
    <>
      {/* ── Announcement ticker ─────────────────────────────────────────────────
           6-GROUP INFINITE TICKER:
           To prevent empty gaps on wide or ultra-wide screens, we render 6 copies
           of the content block inside a track with no track-level gap.
           Each group has gap: 2rem and padding-right: 2rem.
           The track translates by exactly -16.666667% (1/6th of total width),
           meaning it loops perfectly and seamlessly with no gaps or jumps.
      ─────────────────────────────────────────────────────────────────────── */}
      <div className="announcement-bar" role="marquee" aria-label="Announcement ticker">
        <div className="announcement-track">

          {/* Copy 1 */}
          <div className="announcement-group">
            <span>Designed to Start Conversations About Christ</span>
            <svg className="announcement-cross" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 2h4v5h6v4h-6v11h-4v-11h-6v-4h6z"/></svg>
            <span>Premium Quality&nbsp;&bull;&nbsp;Faith Inspired&nbsp;&bull;&nbsp;Limited Collections</span>
            <svg className="announcement-cross" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 2h4v5h6v4h-6v11h-4v-11h-6v-4h6z"/></svg>
            <span>Made with Purpose</span>
            <svg className="announcement-cross" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 2h4v5h6v4h-6v11h-4v-11h-6v-4h6z"/></svg>
          </div>

          {/* Copy 2 */}
          <div className="announcement-group" aria-hidden="true">
            <span>Designed to Start Conversations About Christ</span>
            <svg className="announcement-cross" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 2h4v5h6v4h-6v11h-4v-11h-6v-4h6z"/></svg>
            <span>Premium Quality&nbsp;&bull;&nbsp;Faith Inspired&nbsp;&bull;&nbsp;Limited Collections</span>
            <svg className="announcement-cross" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 2h4v5h6v4h-6v11h-4v-11h-6v-4h6z"/></svg>
            <span>Made with Purpose</span>
            <svg className="announcement-cross" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 2h4v5h6v4h-6v11h-4v-11h-6v-4h6z"/></svg>
          </div>

          {/* Copy 3 */}
          <div className="announcement-group" aria-hidden="true">
            <span>Designed to Start Conversations About Christ</span>
            <svg className="announcement-cross" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 2h4v5h6v4h-6v11h-4v-11h-6v-4h6z"/></svg>
            <span>Premium Quality&nbsp;&bull;&nbsp;Faith Inspired&nbsp;&bull;&nbsp;Limited Collections</span>
            <svg className="announcement-cross" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 2h4v5h6v4h-6v11h-4v-11h-6v-4h6z"/></svg>
            <span>Made with Purpose</span>
            <svg className="announcement-cross" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 2h4v5h6v4h-6v11h-4v-11h-6v-4h6z"/></svg>
          </div>

          {/* Copy 4 */}
          <div className="announcement-group" aria-hidden="true">
            <span>Designed to Start Conversations About Christ</span>
            <svg className="announcement-cross" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 2h4v5h6v4h-6v11h-4v-11h-6v-4h6z"/></svg>
            <span>Premium Quality&nbsp;&bull;&nbsp;Faith Inspired&nbsp;&bull;&nbsp;Limited Collections</span>
            <svg className="announcement-cross" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 2h4v5h6v4h-6v11h-4v-11h-6v-4h6z"/></svg>
            <span>Made with Purpose</span>
            <svg className="announcement-cross" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 2h4v5h6v4h-6v11h-4v-11h-6v-4h6z"/></svg>
          </div>

          {/* Copy 5 */}
          <div className="announcement-group" aria-hidden="true">
            <span>Designed to Start Conversations About Christ</span>
            <svg className="announcement-cross" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 2h4v5h6v4h-6v11h-4v-11h-6v-4h6z"/></svg>
            <span>Premium Quality&nbsp;&bull;&nbsp;Faith Inspired&nbsp;&bull;&nbsp;Limited Collections</span>
            <svg className="announcement-cross" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 2h4v5h6v4h-6v11h-4v-11h-6v-4h6z"/></svg>
            <span>Made with Purpose</span>
            <svg className="announcement-cross" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 2h4v5h6v4h-6v11h-4v-11h-6v-4h6z"/></svg>
          </div>

          {/* Copy 6 */}
          <div className="announcement-group" aria-hidden="true">
            <span>Designed to Start Conversations About Christ</span>
            <svg className="announcement-cross" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 2h4v5h6v4h-6v11h-4v-11h-6v-4h6z"/></svg>
            <span>Premium Quality&nbsp;&bull;&nbsp;Faith Inspired&nbsp;&bull;&nbsp;Limited Collections</span>
            <svg className="announcement-cross" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 2h4v5h6v4h-6v11h-4v-11h-6v-4h6z"/></svg>
            <span>Made with Purpose</span>
            <svg className="announcement-cross" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 2h4v5h6v4h-6v11h-4v-11h-6v-4h6z"/></svg>
          </div>

        </div>
      </div>


      {/* Main Header */}
      <header className="header" id="site-header">
        {/* Brand Logo */}
        <Link href="/" className="brand-logo">
          <Image
            src="/logo.png"
            alt="Ruven Studio Logo"
            width={120}
            height={50}
            className="brand-logo-img"
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-desktop">
          <ul className="nav-links">
            <li className="nav-item mega-menu-trigger">
              <Link href="/shop" className="nav-link">
                Shop
              </Link>

              {/* Mega Menu Dropdown */}
              <div className="mega-menu">
                <div className="mega-menu-grid grid grid-cols-1 md:grid-cols-5 gap-8 max-w-7xl mx-auto py-4">
                  {/* Column 1: Categories */}
                  <div className="mega-menu-col space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-light-muted pb-1 border-b border-border-warm/30">Categories</h4>
                    <div className="flex flex-col gap-3">
                      <Link href="/shop?category=oversized-tees" className="text-xs text-text-primary hover:text-brand-burgundy transition-colors font-medium">Oversized Tees</Link>
                      <Link href="/shop?category=hoodies" className="text-xs text-text-primary hover:text-brand-burgundy transition-colors font-medium">Premium Hoodies</Link>
                      <Link href="/shop?category=sweatshirts" className="text-xs text-text-primary hover:text-brand-burgundy transition-colors font-medium">French Terry Sweatshirts</Link>
                      <Link href="/shop" className="text-xs text-text-primary hover:text-brand-burgundy transition-colors font-medium">Accessories</Link>
                      <Link href="/shop" className="text-xs text-text-primary hover:text-brand-burgundy transition-colors font-medium text-brand-burgundy">Browse Catalog</Link>
                    </div>
                  </div>

                  {/* Column 2: Collections */}
                  <div className="mega-menu-col space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-light-muted pb-1 border-b border-border-warm/30">Collections</h4>
                    <div className="flex flex-col gap-3">
                      <Link href="/shop?filter=new-arrivals" className="text-xs text-text-primary hover:text-brand-burgundy transition-colors font-medium">Renewal Drop '26</Link>
                      <Link href="/shop?filter=best-sellers" className="text-xs text-text-primary hover:text-brand-burgundy transition-colors font-medium">Faith Essentials</Link>
                      <Link href="/shop" className="text-xs text-text-primary hover:text-brand-burgundy transition-colors font-medium">Grace & Peace Capsule</Link>
                      <Link href="/shop" className="text-xs text-text-primary hover:text-brand-burgundy transition-colors font-medium">Sovereign Heavyweights</Link>
                    </div>
                  </div>

                  {/* Column 3: Featured Product */}
                  <div className="mega-menu-col space-y-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-light-muted pb-1 border-b border-border-warm/30">Featured Product</h4>
                    <Link href="/products/armor-of-light-heavyweight-tee" className="mega-item group block">
                      <div className="mega-item-img-wrap aspect-[4/3] w-full overflow-hidden bg-bg-card border border-border-warm rounded-none mb-3">
                        <img src="/oversized_tee_product.png" alt="Featured Product" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-text-primary group-hover:text-brand-burgundy transition-colors">Armor of Light Tee</h5>
                      <p className="text-[10px] text-brand-burgundy font-bold mt-0.5">{getMenuPrice("armor-of-light-heavyweight-tee")}</p>
                    </Link>
                  </div>

                  {/* Column 4: Trending */}
                  <div className="mega-menu-col space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-light-muted pb-1 border-b border-border-warm/30">Trending Items</h4>
                    <div className="flex flex-col gap-3">
                      <Link href="/products/renewal-of-mind-french-terry-hoodie" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-bg-card border border-border-warm overflow-hidden flex-shrink-0">
                          <img src="/faith_hoodie_product.png" alt="Trending hoodie" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[11px] font-semibold text-text-primary block truncate group-hover:text-brand-burgundy transition-colors">Renewal Hoodie</span>
                          <span className="text-[10px] text-text-muted block">{getMenuPrice("renewal-of-mind-french-terry-hoodie")}</span>
                        </div>
                      </Link>
                      <Link href="/products/armor-of-light-heavyweight-tee" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-bg-card border border-border-warm overflow-hidden flex-shrink-0">
                          <img src="/oversized_tee_product.png" alt="Trending tee" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[11px] font-semibold text-text-primary block truncate group-hover:text-brand-burgundy transition-colors">Armor of Light Tee</span>
                          <span className="text-[10px] text-text-muted block">{getMenuPrice("armor-of-light-heavyweight-tee")}</span>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Column 5: Verse Inspiration — BUG 19: blockquote semantic markup */}
                  <div className="mega-menu-col space-y-4 border-l border-border-warm/40 pl-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-light-muted pb-1 border-b border-border-warm/30">Verse Inspiration</h4>
                    <div className="space-y-3 font-sans">
                      <blockquote className="border-l-2 border-text-primary pl-3 italic text-[13px] text-text-primary leading-relaxed m-0">
                        &ldquo;Put on the whole armor of God, that you may be able to stand against the schemes of the devil.&rdquo;
                      </blockquote>
                      <div>
                        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-text-secondary block">— Ephesians 6:11</span>
                        <p className="text-[11px] text-text-light-muted mt-1">The inspiration behind our active Armor Drop.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="nav-item">
              <Link href="/shop?filter=new-arrivals" className="nav-link">
                New Arrivals
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/#story-section" className="nav-link">
                Our Story
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/#community-section" className="nav-link">
                Community
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/journal/the-armor-of-light" className="nav-link">
                Journal
              </Link>
            </li>
          </ul>
        </nav>

        {/* Header Actions */}
        <div className="nav-actions">
          <button
            onClick={() => setSearchOpen(true)}
            className="nav-action-btn"
            aria-label="Open Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={() => setWishlistOpen(true)}
            className="nav-action-btn"
            aria-label="Open Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="badge-count">
                {wishlist.length}
              </span>
            )}
          </button>

          <div className="relative profile-dropdown-container flex items-center">
            {isAuthenticated ? (
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="nav-action-btn cursor-pointer"
                aria-label="Account Menu"
              >
                <User className="w-5 h-5" />
              </button>
            ) : (
              <Link
                href={`/login?redirect=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname + window.location.search : "")}`}
                className="nav-action-btn"
                aria-label="Login"
              >
                <User className="w-5 h-5" />
              </Link>
            )}

            {isProfileDropdownOpen && isAuthenticated && (
              <div className="absolute right-0 top-full mt-2 w-[240px] bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 shadow-xl z-50 p-5 rounded-none text-left animate-fade-in font-sans">
                <div className="space-y-3">
                  {/* Title / Welcome */}
                  <div className="space-y-0.5">
                    <h4 className="text-[11px] font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wide">
                      Hello {userName.split(" ")[0]}
                    </h4>
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono tracking-wider uppercase">
                      {memberLevel}
                    </p>
                  </div>

                  <div className="border-b border-zinc-150 dark:border-zinc-800/80 my-2" />

                  {/* Primary CTA */}
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      router.push("/shop");
                    }}
                    className="w-full text-center py-2.5 bg-[#670000] text-white hover:bg-black transition-colors text-[9px] font-bold uppercase tracking-widest rounded-none cursor-pointer"
                  >
                    Continue Shopping
                  </button>

                  <div className="border-b border-zinc-150 dark:border-zinc-800/80 my-2" />

                  {/* Nav links */}
                  <div className="space-y-2">
                    {[
                      { label: "My Orders", path: "/account/orders" },
                      { label: "Wishlist", path: "/account/wishlist" },
                      { label: "Recently Viewed", path: "/account/recent" },
                      { label: "Saved Addresses", path: "/account/addresses" },
                      { label: "Journal Library", path: "/account/journal" },
                      { label: "Rewards & Tier", path: "/account/rewards" }
                    ].map((link) => (
                      <Link
                        key={link.path}
                        href={link.path}
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-[#670000] dark:hover:text-red-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  <div className="border-b border-zinc-150 dark:border-zinc-800/80 my-2" />

                  {/* Edit Profile & Sign out */}
                  <div className="space-y-2">
                    <Link
                      href="/account/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-[#670000] dark:hover:text-red-400 transition-colors"
                    >
                      Edit Profile
                    </Link>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left text-[10px] font-bold uppercase tracking-wider text-[#670000] dark:text-red-400 hover:underline cursor-pointer transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="nav-action-btn"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartTotalItems > 0 && (
              <span className="badge-count">
                {cartTotalItems}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="mobile-menu-toggle"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* SEARCH OVERLAY */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#111111]/40 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-0"
          >
            {/* Click outside search modal to close */}
            <div className="absolute inset-0 z-0" onClick={() => setSearchOpen(false)} />

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-[800px] bg-white dark:bg-zinc-900 rounded-none flex flex-col shadow-2xl border border-border-warm overflow-hidden"
            >
              {/* Input Header */}
              <div className="h-[64px] border-b border-border-warm flex items-center px-6 gap-3.5 bg-white dark:bg-zinc-950">
                <Search className="w-5 h-5 text-text-muted flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search products, collections, journal articles or Bible verses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-base bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-text-primary placeholder:text-text-light-muted font-sans"
                  autoFocus
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery("")} className="text-text-muted hover:text-text-primary p-1">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <span className="text-[9px] font-bold border border-border-warm px-1.5 py-0.5 text-text-muted select-none rounded-none hidden sm:inline-block">
                  ESC
                </span>
              </div>

              {/* Suggestions / Results */}
              <div className="flex-1 overflow-y-auto max-h-[480px] bg-white dark:bg-zinc-900">
                {searching ? (
                  /* Loading Skeletons */
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-zinc-100 dark:bg-zinc-800 w-1/3 animate-pulse rounded-none" />
                    <div className="space-y-3">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-none" />
                          <div className="flex-grow space-y-2">
                            <div className="h-3.5 bg-zinc-100 dark:bg-zinc-800 w-2/3 animate-pulse rounded-none" />
                            <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 w-1/3 animate-pulse rounded-none" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : !searchQuery.trim() ? (
                  /* Empty state - Spotlight dashboard (Simplified to Recent Searches & Trending Products) */
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-border-warm/30 bg-white dark:bg-zinc-900">
                    {/* Left side: Recent Searches */}
                    <div className="space-y-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-light-muted block">
                        Recent Searches
                      </span>
                      {recentSearches.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => handleSuggestionClick(tag)}
                              className="px-3.5 py-1.5 bg-bg-card dark:bg-zinc-800 text-[11px] text-text-primary hover:bg-brand-burgundy hover:text-white transition-colors cursor-pointer rounded-none border border-border-warm/50 font-sans"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-text-light-muted font-sans">No recent searches.</p>
                      )}
                    </div>

                    {/* Right side: Trending Products */}
                    <div className="md:pl-8 pt-6 md:pt-0 space-y-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-light-muted block">
                        Trending Products
                      </span>
                      <div className="flex flex-col gap-3.5 font-sans">
                        {allProducts.slice(0, 3).map((prod) => (
                          <Link
                            key={prod.id}
                            href={`/products/${prod.slug}`}
                            onClick={() => {
                              addRecentSearch(prod.name);
                              setSearchOpen(false);
                            }}
                            className="flex items-center gap-3.5 group animate-fadeIn"
                          >
                            <div className="w-10 h-10 relative bg-zinc-50 dark:bg-zinc-800 border border-border-warm flex-shrink-0 overflow-hidden">
                              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-semibold text-text-primary block truncate group-hover:text-brand-burgundy transition-colors">
                                {prod.name}
                              </span>
                              <span className="text-[10px] text-text-light-muted block mt-0.5">
                                ₹{prod.base_price.toFixed(0)}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : flatResults.length === 0 ? (
                  /* No Results state */
                  <div className="p-12 text-center space-y-2.5">
                    <p className="text-sm text-text-muted font-sans">
                      No results found for "<strong className="text-text-primary font-semibold">{searchQuery}</strong>".
                    </p>
                    <p className="text-xs text-text-light-muted font-sans">
                      Try searching for "tee", "hoodie", or a scripture citation like "Romans".
                    </p>
                  </div>
                ) : (
                  /* List Results */
                  <div className="divide-y divide-border-warm/30 py-2 font-sans">
                    <div className="px-6 pb-2 pt-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-text-light-muted">
                        Search Results ({flatResults.length})
                      </span>
                    </div>
                    {flatResults.map((item, idx) => {
                      const isActive = idx === activeItemIndex;
                      return (
                        <Link
                          key={item.id}
                          href={item.url}
                          onClick={() => {
                            addRecentSearch(searchQuery || item.title);
                            setSearchOpen(false);
                          }}
                          className={`flex items-center gap-4 px-6 py-3.5 transition-all select-none border-l-2 ${
                            isActive
                              ? "bg-bg-card dark:bg-zinc-800/50 border-brand-burgundy pl-7"
                              : "border-transparent hover:bg-bg-secondary"
                          }`}
                        >
                          {item.image ? (
                            <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-800 flex-shrink-0 overflow-hidden border border-border-warm rounded-none">
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-border-warm rounded-none">
                              <span className="text-[9px] font-bold text-text-light-muted tracking-widest uppercase">
                                {item.type.slice(0, 3)}
                              </span>
                            </div>
                          )}
                          <div className="flex-grow min-w-0">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary truncate">
                              {highlightKeyword(item.title, searchQuery)}
                            </h4>
                            <p className="text-[10px] text-text-muted truncate mt-0.5 uppercase tracking-wider">
                              {item.subtitle}
                            </p>
                          </div>
                          {isActive && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-burgundy flex items-center gap-1.5 flex-shrink-0 animate-pulse">
                              Open <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer navigation guide */}
              <div className="h-[44px] bg-bg-card dark:bg-zinc-950 border-t border-border-warm flex items-center px-6 justify-between text-[10px] text-text-light-muted tracking-wider uppercase font-semibold">
                <div className="flex items-center gap-4">
                  <span>
                    <kbd className="border border-border-warm px-1.5 py-0.5 text-[8px] bg-white dark:bg-zinc-900 rounded-none mr-1.5 font-sans">↑↓</kbd>
                    Navigate
                  </span>
                  <span>
                    <kbd className="border border-border-warm px-1.5 py-0.5 text-[8px] bg-white dark:bg-zinc-900 rounded-none mr-1.5 font-sans">Enter</kbd>
                    Select
                  </span>
                </div>
                <span>⌘ K Search Mode</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WISHLIST DRAWER */}
      <AnimatePresence>
        {isWishlistOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setWishlistOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35 }}
              className="relative w-full max-w-md h-full bg-bg-warm dark:bg-zinc-900 shadow-2xl flex flex-col z-10"
            >
              <div className="flex items-center justify-between p-6 border-b border-border-warm bg-white dark:bg-zinc-950">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-brand-burgundy fill-brand-burgundy" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">My Wishlist ({wishlist.length})</h3>
                </div>
                <button onClick={() => setWishlistOpen(false)} className="p-2 hover:text-brand-burgundy transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {wishlist.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <Heart className="w-12 h-12 text-text-muted stroke-[1]" />
                    <p className="text-sm text-text-muted">Your wishlist is currently empty.</p>
                    <Link
                      href="/shop"
                      onClick={() => setWishlistOpen(false)}
                      className="px-6 py-2.5 bg-brand-burgundy text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-burgundy-light transition-colors rounded-none"
                    >
                      Browse Catalog
                    </Link>
                  </div>
                ) : (
                  wishlist.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-white dark:bg-zinc-950 border border-border-warm rounded-none relative group">
                      <div className="w-20 h-24 bg-bg-card rounded overflow-hidden relative flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide pr-6 line-clamp-1">{item.name}</h4>
                          <p className="text-xs font-semibold text-brand-burgundy mt-1">₹{item.price}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleQuickAddToCart(item)}
                            className="px-3.5 py-1.5 bg-text-primary text-white dark:bg-zinc-800 dark:text-zinc-50 text-[10px] font-bold uppercase tracking-wider hover:bg-brand-burgundy rounded transition-colors flex items-center gap-1"
                          >
                            Quick Add (M)
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="p-1.5 text-text-muted hover:text-red-600 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35 }}
              className="relative w-full max-w-md h-full bg-bg-warm dark:bg-zinc-900 shadow-2xl flex flex-col z-10"
            >
              <div className="flex items-center justify-between p-6 border-b border-border-warm bg-white dark:bg-zinc-950">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-burgundy" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">Shopping Cart ({cartTotalItems})</h3>
                </div>
                <button onClick={() => setCartOpen(false)} className="p-2 hover:text-brand-burgundy transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <ShoppingBag className="w-12 h-12 text-text-muted stroke-[1]" />
                    <p className="text-sm text-text-muted">Your cart is empty.</p>
                    <Link
                      href="/shop"
                      onClick={() => setCartOpen(false)}
                      className="px-6 py-2.5 bg-brand-burgundy text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-burgundy-light transition-colors rounded-none"
                    >
                      Shop Now
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex gap-4 p-4 bg-white dark:bg-zinc-950 border border-border-warm rounded-none">
                      <div className="w-20 h-24 bg-bg-card rounded-none overflow-hidden relative flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide line-clamp-1 pr-2">{item.name}</h4>
                            <button
                              onClick={() => removeFromCart(item.id, item.size)}
                              className="text-text-muted hover:text-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">
                            Size: {item.size} • Color: {item.color}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center border border-border-warm rounded bg-bg-card dark:bg-zinc-800">
                            <button
                              onClick={() => updateCartQty(item.id, item.size, -1)}
                              className="p-1 hover:bg-border-warm dark:hover:bg-zinc-700 transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-text-primary">{item.qty}</span>
                            <button
                              onClick={() => updateCartQty(item.id, item.size, 1)}
                              className="p-1 hover:bg-border-warm dark:hover:bg-zinc-700 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs font-bold text-brand-burgundy">₹{item.price * item.qty}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-border-warm bg-white dark:bg-zinc-950 space-y-4">
                  <div className="flex justify-between text-xs uppercase tracking-wider text-text-primary font-bold">
                    <span>Subtotal</span>
                    <span className="text-brand-burgundy text-sm">₹{cartSubtotal}</span>
                  </div>
                  <p className="text-[10px] text-text-muted">
                    Tax and shipping calculated at checkout. Free shipping on orders over ₹1,500.
                  </p>
                  {/* BUG 14: Cart checkout CTA polished to match PDP add-to-bag style */}
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      router.push("/checkout");
                    }}
                    className="w-full py-3.5 bg-brand-burgundy text-white hover:bg-brand-burgundy-light active:scale-[0.99] font-bold text-xs uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-burgundy/10"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE NAV SLIDEOUT MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="relative w-full max-w-[280px] h-full bg-white dark:bg-zinc-900 shadow-2xl flex flex-col z-10"
            >
              <div className="flex items-center justify-between p-6 border-b border-border-warm bg-white dark:bg-zinc-950">
                <Image src="/logo.png" alt="Ruven Logo" width={80} height={35} className="h-[35px] w-auto object-contain dark:invert" />
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:text-brand-burgundy transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-6 space-y-6">
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/shop"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-bold uppercase tracking-wider text-text-primary hover:text-brand-burgundy transition-colors"
                    >
                      Shop
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?category=oversized-tees"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block pl-4 text-xs font-semibold text-text-muted hover:text-brand-burgundy transition-colors"
                    >
                      — Oversized Tees
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?category=hoodies"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block pl-4 text-xs font-semibold text-text-muted hover:text-brand-burgundy transition-colors"
                    >
                      — French Terry Hoodies
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?filter=new-arrivals"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-bold uppercase tracking-wider text-text-primary hover:text-brand-burgundy transition-colors"
                    >
                      New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#story-section"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-bold uppercase tracking-wider text-text-primary hover:text-brand-burgundy transition-colors"
                    >
                      Our Story
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#community-section"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-bold uppercase tracking-wider text-text-primary hover:text-brand-burgundy transition-colors"
                    >
                      Community
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/journal/the-armor-of-light"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-bold uppercase tracking-wider text-text-primary hover:text-brand-burgundy transition-colors"
                    >
                      Journal
                    </Link>
                  </li>
                </ul>

                <div className="border-t border-border-warm pt-6 space-y-4">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setWishlistOpen(true);
                    }}
                    className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-text-primary"
                  >
                    <span>Wishlist ({wishlist.length})</span>
                    <Heart className="w-4 h-4 text-brand-burgundy" />
                  </button>

                  {/* Mobile account dropdown/list options */}
                  {isAuthenticated ? (
                    <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Welcome back, {userName.split(" ")[0]}</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#670000] dark:text-red-400">{memberLevel}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "My Orders", path: "/account/orders" },
                          { label: "Wishlist", path: "/account/wishlist" },
                          { label: "Recently Viewed", path: "/account/recent" },
                          { label: "Saved Addresses", path: "/account/addresses" },
                          { label: "Journal Library", path: "/account/journal" },
                          { label: "Rewards Lounge", path: "/account/rewards" },
                          { label: "Profile", path: "/account/profile" },
                          { label: "Settings", path: "/account/settings" },
                          { label: "Support", path: "/support" }
                        ].map((link) => (
                          <Link
                            key={link.path}
                            href={link.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-955 dark:hover:text-zinc-200 py-1"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left text-[10px] font-bold uppercase tracking-wider text-[#670000] dark:text-red-400 hover:underline pt-2 border-t border-zinc-100 dark:border-zinc-800"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link
                      href={`/login?redirect=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname + window.location.search : "")}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-text-primary"
                      aria-label="My Account"
                    >
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4 text-brand-burgundy" />
                        <span>Sign In</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
