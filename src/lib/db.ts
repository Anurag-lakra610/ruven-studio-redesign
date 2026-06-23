import { createClient as createBrowserClient } from "@/utils/supabase/client";

export interface MockScripture {
  book: string;
  chapter: number;
  verse: string;
  translation: string;
  text_content: string;
}

export interface MockVariant {
  id: string;
  sku: string;
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  color: string;
  stock: number;
}

export interface MockProduct {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  original_price?: number;
  image: string;
  status: "Draft" | "Scheduled" | "Published" | "Archived";
  scripture?: MockScripture;
  variants: MockVariant[];
  category_slug?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface MockDevotional {
  id: string;
  title: string;
  slug: string;
  cover_image_url: string;
  summary: string;
  author: string;
  published_at: string;
  body_json: any[];
  scriptures?: MockScripture[];
}

export const MOCK_CATEGORIES: MockCategory[] = [
  { id: "c1111111-1111-1111-1111-111111111111", name: "Streetwear", slug: "streetwear" },
  { id: "c1111111-1111-1111-1111-111111111112", name: "Oversized Tees", slug: "oversized-tees" },
  { id: "c1111111-1111-1111-1111-111111111113", name: "French Terry Hoodies", slug: "hoodies" },
];

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "f1111111-1111-1111-1111-111111111111",
    category_id: "c1111111-1111-1111-1111-111111111112",
    category_slug: "oversized-tees",
    name: "Armor of Light Heavyweight Tee",
    slug: "armor-of-light-heavyweight-tee",
    description: "240 GSM organic combed cotton oversized streetwear tee with hand-screen printed Romans 13:12 linear shield graphic. Designed for lasting comfort, boxy streetwear fit, and to start natural, meaningful conversations.",
    base_price: 1999.00,
    original_price: 2499.00,
    image: "/oversized_tee_product.png",
    status: "Published",
    meta_title: "Armor of Light Heavyweight Tee — Ruven Studio",
    meta_description: "Heavyweight 240 GSM organic cotton oversized streetwear tee with linear shield design. Inspired by Romans 13:12.",
    scripture: {
      book: "Romans",
      chapter: 13,
      verse: "12",
      translation: "ESV",
      text_content: "The night is far gone; the day is at hand. So then let us cast off the works of darkness and put on the armor of light."
    },
    variants: [
      { id: "d1111111-1111-1111-1111-111111111111", sku: "RU-OVS-GRC-S", size: "S", color: "Ink Black", stock: 120 },
      { id: "d1111111-1111-1111-1111-111111111112", sku: "RU-OVS-GRC-M", size: "M", color: "Ink Black", stock: 150 },
      { id: "d1111111-1111-1111-1111-111111111113", sku: "RU-OVS-GRC-L", size: "L", color: "Ink Black", stock: 180 },
      { id: "d1111111-1111-1111-1111-111111111114", sku: "RU-OVS-GRC-XL", size: "XL", color: "Ink Black", stock: 90 },
    ]
  },
  {
    id: "f1111111-1111-1111-1111-111111111112",
    category_id: "c1111111-1111-1111-1111-111111111113",
    category_slug: "hoodies",
    name: "Renewal of Mind French Terry Hoodie",
    slug: "renewal-of-mind-french-terry-hoodie",
    description: "380 GSM ultra-heavy French Terry hoodie. Features a relaxed boxy silhouette, loop-back lining, and embroidered Romans 12:2 branch details on the chest.",
    base_price: 3499.00,
    original_price: 4299.00,
    image: "/faith_hoodie_product.png",
    status: "Published",
    meta_title: "Renewal of Mind French Terry Hoodie — Ruven Studio",
    meta_description: "Cozy 380 GSM combed French Terry hoodie with embroidered Romans 12:2 scripture details.",
    scripture: {
      book: "Romans",
      chapter: 12,
      verse: "2",
      translation: "ESV",
      text_content: "Do not be conformed to this world, but be transformed by the renewal of your mind, that by testing you may discern what is the will of God, what is good and acceptable and perfect."
    },
    variants: [
      { id: "d1111111-1111-1111-1111-111111111115", sku: "RU-HD-RNW-M", size: "M", color: "Warm Charcoal", stock: 75 },
      { id: "d1111111-1111-1111-1111-111111111116", sku: "RU-HD-RNW-L", size: "L", color: "Warm Charcoal", stock: 80 },
      { id: "d1111111-1111-1111-1111-111111111117", sku: "RU-HD-RNW-XL", size: "XL", color: "Warm Charcoal", stock: 45 },
    ]
  }
];

export const MOCK_DEVOTIONALS: MockDevotional[] = [
  {
    id: "a1111111-1111-1111-1111-111111111111",
    title: "The Armor of Light: Walking in Spiritual Defense",
    slug: "the-armor-of-light",
    cover_image_url: "/hero_lifestyle.png",
    summary: "Explore how we can cast off darkness and walk in spiritual integrity in a chaotic world, inspired by Romans 13:12.",
    author: "Super Admin",
    published_at: "2026-06-23T09:00:00Z",
    body_json: [
      { type: "paragraph", content: "In a generation driven by noise, social pressure, and anxiety, we are constantly faced with a choice of what we wear spiritually. The Apostle Paul writes in Romans 13:12: 'The night is far gone; the day is at hand. So then let us cast off the works of darkness and put on the armor of light.'" },
      { type: "heading", content: "Spiritual Preparedness in Modern Times" },
      { type: "paragraph", content: "Spiritual defense is not passive. Putting on armor requires active decision-making. Every morning we wake up, we decide our focus, our thoughts, and our actions. This heavyweight organic fabric of the Armor of Light Tee serves as a tangible, physical reminder to carry this mindset daily." },
      { type: "scripture", content: "The night is far gone; the day is at hand. So then let us cast off the works of darkness and put on the armor of light.", reference: "Romans 13:12" },
      { type: "paragraph", content: "By walking with confidence and intentionality, you become a light in the dark. Let your daily apparel start the conversations that matter." }
    ],
    scriptures: [
      {
        book: "Romans",
        chapter: 13,
        verse: "12",
        translation: "ESV",
        text_content: "The night is far gone; the day is at hand. So then let us cast off the works of darkness and put on the armor of light."
      }
    ]
  }
];

// Helper to determine if we should use fake/mock data
const isDummy = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return url.includes("dummy") || !url;
};

// GET PRODUCTS
export async function getProducts(options?: { categorySlug?: string; status?: string }): Promise<MockProduct[]> {
  if (isDummy()) {
    let filtered = [...MOCK_PRODUCTS];
    if (options?.categorySlug && options.categorySlug !== "all") {
      filtered = filtered.filter(p => p.category_slug === options.categorySlug);
    }
    return filtered;
  }

  try {
    const supabase = createBrowserClient();
    let query = supabase.from("products").select(`
      *,
      category:categories(name, slug),
      scripture:scriptures(*),
      variants:product_variants(*)
    `);

    if (options?.status) {
      query = query.eq("status", options.status);
    } else {
      query = query.eq("status", "Published");
    }

    const { data, error } = await query;
    if (error) throw error;
    if (!data) return [];

    return data.map((item: any) => ({
      id: item.id,
      category_id: item.category_id,
      category_slug: item.category?.slug,
      name: item.name,
      slug: item.slug,
      description: item.description,
      base_price: parseFloat(item.base_price),
      original_price: item.base_price ? parseFloat(item.base_price) * 1.25 : undefined,
      image: item.slug === "armor-of-light-heavyweight-tee" ? "/oversized_tee_product.png" : "/faith_hoodie_product.png",
      status: item.status,
      scripture: item.scripture,
      variants: item.variants || [],
      meta_title: item.meta_title,
      meta_description: item.meta_description,
    }));
  } catch (error) {
    console.warn("Supabase query error, falling back to mock data:", error);
    let filtered = [...MOCK_PRODUCTS];
    if (options?.categorySlug && options.categorySlug !== "all") {
      filtered = filtered.filter(p => p.category_slug === options.categorySlug);
    }
    return filtered;
  }
}

// GET PRODUCT BY SLUG
export async function getProductBySlug(slug: string): Promise<MockProduct | null> {
  if (isDummy()) {
    return MOCK_PRODUCTS.find(p => p.slug === slug) || null;
  }

  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        category:categories(name, slug),
        scripture:scriptures(*),
        variants:product_variants(*)
      `)
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    // Join inventory details for variants if available
    const { data: invData } = await supabase.from("inventory").select("*");

    const mappedVariants = (data.variants || []).map((v: any) => {
      const inv = invData?.find((i: any) => i.variant_id === v.id);
      return {
        id: v.id,
        sku: v.sku,
        size: v.size,
        color: v.color,
        stock: inv ? inv.quantity : 100,
      };
    });

    return {
      id: data.id,
      category_id: data.category_id,
      category_slug: data.category?.slug,
      name: data.name,
      slug: data.slug,
      description: data.description,
      base_price: parseFloat(data.base_price),
      original_price: data.base_price ? parseFloat(data.base_price) * 1.25 : undefined,
      image: data.slug === "armor-of-light-heavyweight-tee" ? "/oversized_tee_product.png" : "/faith_hoodie_product.png",
      status: data.status,
      scripture: data.scripture,
      variants: mappedVariants,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
    };
  } catch (error) {
    console.warn("Supabase query error, falling back to mock data:", error);
    return MOCK_PRODUCTS.find(p => p.slug === slug) || null;
  }
}

// GET CATEGORIES
export async function getCategories(): Promise<MockCategory[]> {
  if (isDummy()) {
    return MOCK_CATEGORIES;
  }

  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase.from("categories").select("*");
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn("Supabase query error, falling back to mock data:", error);
    return MOCK_CATEGORIES;
  }
}

// GET DEVOTIONALS
export async function getDevotionals(): Promise<MockDevotional[]> {
  if (isDummy()) {
    return MOCK_DEVOTIONALS;
  }

  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase.from("articles").select(`
      *,
      author:users(first_name, last_name)
    `).eq("status", "Published");

    if (error) throw error;
    if (!data) return [];

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      cover_image_url: "/hero_lifestyle.png",
      summary: item.meta_description || "Ruven Journal devotional publication.",
      author: item.author ? `${item.author.first_name} ${item.author.last_name}` : "Ruven Studio",
      published_at: item.published_at || item.created_at,
      body_json: Array.isArray(item.body_json) ? item.body_json : [],
    }));
  } catch (error) {
    console.warn("Supabase query error, falling back to mock data:", error);
    return MOCK_DEVOTIONALS;
  }
}

// GET DEVOTIONAL BY SLUG
export async function getDevotionalBySlug(slug: string): Promise<MockDevotional | null> {
  if (isDummy()) {
    return MOCK_DEVOTIONALS.find(a => a.slug === slug) || null;
  }

  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from("articles")
      .select(`
        *,
        author:users(first_name, last_name)
      `)
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      cover_image_url: "/hero_lifestyle.png",
      summary: data.meta_description || "",
      author: data.author ? `${data.author.first_name} ${data.author.last_name}` : "Ruven Studio",
      published_at: data.published_at || data.created_at,
      body_json: Array.isArray(data.body_json) ? data.body_json : [],
    };
  } catch (error) {
    console.warn("Supabase query error, falling back to mock data:", error);
    return MOCK_DEVOTIONALS.find(a => a.slug === slug) || null;
  }
}

// HOMEPAGE CMS INTERFACES
export interface HomepageSection {
  id: string;
  section_key: string;
  section_order: number;
  is_active: boolean;
  settings: any;
}

export interface CampaignSettings {
  id: string;
  campaign_name: string;
  subtitle: string;
  description: string;
  tee_product_id: string | null;
  hoodie_product_id: string | null;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
}

// CMS MOCK DATA
export const MOCK_HOMEPAGE_SECTIONS: HomepageSection[] = [
  {
    id: "h1111111-1111-1111-1111-111111111111",
    section_key: "trust-strip",
    section_order: 1,
    is_active: true,
    settings: {
      items: [
        { icon: "Shirt", text: "Premium Fabric" },
        { icon: "Sparkles", text: "Faith Inspired" },
        { icon: "ShieldCheck", text: "Secure Checkout" },
        { icon: "Truck", text: "Fast Shipping" },
        { icon: "Compass", text: "Designed with Purpose" },
        { icon: "Activity", text: "Made for Everyday Wear" }
      ]
    }
  },
  {
    id: "h1111111-1111-1111-1111-111111111112",
    section_key: "editorial-mission",
    section_order: 2,
    is_active: true,
    settings: {
      subtitle: "our purpose",
      title: "Formed in Faith. Tailored for Purpose.",
      paragraph: "Ruven Studio is an independent Christian lifestyle label creating heavy-weight apparel designed to start quiet, meaningful conversations. We construct each garment to serve as a visual bridge, allowing you to carry your faith with elegance and confidence in modern creative environments.",
      quote_text: "We don't create clothing to conform; we design to transform.",
      quote_author: "The Ruven Collective",
      verse_quote: "Do not be conformed to this world, but be transformed by the renewal of your mind...",
      verse_ref: "Romans 12:2",
      image_url: "/brand_story_lifestyle.png"
    }
  },
  {
    id: "h1111111-1111-1111-1111-111111111113",
    section_key: "featured-campaign",
    section_order: 3,
    is_active: true,
    settings: {
      subtitle: "editorial drop 01",
      title: "The Armor & Protection Campaign",
      description: "A meticulous collection representing strength and spiritual integrity in a chaotic world. Styled with Scandinavian minimalism and heavyweight textures.",
      statement_title: "Every Thread Tells a Story",
      statement_description: "Our graphics are not simple illustrations. They are screen-printed conversations waiting to happen, serving as reminders of mental renewal, clarity, and protection in God.",
      statement_cta_text: "Browse All Apparel",
      statement_cta_link: "/shop"
    }
  },
  {
    id: "h1111111-1111-1111-1111-111111111114",
    section_key: "lifestyle-immersive",
    section_order: 4,
    is_active: true,
    settings: {
      subtitle: "lifestyle campaign",
      title: "Faith Is Meant To Be Lived. Not Hidden.",
      description: "Designed in India to carry the message of light. Our premium minimal streetwear helps you start the conversations that matter.",
      cta_text: "Explore the Lookbook",
      cta_link: "/shop",
      image_url: "/hero_lifestyle.png"
    }
  },
  {
    id: "h1111111-1111-1111-1111-111111111115",
    section_key: "scripture-highlight",
    section_order: 5,
    is_active: true,
    settings: {
      label: "scripture focus",
      verse: "Do not be conformed to this world, but be transformed by the renewal of your mind, that by testing you may discern what is the will of God, what is good and acceptable and perfect.",
      reference: "Romans 12:2",
      explanation_title: "Why This Verse Matters",
      explanation_text: "In a generation driven by noise, social pressure, and anxiety, this verse is a sanctuary. It reminds us that our true identity is found in renewal and divine transformation, rather than mimicking temporary worldly patterns. This scriptural theme forms the creative core of our Heavyweight Hoodie collection.",
      cta_text: "Explore Mind Renewal Drops",
      cta_link: "/shop?category=hoodies"
    }
  },
  {
    id: "h1111111-1111-1111-1111-111111111116",
    section_key: "best-sellers",
    section_order: 6,
    is_active: true,
    settings: {
      subtitle: "essential drops",
      title: "Ruven Studio Best Sellers",
      hero_product_fabric: "Fabric: 380 GSM ultra-heavy combed French Terry. Loop-back lining, double-lined drawstring-free hood. Crafted to represent comfortable, mindful living.",
      hero_product_verse: "Do not conform... but be transformed."
    }
  },
  {
    id: "h1111111-1111-1111-1111-111111111117",
    section_key: "why-ruven",
    section_order: 7,
    is_active: true,
    settings: {
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
    }
  },
  {
    id: "h1111111-1111-1111-1111-111111111118",
    section_key: "testimonials",
    section_order: 8,
    is_active: true,
    settings: {
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
    }
  },
  {
    id: "h1111111-1111-1111-1111-111111111119",
    section_key: "instagram-gallery",
    section_order: 9,
    is_active: true,
    settings: {
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
    }
  }
];

export const MOCK_CAMPAIGN_SETTINGS: CampaignSettings = {
  id: "c2222222-2222-2222-2222-222222222222",
  campaign_name: "The Armor & Protection Campaign",
  subtitle: "editorial drop 01",
  description: "A meticulous collection representing strength and spiritual integrity in a chaotic world. Styled with Scandinavian minimalism and heavyweight textures.",
  tee_product_id: "f1111111-1111-1111-1111-111111111111",
  hoodie_product_id: "f1111111-1111-1111-1111-111111111112",
  is_active: true,
  start_date: null,
  end_date: null
};

// GET HOMEPAGE SECTIONS
export async function getHomepageSections(): Promise<HomepageSection[]> {
  if (isDummy()) {
    return [...MOCK_HOMEPAGE_SECTIONS].sort((a, b) => a.section_order - b.section_order);
  }

  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from("homepage_sections")
      .select("*")
      .order("section_order", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn("Supabase query error for homepage sections, falling back to mock data:", error);
    return [...MOCK_HOMEPAGE_SECTIONS].sort((a, b) => a.section_order - b.section_order);
  }
}

// UPDATE HOMEPAGE SECTION
export async function updateHomepageSection(key: string, settings: any, isActive: boolean = true, sectionOrder?: number): Promise<boolean> {
  if (isDummy()) {
    const idx = MOCK_HOMEPAGE_SECTIONS.findIndex(s => s.section_key === key);
    if (idx !== -1) {
      MOCK_HOMEPAGE_SECTIONS[idx].settings = settings;
      MOCK_HOMEPAGE_SECTIONS[idx].is_active = isActive;
      if (typeof sectionOrder === "number") {
        MOCK_HOMEPAGE_SECTIONS[idx].section_order = sectionOrder;
      }
      return true;
    }
    return false;
  }

  try {
    const supabase = createBrowserClient();
    const updateObj: any = { settings, is_active: isActive, updated_at: new Date().toISOString() };
    if (typeof sectionOrder === "number") {
      updateObj.section_order = sectionOrder;
    }
    const { error } = await supabase
      .from("homepage_sections")
      .update(updateObj)
      .eq("section_key", key);

    if (error) throw error;
    return true;
  } catch (error) {
    console.warn("Supabase update error for homepage section:", error);
    const idx = MOCK_HOMEPAGE_SECTIONS.findIndex(s => s.section_key === key);
    if (idx !== -1) {
      MOCK_HOMEPAGE_SECTIONS[idx].settings = settings;
      MOCK_HOMEPAGE_SECTIONS[idx].is_active = isActive;
      if (typeof sectionOrder === "number") {
        MOCK_HOMEPAGE_SECTIONS[idx].section_order = sectionOrder;
      }
      return true;
    }
    return false;
  }
}

// GET ACTIVE CAMPAIGN
export async function getActiveCampaign(): Promise<CampaignSettings | null> {
  if (isDummy()) {
    return MOCK_CAMPAIGN_SETTINGS;
  }

  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from("campaign_settings")
      .select("*")
      .eq("is_active", true)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.warn("Supabase query error for active campaign, falling back to mock data:", error);
    return MOCK_CAMPAIGN_SETTINGS;
  }
}

// UPDATE CAMPAIGN
export async function updateCampaignSettings(id: string, updates: Partial<CampaignSettings>): Promise<boolean> {
  if (isDummy()) {
    if (MOCK_CAMPAIGN_SETTINGS.id === id) {
      Object.assign(MOCK_CAMPAIGN_SETTINGS, updates);
      return true;
    }
    return false;
  }

  try {
    const supabase = createBrowserClient();
    const { error } = await supabase
      .from("campaign_settings")
      .update(updates)
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.warn("Supabase update error for campaign settings:", error);
    if (MOCK_CAMPAIGN_SETTINGS.id === id) {
      Object.assign(MOCK_CAMPAIGN_SETTINGS, updates);
      return true;
    }
    return false;
  }
}

