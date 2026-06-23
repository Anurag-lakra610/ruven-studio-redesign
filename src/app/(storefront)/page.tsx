"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts, MockProduct, getHomepageSections, getActiveCampaign, HomepageSection, CampaignSettings } from "@/lib/db";
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

const iconMap: Record<string, React.ComponentType<any>> = {
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
};

export default function StorefrontHomePage() {
  const { cart, wishlist, toggleWishlist, addToCart, setCartOpen } = useCart();
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [campaign, setCampaign] = useState<CampaignSettings | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    { image: "/hero2.png", alt: "Ruven Studio young creative streetwear lookbook" },
    { image: "/hero3.png", alt: "Ruven Studio street lifestyle editorial lookbook" },
    { image: "/hero4.png", alt: "Ruven Studio urban faith streetwear lookbook" }
  ];

  // Fetch products, sections and campaigns
  useEffect(() => {
    getProducts().then((res) => setProducts(res));
    getHomepageSections().then((res) => setSections(res));
    getActiveCampaign().then((res) => setCampaign(res));
  }, []);

  // Slide rotation timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const getSection = (key: string) => sections.find((s) => s.section_key === key);

  // Trust Strip variables
  const trustStrip = getSection("trust-strip");
  const showTrustStrip = trustStrip ? trustStrip.is_active : true;
  const trustItems = trustStrip?.settings?.items || [
    { icon: "Shirt", text: "Premium Fabric" },
    { icon: "Sparkles", text: "Faith Inspired" },
    { icon: "ShieldCheck", text: "Secure Checkout" },
    { icon: "Truck", text: "Fast Shipping" },
    { icon: "Compass", text: "Designed with Purpose" },
    { icon: "Activity", text: "Made for Everyday Wear" }
  ];

  // Editorial Mission variables
  const mission = getSection("editorial-mission");
  const showMission = mission ? mission.is_active : true;
  const missionSettings = mission?.settings || {
    subtitle: "our purpose",
    title: "Formed in Faith. Tailored for Purpose.",
    paragraph: "Ruven Studio is an independent Christian lifestyle label creating heavy-weight apparel designed to start quiet, meaningful conversations. We construct each garment to serve as a visual bridge, allowing you to carry your faith with elegance and confidence in modern creative environments.",
    quote_text: "We don't create clothing to conform; we design to transform.",
    quote_author: "The Ruven Collective",
    verse_quote: "Do not be conformed to this world, but be transformed by the renewal of your mind...",
    verse_ref: "Romans 12:2",
    image_url: "/brand_story_lifestyle.png"
  };

  // Featured Campaign variables
  const featuredCampaignSection = getSection("featured-campaign");
  const showFeaturedCampaign = featuredCampaignSection ? featuredCampaignSection.is_active : true;
  const campaignSettings = {
    subtitle: campaign?.subtitle || featuredCampaignSection?.settings?.subtitle || "editorial drop 01",
    title: campaign?.campaign_name || featuredCampaignSection?.settings?.title || "The Armor & Protection Campaign",
    description: campaign?.description || featuredCampaignSection?.settings?.description || "A meticulous collection representing strength and spiritual integrity in a chaotic world. Styled with Scandinavian minimalism and heavyweight textures.",
    statement_title: featuredCampaignSection?.settings?.statement_title || "Every Thread Tells a Story",
    statement_description: featuredCampaignSection?.settings?.statement_description || "Our graphics are not simple illustrations. They are screen-printed conversations waiting to happen, serving as reminders of mental renewal, clarity, and protection in God.",
    statement_cta_text: featuredCampaignSection?.settings?.statement_cta_text || "Browse All Apparel",
    statement_cta_link: featuredCampaignSection?.settings?.statement_cta_link || "/shop"
  };

  const teeProductId = campaign?.tee_product_id || "f1111111-1111-1111-1111-111111111111";
  const hoodieProductId = campaign?.hoodie_product_id || "f1111111-1111-1111-1111-111111111112";
  const teeProduct = products.find((p) => p.id === teeProductId || p.slug === "armor-of-light-heavyweight-tee");
  const hoodieProduct = products.find((p) => p.id === hoodieProductId || p.slug === "renewal-of-mind-french-terry-hoodie");

  // Immersive Lifestyle variables
  const lifestyle = getSection("lifestyle-immersive");
  const showLifestyle = lifestyle ? lifestyle.is_active : true;
  const lifestyleSettings = lifestyle?.settings || {
    subtitle: "lifestyle campaign",
    title: "Faith Is Meant To Be Lived. Not Hidden.",
    description: "Designed in India to carry the message of light. Our premium minimal streetwear helps you start the conversations that matter.",
    cta_text: "Explore the Lookbook",
    cta_link: "/shop",
    image_url: "/hero_lifestyle.png"
  };

  // Scripture Highlight variables
  const scripture = getSection("scripture-highlight");
  const showScripture = scripture ? scripture.is_active : true;
  const scriptureSettings = scripture?.settings || {
    label: "scripture focus",
    verse: "Do not be conformed to this world, but be transformed by the renewal of your mind, that by testing you may discern what is the will of God, what is good and acceptable and perfect.",
    reference: "Romans 12:2",
    explanation_title: "Why This Verse Matters",
    explanation_text: "In a generation driven by noise, social pressure, and anxiety, this verse is a sanctuary. It reminds us that our true identity is found in renewal and divine transformation, rather than mimicking temporary worldly patterns. This scriptural theme forms the creative core of our Heavyweight Hoodie collection.",
    cta_text: "Explore Mind Renewal Drops",
    cta_link: "/shop?category=hoodies"
  };

  // Best Sellers variables
  const bestSellers = getSection("best-sellers");
  const showBestSellers = bestSellers ? bestSellers.is_active : true;
  const bestSellersSettings = bestSellers?.settings || {
    subtitle: "essential drops",
    title: "Ruven Studio Best Sellers",
    hero_product_fabric: "Fabric: 380 GSM ultra-heavy combed French Terry. Loop-back lining, double-lined drawstring-free hood. Crafted to represent comfortable, mindful living.",
    hero_product_verse: "Do not conform... but be transformed."
  };

  // Why Ruven variables
  const whyRuven = getSection("why-ruven");
  const showWhyRuven = whyRuven ? whyRuven.is_active : true;
  const whyRuvenSettings = whyRuven?.settings || {
    subtitle: "crafted for conversation",
    title: "The Anatomy of Ruven Studio",
    items: [
      { icon: "MessageSquare", title: "Designed to Start Conversations", description: "Every graphic acts as an intentional conversation starter, creating direct opportunities to share faith and hope." },
      { icon: "Shirt", title: "Premium Heavyweight Cotton", description: "Tailored in 240 GSM T-shirts and 380 GSM loopback French Terry hoodies. Durable, dense, and built to last." },
      { icon: "Feather", title: "Faith Inspired Graphics", description: "Original, minimalist scriptural symbols screen-printed carefully with absolute precision." },
      { icon: "Calendar", title: "Limited Edition Collections", description: "Released in small, calculated runs to maintain design integrity and reduce environmental manufacturing waste." },
      { icon: "Heart", title: "Ethically Produced", description: "Independently manufactured in clean, safe facilities in India supporting local creative tailors." },
      { icon: "Activity", title: "Built for Everyday Wear", description: "Featuring pre-shrunk structures, double-stitched details, and timeless cuts for modern comfort." }
    ]
  };

  // Testimonials variables
  const testimonials = getSection("testimonials");
  const showTestimonials = testimonials ? testimonials.is_active : true;
  const testimonialsSettings = testimonials?.settings || {
    subtitle: "united in faith",
    title: "Shared Reflections",
    reviews: [
      {
        rating: 5,
        quote: "The Armor of Light tee has opened so many doors. Friends at college ask what the shield represents, allowing me to share my faith journey naturally.",
        author_initial: "D",
        author_name: "David S.",
        author_sub: "Bengaluru • College Ministry",
        avatar_color: "var(--color-brand-burgundy)",
        avatar_text_color: "var(--color-white)"
      },
      {
        rating: 5,
        quote: "The comfort of the loopback French Terry is outstanding, but the reminder of mental renewal on the chest serves as a quiet anchor of peace during my days.",
        author_initial: "P",
        author_name: "Priya M.",
        author_sub: "Mumbai • Creative Director",
        avatar_color: "var(--color-brand-gold)",
        avatar_text_color: "var(--color-text-primary)"
      },
      {
        rating: 5,
        quote: "Perfect boxy fit. I wear my Ruven Studio tees to fellowships and study circles. It always sparks conversations about walk of faith and identity in Christ.",
        author_initial: "R",
        author_name: "Rahul K.",
        author_sub: "New Delhi • Student Leader",
        avatar_color: "var(--color-border)",
        avatar_text_color: "var(--color-text-primary)"
      }
    ]
  };

  // Instagram variables
  const instagramGallery = getSection("instagram-gallery");
  const showInstagram = instagramGallery ? instagramGallery.is_active : true;
  const instagramSettings = instagramGallery?.settings || {
    subtitle: "fellowship studio",
    title: "Shared on Instagram",
    instagram_handle: "@ruven.studio",
    instagram_link: "https://instagram.com/ruven.studio",
    items: [
      { image_url: "/brand_story_lifestyle.png", link: "https://instagram.com/ruven.studio" },
      { image_url: "/hero_lifestyle.png", link: "https://instagram.com/ruven.studio" },
      { image_url: "/oversized_tee_product.png", link: "https://instagram.com/ruven.studio" },
      { image_url: "/faith_hoodie_product.png", link: "https://instagram.com/ruven.studio" }
    ]
  };

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

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case "trust-strip":
        return showTrustStrip && (
          <div key="trust-strip" className="trust-strip-v2">
            <div className="trust-strip-container">
              {trustItems.map((item: any, idx: number) => {
                const IconComponent = iconMap[item.icon] || Shirt;
                return (
                  <div key={idx} className="trust-item-v2">
                    <IconComponent className="trust-icon-v2" />
                    <span className="trust-text-v2">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "editorial-mission":
        return showMission && (
          <section key="editorial-mission" className="editorial-mission section-padding-lg" id="story-section">
            <div className="editorial-mission-grid">
              <div className="mission-text-col">
                <span className="section-subtitle-lowercase">{missionSettings.subtitle}</span>
                <h2 className="editorial-headline-large" dangerouslySetInnerHTML={{ __html: missionSettings.title.replace(/\n/g, '<br />') }} />
                <p className="mission-paragraph">
                  {missionSettings.paragraph}
                </p>
                <div className="mission-quote-box">
                  <span className="quote-sign">“</span>
                  <p className="mission-quote-text">{missionSettings.quote_text}</p>
                  <p className="mission-quote-author">{missionSettings.quote_author}</p>
                </div>
                <div className="mission-verse-accent">
                  <p className="mission-verse-quote">"{missionSettings.verse_quote}"</p>
                  <p className="mission-verse-ref">{missionSettings.verse_ref}</p>
                </div>
              </div>
              <div className="mission-image-col">
                <div className="mission-image-wrap">
                  <img src={missionSettings.image_url} alt="Ruven Studio Craftsmanship and Story" className="mission-img" />
                </div>
              </div>
            </div>
          </section>
        );

      case "featured-campaign":
        return showFeaturedCampaign && (
          <section key="featured-campaign" className="featured-campaign section-padding-lg">
            <div className="campaign-header">
              <div>
                <span className="section-subtitle-lowercase">{campaignSettings.subtitle}</span>
                <h2 className="editorial-title-v2">{campaignSettings.title}</h2>
              </div>
              <p className="campaign-description">
                {campaignSettings.description}
              </p>
            </div>
            
            <div className="campaign-grid">
              {/* Left Hero Campaign Card */}
              {teeProduct && (
                <article className="campaign-hero-card product-card" data-id={teeProduct.id}>
                  <div className="campaign-hero-img-wrap">
                    <img src={teeProduct.image} alt={teeProduct.name} className="campaign-hero-img" />
                    <span className="campaign-tag-badge">New Release</span>
                    <button 
                      onClick={() => handleWishlistToggle(teeProduct)}
                      className={`wishlist-btn ${isItemInWishlist(teeProduct.id) ? "active" : ""}`} 
                      aria-label="Add to wishlist"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  <div className="campaign-hero-info">
                    <div className="campaign-info-meta">
                      <span className="campaign-verse-tag">{teeProduct.scripture ? `${teeProduct.scripture.book} ${teeProduct.scripture.chapter}:${teeProduct.scripture.verse}` : "Romans 13:12"}</span>
                      <span className="campaign-category-tag">Oversized Tee</span>
                    </div>
                    <h3 className="campaign-hero-title">{teeProduct.name}</h3>
                    <p className="campaign-hero-desc">
                      {teeProduct.description}
                    </p>
                    <div className="campaign-actions">
                      <span className="campaign-price">
                        ₹{teeProduct.base_price} {teeProduct.original_price && <span className="price-original">₹{teeProduct.original_price}</span>}
                      </span>
                      <div className="size-selector-v2">
                        {["S", "M", "L", "XL"].map((size) => (
                          <button 
                            key={size}
                            onClick={() => handleQuickAdd(teeProduct, size)}
                            className="size-btn" 
                            data-size={size}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* Right supporting column */}
              <div className="campaign-side-col">
                {hoodieProduct && (
                  <article className="campaign-supporting-card product-card" data-id={hoodieProduct.id}>
                    <div className="supporting-img-wrap">
                      <img src={hoodieProduct.image} alt={hoodieProduct.name} className="supporting-img" />
                      <span className="campaign-tag-badge">Best Seller</span>
                      <button 
                        onClick={() => handleWishlistToggle(hoodieProduct)}
                        className={`wishlist-btn ${isItemInWishlist(hoodieProduct.id) ? "active" : ""}`} 
                        aria-label="Add to wishlist"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                    <div className="supporting-info">
                      <span className="campaign-verse-tag">{hoodieProduct.scripture ? `${hoodieProduct.scripture.book} ${hoodieProduct.scripture.chapter}:${hoodieProduct.scripture.verse}` : "Romans 12:2"}</span>
                      <h4 className="supporting-title">{hoodieProduct.name}</h4>
                      <div className="flex justify-between items-center mt-2">
                        <p className="supporting-price">₹{hoodieProduct.base_price}</p>
                        <div className="size-selector-v2">
                          {["M", "L", "XL"].map((size) => (
                            <button 
                              key={size}
                              onClick={() => handleQuickAdd(hoodieProduct, size)}
                              className="size-btn" 
                              data-size={size}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                )}
                
                <div className="campaign-editorial-statement">
                  <h3>{campaignSettings.statement_title}</h3>
                  <p>{campaignSettings.statement_description}</p>
                  <Link href={campaignSettings.statement_cta_link} className="editorial-text-link">
                    {campaignSettings.statement_cta_text} →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );

      case "lifestyle-immersive":
        return showLifestyle && (
          <section key="lifestyle-immersive" className="lifestyle-immersive-campaign">
            <div className="immersive-bg-wrap">
              <img src={lifestyleSettings.image_url} alt="Ruven Studio Lifestyle Movement" className="immersive-bg-img" />
            </div>
            <div className="immersive-overlay-v2"></div>
            <div className="immersive-content">
              <span className="immersive-subtitle">{lifestyleSettings.subtitle}</span>
              <h2 className="immersive-statement" dangerouslySetInnerHTML={{ __html: lifestyleSettings.title.replace(/\n/g, '<br />') }} />
              <p className="immersive-subtext">{lifestyleSettings.description}</p>
              <Link href={lifestyleSettings.cta_link} className="immersive-cta-link">{lifestyleSettings.cta_text}</Link>
            </div>
          </section>
        );

      case "scripture-highlight":
        return showScripture && (
          <section key="scripture-highlight" className="scripture-highlight section-padding-lg">
            <div className="scripture-container">
              <div className="scripture-vector">
                <svg viewBox="0 0 100 100" className="scripture-svg-graphic" aria-hidden="true">
                  <path d="M50,10 L50,90 M20,35 L80,35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3"></path>
                  <circle cx="50" cy="35" r="22" stroke="currentColor" strokeWidth="1" stroke-dasharray="2 3" fill="none" opacity="0.25"></circle>
                </svg>
              </div>
              <span className="verse-label-accent">{scriptureSettings.label}</span>
              <blockquote className="modern-bible-verse">
                "{scriptureSettings.verse}"
              </blockquote>
              <p className="modern-bible-reference">{scriptureSettings.reference}</p>
              
              <div className="verse-connection-box">
                <h4>{scriptureSettings.explanation_title}</h4>
                <p>{scriptureSettings.explanation_text}</p>
                <Link href={scriptureSettings.cta_link} className="verse-connect-link">{scriptureSettings.cta_text}</Link>
              </div>
            </div>
          </section>
        );

      case "best-sellers":
        return showBestSellers && (
          <section key="best-sellers" className="best-sellers-editorial section-padding-lg">
            <div className="best-sellers-header">
              <span className="section-subtitle-lowercase">{bestSellersSettings.subtitle}</span>
              <h2 className="editorial-title-v2">{bestSellersSettings.title}</h2>
            </div>

            <div className="best-sellers-layout">
              {/* Hero Best Seller */}
              {hoodieProduct && (
                <article className="product-card best-seller-hero-card" data-id={hoodieProduct.id}>
                  <div className="best-seller-hero-grid">
                    <div className="best-seller-hero-img-side">
                      <img src={hoodieProduct.image} alt={hoodieProduct.name} className="best-seller-hero-img" />
                      <button 
                        onClick={() => handleWishlistToggle(hoodieProduct)}
                        className={`wishlist-btn ${isItemInWishlist(hoodieProduct.id) ? "active" : ""}`} 
                        aria-label="Add to wishlist"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                      <span className="badge-tag">Best Seller</span>
                    </div>
                    <div className="best-seller-hero-info-side">
                      <span className="best-seller-verse-ref">{hoodieProduct.scripture ? `${hoodieProduct.scripture.book} ${hoodieProduct.scripture.chapter}:${hoodieProduct.scripture.verse}` : "Romans 12:2"}</span>
                      <h3 className="best-seller-title">{hoodieProduct.name}</h3>
                      <p className="best-seller-price">
                        ₹{hoodieProduct.base_price} {hoodieProduct.original_price && <span className="price-original">₹{hoodieProduct.original_price}</span>}
                      </p>
                      
                      <p className="best-seller-fabric-summary">
                        {bestSellersSettings.hero_product_fabric}
                      </p>
                      
                      <div className="best-seller-verse-preview">
                        <p className="verse-quote-short">"{bestSellersSettings.hero_product_verse}"</p>
                      </div>
                      
                      <div className="best-seller-quick-add">
                        <span className="quick-add-label">Quick Add Size</span>
                        <div className="size-selector-v2">
                          {["M", "L", "XL"].map((size) => (
                            <button 
                              key={size}
                              onClick={() => handleQuickAdd(hoodieProduct, size)}
                              className="size-btn" 
                              data-size={size}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* Supporting Best Seller */}
              {teeProduct && (
                <article className="product-card best-seller-side-card" data-id={teeProduct.id}>
                  <button 
                    onClick={() => handleWishlistToggle(teeProduct)}
                    className={`wishlist-btn ${isItemInWishlist(teeProduct.id) ? "active" : ""}`} 
                    aria-label="Add to wishlist"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                  <div className="best-seller-side-img-wrap">
                    <img src={teeProduct.image} alt={teeProduct.name} className="best-seller-side-img" />
                    <span className="badge-tag">New Drop</span>
                  </div>
                  <div className="best-seller-side-info">
                    <span className="best-seller-verse-ref">{teeProduct.scripture ? `${teeProduct.scripture.book} ${teeProduct.scripture.chapter}:${teeProduct.scripture.verse}` : "Romans 13:12"}</span>
                    <h3 className="best-seller-title">{teeProduct.name}</h3>
                    <p className="best-seller-price">₹{teeProduct.base_price}</p>
                    
                    <div className="best-seller-quick-add-mini">
                      <div className="size-selector-v2">
                        {["S", "M", "L", "XL"].map((size) => (
                          <button 
                            key={size}
                            onClick={() => handleQuickAdd(teeProduct, size)}
                            className="size-btn" 
                            data-size={size}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              )}
            </div>
          </section>
        );

      case "why-ruven":
        return showWhyRuven && (
          <section key="why-ruven" className="why-ruven section-padding-lg">
            <div className="why-ruven-header">
              <span className="section-subtitle-lowercase">{whyRuvenSettings.subtitle}</span>
              <h2 className="editorial-title-v2">{whyRuvenSettings.title}</h2>
            </div>
            <div className="why-ruven-grid">
              {whyRuvenSettings.items.map((item: any, idx: number) => {
                const IconComponent = iconMap[item.icon] || MessageSquare;
                return (
                  <div key={idx} className="feature-card">
                    <div className="feature-icon-wrap">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                );
              })}
            </div>
          </section>
        );

      case "testimonials":
        return showTestimonials && (
          <section key="testimonials" className="community-testimonials section-padding-lg">
            <div className="testimonials-header">
              <span className="section-subtitle-lowercase">{testimonialsSettings.subtitle}</span>
              <h2 className="editorial-title-v2">{testimonialsSettings.title}</h2>
            </div>
            <div className="testimonials-grid">
              {testimonialsSettings.reviews.map((rev: any, idx: number) => (
                <div key={idx} className="testimonial-card">
                  <div className="testimonial-rating" role="img" aria-label={`${rev.rating} out of 5 stars`}>
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-brand-gold text-brand-gold inline-block mr-0.5" />
                    ))}
                  </div>
                  <p className="testimonial-quote">"{rev.quote}"</p>
                  <div className="testimonial-author">
                    <div 
                      className="author-avatar-initials" 
                      style={{ backgroundColor: rev.avatar_color || "var(--color-brand-burgundy)", color: rev.avatar_text_color || "var(--color-white)" }}
                    >
                      {rev.author_initial}
                    </div>
                    <div className="author-details">
                      <span className="author-name">{rev.author_name}</span>
                      <span className="author-loc">{rev.author_sub}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case "instagram-gallery":
        return showInstagram && (
          <section key="instagram-gallery" className="instagram-gallery section-padding-lg">
            <div className="instagram-header">
              <span className="section-subtitle-lowercase">{instagramSettings.subtitle}</span>
              <h2 className="editorial-title-v2">{instagramSettings.title}</h2>
              <a href={instagramSettings.instagram_link} target="_blank" rel="noopener noreferrer" className="instagram-handle">
                {instagramSettings.instagram_handle}
              </a>
            </div>
            <div className="instagram-asymmetric-grid">
              {instagramSettings.items.map((item: any, idx: number) => (
                <div key={idx} className="instagram-grid-item">
                  <img src={item.image_url} alt="Ruven Studio Instagram fellowship styling" />
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="instagram-overlay">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                    <span>View Post</span>
                  </a>
                </div>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  const sectionOrderKeys = sections.length > 0 
    ? sections.map(s => s.section_key)
    : ["trust-strip", "editorial-mission", "featured-campaign", "lifestyle-immersive", "scripture-highlight", "best-sellers", "why-ruven", "testimonials", "instagram-gallery"];

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
      {sectionOrderKeys.map(key => renderSection(key))}
    </div>
  );
}
