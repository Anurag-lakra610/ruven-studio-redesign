"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts, MockProduct } from "@/lib/db";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shirt,
  Sparkles,
  ShieldCheck,
  Truck,
  Compass,
  Activity,
  MessageSquare,
  Feather,
  Calendar,
  Heart,
  ShoppingBag,
  ArrowRight,
  Star
} from "lucide-react";

export default function StorefrontHomePage() {
  const { cart, wishlist, toggleWishlist, addToCart, setCartOpen } = useCart();
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedTeeSize, setSelectedTeeSize] = useState("M");
  const [selectedHoodieSize, setSelectedHoodieSize] = useState("L");

  const heroSlides = [
    { image: "/hero2.png", alt: "Ruven Studio young creative streetwear lookbook" },
    { image: "/hero3.png", alt: "Ruven Studio street lifestyle editorial lookbook" },
    { image: "/hero4.png", alt: "Ruven Studio urban faith streetwear lookbook" }
  ];

  // Fetch products from database helper
  useEffect(() => {
    getProducts().then((res) => setProducts(res));
  }, []);

  // Slide rotation timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const teeProduct = products.find((p) => p.slug === "armor-of-light-heavyweight-tee");
  const hoodieProduct = products.find((p) => p.slug === "renewal-of-mind-french-terry-hoodie");

  const handleQuickAdd = (product: MockProduct, size: string) => {
    addToCart(
      {
        id: product.id,
        variantId: product.variants?.find((v) => v.size === size)?.id || `${product.id}-default`,
        name: product.name,
        slug: product.slug,
        price: product.base_price,
        size: size,
        color: product.slug === "armor-of-light-heavyweight-tee" ? "Ink Black" : "Warm Charcoal",
        image: product.image
      },
      1
    );
    setCartOpen(true);
  };

  const isItemInWishlist = (productId: string) => wishlist.some((item) => item.id === productId);

  const handleWishlistToggle = (product: MockProduct) => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.base_price,
      image: product.image
    });
  };

  return (
    <div className="w-full flex flex-col bg-bg-warm dark:bg-zinc-950 overflow-x-hidden">
      {/* 1. HERO SLIDER */}
      <section className="hero">
        <div className="hero-bg" id="hero-bg-parallax">
          {heroSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`hero-slide ${activeSlide === idx ? "active" : ""}`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="hero-img"
              />
            </div>
          ))}
        </div>
        <div className="hero-overlay"></div>
        
        {/* Slideshow Indicators */}
        <div className="hero-indicators">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              className={`indicator-dot ${activeSlide === idx ? "active" : ""}`}
              onClick={() => setActiveSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
        <div className="hero-grain"></div>
        
        {/* Animated Background Blurred Shapes */}
        <div className="blur-shape shape-1"></div>
        <div className="blur-shape shape-2"></div>
        
        <div className="hero-content">
          <h1 className="hero-headline">Put on the<br/>Armor of Light.</h1>
          <p className="hero-supporting-text">Inspired by Romans 13:12. Heavy-weight, minimalist streetwear designed to start quiet, meaningful conversations about faith, identity, and grace.</p>
          <div className="hero-cta-group" style={{ display: "flex", gap: "1.2rem", flexWrap: "wrap", marginTop: "2rem" }}>
            <Link href="/shop" className="cta-button cta-button-primary">
              <span className="btn-content">
                <span className="btn-text">Shop Collection</span>
                <span className="btn-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </span>
            </Link>
            <a href="#story-section" className="cta-button cta-button-secondary">
              <span className="btn-content">
                <span className="btn-text">Our Story</span>
                <span className="btn-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP */}
      <div className="w-full bg-white dark:bg-zinc-900 border-b border-border-warm py-6 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 flex justify-around items-center gap-8 flex-wrap">
          <div className="flex items-center gap-3 text-xs font-bold tracking-wider uppercase text-text-primary">
            <Shirt className="w-4 h-4 text-brand-gold" />
            <span>Premium Fabric</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold tracking-wider uppercase text-text-primary">
            <Sparkles className="w-4 h-4 text-brand-gold" />
            <span>Faith Inspired</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold tracking-wider uppercase text-text-primary">
            <ShieldCheck className="w-4 h-4 text-brand-gold" />
            <span>Secure Checkout</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold tracking-wider uppercase text-text-primary">
            <Truck className="w-4 h-4 text-brand-gold" />
            <span>Fast Shipping</span>
          </div>
        </div>
      </div>

      {/* 3. EDITORIAL STORYTELLING */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-[1400px] mx-auto" id="story-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-[10px] font-bold tracking-[0.15em] text-brand-gold uppercase">Our Purpose</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary leading-tight">
              Formed in Faith.<br />
              Tailored for Purpose.
            </h2>
            <p className="text-sm text-text-muted leading-relaxed">
              Ruven Studio is an independent fashion label creating limited organic streetwear garments designed to spark organic conversations. We construct each piece carefully to serve as a visual bridge, allowing you to carry your faith with confidence, elegance, and modern Scandinavian minimalism.
            </p>
            <div className="border-l-2 border-brand-burgundy pl-6 py-2 my-8">
              <p className="italic text-base text-brand-burgundy font-medium">
                "We don't create clothing to conform; we design to transform."
              </p>
              <p className="text-[10px] uppercase font-bold tracking-wider text-text-muted mt-2">— The Ruven Collective</p>
            </div>
            <div className="bg-bg-card dark:bg-zinc-900/50 rounded-lg p-5 border border-border-warm flex flex-col gap-2">
              <p className="text-xs text-text-primary italic leading-relaxed">
                "Do not be conformed to this world, but be transformed by the renewal of your mind, that by testing you may discern what is the will of God, what is good and acceptable and perfect."
              </p>
              <p className="text-[9px] uppercase font-bold tracking-widest text-brand-gold text-right">— Romans 12:2</p>
            </div>
          </div>
          <div className="relative aspect-square w-full max-w-lg mx-auto rounded-lg overflow-hidden shadow-xl border border-border-warm">
            <Image
              src="/brand_story_lifestyle.png"
              alt="Ruven Studio Craftsmanship and Story"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 4. FEATURED CAMPAIGN DROPS */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-white dark:bg-zinc-900 border-t border-b border-border-warm">
        <div className="max-w-[1400px] mx-auto space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-3">
              <span className="text-[10px] font-bold tracking-[0.15em] text-brand-gold uppercase">Editorial Drop 01</span>
              <h2 className="text-3xl font-bold tracking-tight text-text-primary">The Armor & Protection Drop</h2>
            </div>
            <p className="text-xs text-text-muted max-w-sm leading-relaxed">
              A limited-run campaign constructed to represent resilience, spiritual armor, and mental integrity. Styled in a clean Scandinavian aesthetic.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Hero Card - Armor of Light Tee */}
            {teeProduct && (
              <div className="lg:col-span-7 bg-bg-warm dark:bg-zinc-950 rounded-xl border border-border-warm overflow-hidden shadow-md flex flex-col justify-between">
                <div className="relative aspect-[4/3] w-full overflow-hidden group">
                  <Image
                    src={teeProduct.image}
                    alt={teeProduct.name}
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-700"
                  />
                  <span className="absolute top-4 left-4 bg-brand-burgundy text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded">
                    New Release
                  </span>
                  <button
                    onClick={() => handleWishlistToggle(teeProduct)}
                    className="absolute top-4 right-4 bg-white dark:bg-zinc-900 hover:text-brand-burgundy transition-colors p-2.5 rounded-full shadow-md z-10"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isItemInWishlist(teeProduct.id)
                          ? "text-brand-burgundy fill-brand-burgundy"
                          : "text-text-primary"
                      }`}
                    />
                  </button>
                </div>
                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold tracking-wider bg-brand-gold/15 text-brand-burgundy px-2.5 py-1 rounded">
                      Romans 13:12
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      Oversized Tee
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-wide text-text-primary">{teeProduct.name}</h3>
                    <p className="text-xs text-text-muted mt-2 leading-relaxed">
                      Heavyweight 240 GSM organic cotton drop. Features screen-printed shield details and boxy oversized streetwear aesthetics.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border-warm">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-brand-burgundy">₹{teeProduct.base_price}</span>
                      {teeProduct.original_price && (
                        <span className="text-xs text-text-muted line-through">₹{teeProduct.original_price}</span>
                      )}
                    </div>
                    {/* Size selector & Add */}
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1.5">
                        {["S", "M", "L", "XL"].map((sz) => (
                          <button
                            key={sz}
                            onClick={() => setSelectedTeeSize(sz)}
                            className={`w-8 h-8 rounded border text-xs font-bold flex items-center justify-center transition-colors ${
                              selectedTeeSize === sz
                                ? "bg-text-primary text-white border-text-primary"
                                : "border-border-warm hover:border-text-primary text-text-primary"
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => handleQuickAdd(teeProduct, selectedTeeSize)}
                        className="px-5 py-2 bg-brand-burgundy hover:bg-brand-gold text-white text-[10px] font-bold uppercase tracking-widest rounded transition-colors flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Right side - Supporting Hoodie & Quote */}
            {hoodieProduct && (
              <div className="lg:col-span-5 flex flex-col justify-between gap-12">
                <div className="bg-bg-warm dark:bg-zinc-950 rounded-xl border border-border-warm overflow-hidden shadow-md p-6 flex flex-col justify-between flex-1">
                  <div className="relative aspect-[4/3] w-full rounded overflow-hidden group">
                    <Image
                      src={hoodieProduct.image}
                      alt={hoodieProduct.name}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform duration-700"
                    />
                    <span className="absolute top-4 left-4 bg-brand-gold text-text-primary text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded">
                      Best Seller
                    </span>
                    <button
                      onClick={() => handleWishlistToggle(hoodieProduct)}
                      className="absolute top-4 right-4 bg-white dark:bg-zinc-900 hover:text-brand-burgundy transition-colors p-2.5 rounded-full shadow-md z-10"
                      aria-label="Wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isItemInWishlist(hoodieProduct.id)
                            ? "text-brand-burgundy fill-brand-burgundy"
                            : "text-text-primary"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="space-y-4 mt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-bold tracking-wider text-brand-gold uppercase">Romans 12:2</span>
                        <h4 className="text-base font-bold uppercase tracking-wide text-text-primary mt-1">
                          {hoodieProduct.name}
                        </h4>
                      </div>
                      <span className="text-base font-bold text-brand-burgundy">₹{hoodieProduct.base_price}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 pt-4 border-t border-border-warm">
                      <div className="flex gap-1.5">
                        {["M", "L", "XL"].map((sz) => (
                          <button
                            key={sz}
                            onClick={() => setSelectedHoodieSize(sz)}
                            className={`w-8 h-8 rounded border text-xs font-bold flex items-center justify-center transition-colors ${
                              selectedHoodieSize === sz
                                ? "bg-text-primary text-white border-text-primary"
                                : "border-border-warm hover:border-text-primary text-text-primary"
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => handleQuickAdd(hoodieProduct, selectedHoodieSize)}
                        className="px-5 py-2 bg-brand-burgundy hover:bg-brand-gold text-white text-[10px] font-bold uppercase tracking-widest rounded transition-colors flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-burgundy text-white rounded-xl p-8 space-y-4 shadow-lg shadow-brand-burgundy/15 relative overflow-hidden flex flex-col justify-center">
                  <div className="absolute -right-8 -bottom-8 text-white/5 font-bold text-9xl pointer-events-none select-none">
                    †
                  </div>
                  <h3 className="text-lg font-bold uppercase tracking-wide text-brand-gold">Every Thread Tells a Story</h3>
                  <p className="text-xs text-zinc-200 leading-relaxed">
                    Our graphics are not simple illustrations. They are screen-printed messages constructed carefully, serving as physical checkpoints of mental renewal, clarity, and armor in Christ.
                  </p>
                  <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-brand-gold hover:text-white transition-colors pt-2 block">
                    Browse All Apparel →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. IMMERSIVE LIFESTYLE LOOKBOOK BANNER */}
      <section className="relative h-[480px] w-full flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero_lifestyle.png"
            alt="Ruven Studio Lifestyle Movement"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60 z-10" />
        </div>
        <div className="relative z-20 max-w-xl text-white space-y-6">
          <span className="text-[10px] font-bold tracking-[0.2em] text-brand-gold uppercase">Lifestyle Campaign</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            Faith Is Meant To Be Lived.<br />
            Not Hidden.
          </h2>
          <p className="text-xs md:text-sm text-zinc-300 leading-relaxed max-w-md mx-auto">
            Constructed in India to represent and share the message of light. Our premium minimal streetwear helps you start the conversations that matter.
          </p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3 border border-white hover:bg-white hover:text-text-primary text-white text-xs font-bold uppercase tracking-widest rounded-full transition-colors"
          >
            Explore the Lookbook
          </Link>
        </div>
      </section>

      {/* 6. SCRIPTURE HIGHLIGHT */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-4xl mx-auto text-center space-y-8">
        <div className="w-16 h-16 mx-auto text-brand-burgundy/30 border border-brand-burgundy/15 rounded-full flex items-center justify-center relative">
          <span className="text-2xl font-bold">†</span>
        </div>
        <span className="text-[10px] font-bold tracking-[0.2em] text-brand-gold uppercase block">Scripture Focus</span>
        <blockquote className="text-xl md:text-2xl font-bold italic text-brand-burgundy max-w-2xl mx-auto leading-relaxed">
          "The night is far gone; the day is at hand. So then let us cast off the works of darkness and put on the armor of light."
        </blockquote>
        <p className="text-xs font-bold uppercase tracking-widest text-text-muted">— Romans 13:12</p>

        <div className="bg-white dark:bg-zinc-900 border border-border-warm rounded-xl p-6 md:p-8 text-left space-y-4 max-w-xl mx-auto">
          <h4 className="text-xs font-bold uppercase tracking-wide text-text-primary">Why This Verse Inspires Us</h4>
          <p className="text-xs text-text-muted leading-relaxed">
            In a generation driven by noise, visual pressure, and anxiety, this scripture acts as a sanctuary. It reminds us that our true identity is found in light, renewal, and active spiritual defence, rather than conforming to temporary worldly designs.
          </p>
          <Link
            href="/shop?category=oversized-tees"
            className="text-xs font-bold text-brand-burgundy hover:text-brand-gold transition-colors inline-block"
          >
            Explore Armor Collection →
          </Link>
        </div>
      </section>

      {/* 7. WHY CHOOSE RUVEN (ANATOMY) */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-white dark:bg-zinc-900 border-t border-b border-border-warm">
        <div className="max-w-[1400px] mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold tracking-[0.15em] text-brand-gold uppercase block">Crafted for Conversation</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">The Anatomy of Ruven Studio</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-bg-warm dark:bg-zinc-950 border border-border-warm rounded-xl space-y-4">
              <div className="w-10 h-10 rounded-full bg-brand-burgundy/10 text-brand-burgundy flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-text-primary">Conversation Starters</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Every design elements screen-printed carries intentional biblical references, giving you opportunities to share your walk.
              </p>
            </div>

            <div className="p-8 bg-bg-warm dark:bg-zinc-950 border border-border-warm rounded-xl space-y-4">
              <div className="w-10 h-10 rounded-full bg-brand-burgundy/10 text-brand-burgundy flex items-center justify-center">
                <Shirt className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-text-primary">Premium Heavyweight Cotton</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Tailored in dense 240 GSM organic tees and 380 GSM loopback French Terry hoodies. Cozy, thick, and durable.
              </p>
            </div>

            <div className="p-8 bg-bg-warm dark:bg-zinc-950 border border-border-warm rounded-xl space-y-4">
              <div className="w-10 h-10 rounded-full bg-brand-burgundy/10 text-brand-burgundy flex items-center justify-center">
                <Feather className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-text-primary">Minimalist Faith Graphics</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Original scriptural artwork drawn and screens-printed carefully with maximum focus on design integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-[1400px] mx-auto space-y-16">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-bold tracking-[0.15em] text-brand-gold uppercase block">United in Fellowship</span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">Shared Reflections</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-zinc-900 border border-border-warm rounded-xl p-6 md:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex text-brand-gold">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />)}
              </div>
              <p className="text-xs text-text-muted italic leading-relaxed">
                "The Armor of Light tee has opened so many doors. Friends at college ask what the shield represents, allowing me to share my faith journey naturally."
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-burgundy text-white flex items-center justify-center font-bold text-xs">D</div>
              <div>
                <h5 className="text-xs font-bold text-text-primary">David S.</h5>
                <span className="text-[10px] text-text-muted">Bengaluru • College Ministry</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-border-warm rounded-xl p-6 md:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex text-brand-gold">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />)}
              </div>
              <p className="text-xs text-text-muted italic leading-relaxed">
                "The comfort of the French Terry hoodie is outstanding, but the reminder of mental renewal on the chest serves as a quiet anchor of peace during long days."
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-gold text-text-primary flex items-center justify-center font-bold text-xs">P</div>
              <div>
                <h5 className="text-xs font-bold text-text-primary">Priya M.</h5>
                <span className="text-[10px] text-text-muted">Mumbai • Creative Director</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-border-warm rounded-xl p-6 md:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex text-brand-gold">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />)}
              </div>
              <p className="text-xs text-text-muted italic leading-relaxed">
                "Perfect boxy fit. I wear my Ruven Studio tees to fellowships and study circles. It always sparks conversations about walk of faith."
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-border-warm text-text-primary flex items-center justify-center font-bold text-xs">R</div>
              <div>
                <h5 className="text-xs font-bold text-text-primary">Rahul K.</h5>
                <span className="text-[10px] text-text-muted">New Delhi • Student Leader</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. INSTAGRAM GALLERY WALL */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-white dark:bg-zinc-900 border-t border-border-warm">
        <div className="max-w-[1400px] mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-[0.15em] text-brand-gold uppercase block">Fellowship Studio</span>
              <h2 className="text-2xl font-bold tracking-tight text-text-primary mt-2">Shared on Instagram</h2>
            </div>
            <a
              href="https://instagram.com/ruven.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-brand-burgundy hover:text-brand-gold transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>@ruven.studio</span>
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["/brand_story_lifestyle.png", "/hero_lifestyle.png", "/oversized_tee_product.png", "/faith_hoodie_product.png"].map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-border-warm">
                <Image src={img} alt={`Lookbook snapshot ${idx + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
