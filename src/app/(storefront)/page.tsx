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
  Star,
  ChevronLeft,
  ChevronRight
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
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

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
    subtitle: "THE RUVEN STORY",
    title: "Every Garment Begins With Scripture",
    paragraph: "We started Ruven Studio because we wanted clothing that carried our faith without compromising on design. Every garment is crafted from heavy, custom milled fabrics, built for daily wear, and designed to start quiet conversations. For us, scripture is not a print. It is a way of life.",
    quote_text: "",
    quote_author: "",
    verse_quote: "Do not be conformed to this world, but be transformed by the renewal of your mind...",
    verse_ref: "Romans 12:2",
    image_url: "/sec2-3.png"
  };

  const rawTitle = missionSettings.title || "";
  const displayTitle = (rawTitle === "Formed in Faith. Tailored for Purpose." || !rawTitle)
    ? "Every Garment Begins With Scripture"
    : rawTitle;

  const rawParagraph = missionSettings.paragraph || "";
  const displayParagraph = (rawParagraph.includes("Ruven Studio is") || rawParagraph.includes("We believe clothing") || !rawParagraph)
    ? "We started Ruven Studio because we wanted clothing that carried our faith without compromising on design. Every garment is crafted from heavy, custom milled fabrics, built for daily wear, and designed to start quiet conversations. For us, scripture is not a print. It is a way of life."
    : rawParagraph;

  const rawQuote = missionSettings.quote_text || "";
  const displayQuote = (rawQuote.includes("conform") || !rawQuote)
    ? "We believe clothing can quietly start meaningful conversations."
    : rawQuote;

  const rawImg = missionSettings.image_url || "";
  const displayImg = (rawImg.includes("lifestyle") || rawImg.includes("editorial") || !rawImg)
    ? "/sec2-3.png"
    : rawImg;

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
    image_url: "/cta2.png"
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
        avatar_color: "var(--color-text-secondary)",
        avatar_text_color: "var(--color-white)"
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
          <div key="trust-strip" className="trust-strip-v2 border-b border-border-warm">
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
          <section key="editorial-mission" className="editorial-mission section-padding-lg border-b border-border-warm" id="story-section">
            <div className="editorial-mission-grid">
              <motion.div 
                className="mission-text-col"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mission-label-wrap">
                  <span className="mission-label">
                    {missionSettings.subtitle === "our story" || missionSettings.subtitle === "our purpose" ? "THE RUVEN STORY" : missionSettings.subtitle.toUpperCase()}
                  </span>
                  <div className="mission-label-line" />
                </div>
                
                <motion.h2 
                  className="editorial-headline-large" 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  dangerouslySetInnerHTML={{ __html: displayTitle.replace(/\n/g, '<br />') }} 
                />
                
                <motion.p 
                  className="mission-paragraph"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  {displayParagraph}
                </motion.p>
                
                <motion.div 
                  className="mission-verse-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="verse-card-accent-line" />
                  <div className="verse-card-header">
                    <Feather className="verse-card-icon" />
                    <span className="mission-verse-ref">{missionSettings.verse_ref}</span>
                  </div>
                  <p className="mission-verse-quote">"{missionSettings.verse_quote}"</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Link href="/shop" className="mission-cta-btn">
                    SHOP THE COLLECTION
                  </Link>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="mission-image-col"
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mission-image-wrap">
                  <img 
                    src={displayImg} 
                    alt="Ruven Studio Story Editorial" 
                    className="mission-img" 
                  />
                </div>
              </motion.div>
            </div>
          </section>
        );

      case "featured-campaign":
        return showFeaturedCampaign && (
          <section key="featured-campaign" className="featured-campaign section-padding-lg border-b border-border-warm">
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
              <Link href={lifestyleSettings.cta_link} className="cta-button cta-button-charcoal">
                <span className="btn-content">
                  <span className="btn-text">{lifestyleSettings.cta_text}</span>
                  <span className="btn-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </span>
              </Link>
            </div>
          </section>
        );

      case "best-sellers":
        return showBestSellers && (
          <section key="best-sellers" className="best-sellers-editorial section-padding-lg border-b border-border-warm">
            <div className="best-sellers-header">
              <span className="section-subtitle-lowercase">{bestSellersSettings.subtitle}</span>
              <h2 className="editorial-title-v2">{bestSellersSettings.title}</h2>
            </div>

            <div className="best-sellers-wrapper relative group">
              {/* Floating Left Navigation Button */}
              <button 
                onClick={() => scroll("left")}
                className="scroll-arrow-btn left-arrow"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div ref={scrollRef} className="best-sellers-layout">
                {products.map((product) => {
                  const isHoodie = product.category_slug === "hoodies" || product.slug.includes("hoodie");
                  const scriptureRef = product.scripture 
                    ? `${product.scripture.book} ${product.scripture.chapter}:${product.scripture.verse}` 
                    : "";
                  const fabricDesc = isHoodie 
                    ? "Fabric: 380 GSM Ultra-Heavy French Terry" 
                    : "Fabric: 240 GSM Organic Heavyweight Cotton";

                  return (
                    <article key={product.id} className="nike-product-card" data-id={product.id}>
                      <div className="nike-card-img-wrap">
                        <img src={product.image} alt={product.name} className="nike-card-img" />
                        
                        <button 
                          onClick={() => handleWishlistToggle(product)}
                          className={`wishlist-btn ${isItemInWishlist(product.id) ? "active" : ""}`} 
                          aria-label="Add to wishlist"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                        
                        {/* Slide-up Quick Add Drawer on Hover */}
                        <div className="nike-card-quick-add">
                          <span className="quick-add-drawer-label">Quick Add</span>
                          <div className="quick-add-drawer-sizes">
                            {(product.variants && product.variants.length > 0 
                              ? product.variants.map((v) => v.size) 
                              : ["S", "M", "L", "XL"]
                            ).map((size) => (
                              <button 
                                key={size}
                                onClick={() => handleQuickAdd(product, size)}
                                className="quick-add-size-circle"
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="nike-card-details">
                        <div className="nike-card-ref-row">
                          <span className="nike-card-scripture-ref">{scriptureRef}</span>
                          <span className="nike-card-badge">{isHoodie ? "Best Seller" : "New Drop"}</span>
                        </div>
                        <h3 className="nike-card-title">{product.name}</h3>
                        <p className="nike-card-fabric">{fabricDesc}</p>
                        <div className="nike-card-price-row">
                          <span className="nike-card-price">₹{product.base_price}</span>
                          {product.original_price && <span className="nike-card-price-original">₹{product.original_price}</span>}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Floating Right Navigation Button */}
              <button 
                onClick={() => scroll("right")}
                className="scroll-arrow-btn right-arrow"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </section>
        );

      case "why-ruven":
        return showWhyRuven && (
          <section key="why-ruven" className="why-ruven section-padding-lg border-b border-border-warm">
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
          <section key="testimonials" className="community-testimonials border-b border-border-warm">
            <div className="testimonials-header-v2">
              <span className="testimonials-subtitle-v2">{testimonialsSettings.subtitle}</span>
              <h2 className="testimonials-title-v2">{testimonialsSettings.title}</h2>
            </div>
            
            <div className="testimonials-marquee-wrapper">
              <div className="testimonials-marquee-track">
                {Array.from({ length: 6 }).map((_, gIdx) => (
                  <div 
                    key={`group-${gIdx}`} 
                    className="testimonials-marquee-group"
                    aria-hidden={gIdx > 0 ? "true" : undefined}
                  >
                    {testimonialsSettings.reviews.map((rev: any, idx: number) => (
                      <div key={`review-${idx}`} className="testimonial-card-v2">
                        <div className="testimonial-rating-v2" role="img" aria-label={`${rev.rating} out of 5 stars`}>
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current text-current inline-block" />
                          ))}
                        </div>
                        <p className="testimonial-quote-v2">"{rev.quote}"</p>
                        <div className="testimonial-author-v2">
                          <div 
                            className="author-avatar-v2" 
                            style={{ 
                              backgroundColor: rev.avatar_color || 'var(--color-brand-burgundy)', 
                              color: rev.avatar_text_color || 'var(--color-white)' 
                            }}
                          >
                            {rev.author_initial}
                          </div>
                          <div className="author-details-v2">
                            <span className="author-name-v2">{rev.author_name}</span>
                            <span className="author-loc-v2">{rev.author_sub}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case "instagram-gallery":
        return showInstagram && (
          <section key="instagram-gallery" className="instagram-gallery section-padding-lg border-b border-border-warm">
            <div className="instagram-header-v2">
              <span className="instagram-subtitle-v2">{instagramSettings.subtitle}</span>
              <h2 className="instagram-title-v2">{instagramSettings.title}</h2>
              <a href={instagramSettings.instagram_link} target="_blank" rel="noopener noreferrer" className="instagram-handle-v2">
                {instagramSettings.instagram_handle}
              </a>
            </div>
            <div className="instagram-asymmetric-grid">
              {instagramSettings.items.map((item: any, idx: number) => (
                <div key={idx} className="instagram-grid-item relative group">
                  <img src={item.image_url} alt="Ruven Studio Instagram fellowship styling" className="w-full h-full object-cover" />
                  
                  {/* Premium Glassmorphic Coming Soon Badge */}
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-black/35 backdrop-blur-md border border-white/10 rounded-full pointer-events-none">
                    <span className="text-white text-[9px] font-bold tracking-[0.1em] uppercase">
                      Coming Soon
                    </span>
                  </div>

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

  const sectionOrderKeys = (sections.length > 0 
    ? sections.map(s => s.section_key)
    : ["trust-strip", "editorial-mission", "featured-campaign", "lifestyle-immersive", "best-sellers", "why-ruven", "testimonials", "instagram-gallery"]
  ).filter(key => key !== "scripture-highlight");

  // FAQ Accordion State & Component
  const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqData = [
      {
        q: "What sizes do you offer?",
        a: "We offer S, M, L, and XL across all our styles. Please refer to the detailed size chart available on each product page for exact sleeve, chest, and length measurements."
      },
      {
        q: "What is your return and exchange policy?",
        a: "We provide a 7-day exchange window from the date of delivery. All items must be unworn, unwashed, and in their original packaging with tags intact. Returns for store credit are also available."
      },
      {
        q: "How long does shipping take?",
        a: "Orders are processed within 24–48 hours. Shipping typically takes 5–7 business days across India. We offer complimentary shipping on all orders above ₹1,500."
      },
      {
        q: "How can I reach customer support?",
        a: "We are here to help. You can email us at hello@ruvenstudio.in or reach out directly on WhatsApp at +91 98765 43210. Our support team typically responds within 24 hours."
      }
    ];

    return (
      <section className="faq-section-v2 border-t border-border-warm" id="faq-section">
        <div className="faq-container-v2">
          {/* Left Column: Heading and Subtitle */}
          <div className="faq-info-col">
            <span className="faq-subtitle">common inquiries</span>
            <h2 className="faq-headline">Frequently Asked Questions</h2>
            <p className="faq-help-text">
              Have other questions? We are always here to help. Contact our customer support team at{" "}
              <a href="mailto:hello@ruvenstudio.in" className="faq-email-link">
                hello@ruvenstudio.in
              </a>{" "}
              or chat with us.
            </p>
          </div>
          
          {/* Right Column: Accordion List */}
          <div className="faq-accordion-col">
            {faqData.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="faq-item-v2">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="faq-question-btn"
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question-text">{item.q}</span>
                    <span className="faq-icon-wrap">
                      <svg 
                        className={`faq-plus-icon ${isOpen ? "rotate-45" : ""}`} 
                        viewBox="0 0 16 16" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="1.5"
                        style={{ width: "10px", height: "10px" }}
                      >
                        <line x1="8" y1="2" x2="8" y2="14" />
                        <line x1="2" y1="8" x2="14" y2="8" />
                      </svg>
                    </span>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="faq-answer-text">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
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
        
        <div className="hero-content font-sans">
          <h1 className="hero-headline">Faith, Woven Into<br/>Everyday Life.</h1>
          <p className="hero-supporting-text">Minimalist streetwear designed to quietly start meaningful conversations. Every garment is crafted to serve as a physical canvas for timeless scriptures.</p>
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
      <FAQSection />
    </div>
  );
}
