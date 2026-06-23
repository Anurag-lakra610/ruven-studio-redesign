-- Ruven OS — Homepage CMS Tables setup and initial seeds
-- Timestamp: 2026-06-23T12:30:00Z

-- 1. Create homepage_sections table
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key VARCHAR(50) UNIQUE NOT NULL,
  section_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create campaign_settings table
CREATE TABLE IF NOT EXISTS campaign_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name VARCHAR(100) NOT NULL,
  subtitle VARCHAR(100),
  description TEXT,
  tee_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  hoodie_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for new tables
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to homepage components and active campaigns
CREATE POLICY "Allow public read access to homepage_sections" ON homepage_sections
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to campaign_settings" ON campaign_settings
  FOR SELECT USING (true);

-- Allow admins full control over homepage configuration
CREATE POLICY "Allow authenticated admin modify homepage_sections" ON homepage_sections
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated admin modify campaign_settings" ON campaign_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Seed Homepage Sections Content Settings
INSERT INTO homepage_sections (section_key, section_order, is_active, settings) VALUES
('trust-strip', 1, TRUE, '{
  "items": [
    {"icon": "Shirt", "text": "Premium Fabric"},
    {"icon": "Sparkles", "text": "Faith Inspired"},
    {"icon": "ShieldCheck", "text": "Secure Checkout"},
    {"icon": "Truck", "text": "Fast Shipping"},
    {"icon": "Compass", "text": "Designed with Purpose"},
    {"icon": "Activity", "text": "Made for Everyday Wear"}
  ]
}'::jsonb),

('editorial-mission', 2, TRUE, '{
  "subtitle": "our purpose",
  "title": "Formed in Faith. Tailored for Purpose.",
  "paragraph": "Ruven Studio is an independent Christian lifestyle label creating heavy-weight apparel designed to start quiet, meaningful conversations. We construct each garment to serve as a visual bridge, allowing you to carry your faith with elegance and confidence in modern creative environments.",
  "quote_text": "We don''t create clothing to conform; we design to transform.",
  "quote_author": "The Ruven Collective",
  "verse_quote": "Do not be conformed to this world, but be transformed by the renewal of your mind...",
  "verse_ref": "Romans 12:2",
  "image_url": "/brand_story_lifestyle.png"
}'::jsonb),

('featured-campaign', 3, TRUE, '{
  "subtitle": "editorial drop 01",
  "title": "The Armor & Protection Campaign",
  "description": "A meticulous collection representing strength and spiritual integrity in a chaotic world. Styled with Scandinavian minimalism and heavyweight textures.",
  "statement_title": "Every Thread Tells a Story",
  "statement_description": "Our graphics are not simple illustrations. They are screen-printed conversations waiting to happen, serving as reminders of mental renewal, clarity, and protection in God.",
  "statement_cta_text": "Browse All Apparel",
  "statement_cta_link": "/shop"
}'::jsonb),

('lifestyle-immersive', 4, TRUE, '{
  "subtitle": "lifestyle campaign",
  "title": "Faith Is Meant To Be Lived. Not Hidden.",
  "description": "Designed in India to carry the message of light. Our premium minimal streetwear helps you start the conversations that matter.",
  "cta_text": "Explore the Lookbook",
  "cta_link": "/shop",
  "image_url": "/hero_lifestyle.png"
}'::jsonb),

('scripture-highlight', 5, TRUE, '{
  "label": "scripture focus",
  "verse": "Do not be conformed to this world, but be transformed by the renewal of your mind, that by testing you may discern what is the will of God, what is good and acceptable and perfect.",
  "reference": "Romans 12:2",
  "explanation_title": "Why This Verse Matters",
  "explanation_text": "In a generation driven by noise, social pressure, and anxiety, this verse is a sanctuary. It reminds us that our true identity is found in renewal and divine transformation, rather than mimicking temporary worldly patterns. This scriptural theme forms the creative core of our Heavyweight Hoodie collection.",
  "cta_text": "Explore Mind Renewal Drops",
  "cta_link": "/shop?category=hoodies"
}'::jsonb),

('best-sellers', 6, TRUE, '{
  "subtitle": "essential drops",
  "title": "Ruven Studio Best Sellers",
  "hero_product_fabric": "Fabric: 380 GSM ultra-heavy combed French Terry. Loop-back lining, double-lined drawstring-free hood. Crafted to represent comfortable, mindful living.",
  "hero_product_verse": "Do not conform... but be transformed."
}'::jsonb),

('why-ruven', 7, TRUE, '{
  "subtitle": "crafted for conversation",
  "title": "The Anatomy of Ruven Studio",
  "items": [
    {"icon": "MessageSquare", "title": "Designed to Start Conversations", "description": "Every graphic acts as an intentional conversation starter, creating direct opportunities to share faith and hope."},
    {"icon": "Shirt", "title": "Premium Heavyweight Cotton", "description": "Tailored in 240 GSM T-shirts and 380 GSM loopback French Terry hoodies. Durable, dense, and built to last."},
    {"icon": "Feather", "title": "Faith Inspired Graphics", "description": "Original, minimalist scriptural symbols screen-printed carefully with absolute precision."},
    {"icon": "Calendar", "title": "Limited Edition Collections", "description": "Released in small, calculated runs to maintain design integrity and reduce environmental manufacturing waste."},
    {"icon": "Heart", "title": "Ethically Produced", "description": "Independently manufactured in clean, safe facilities in India supporting local creative tailors."},
    {"icon": "Activity", "title": "Built for Everyday Wear", "description": "Featuring pre-shrunk structures, double-stitched details, and timeless cuts for modern comfort."}
  ]
}'::jsonb),

('testimonials', 8, TRUE, '{
  "subtitle": "united in faith",
  "title": "Shared Reflections",
  "reviews": [
    {
      "rating": 5,
      "quote": "The Armor of Light tee has opened so many doors. Friends at college ask what the shield represents, allowing me to share my faith journey naturally.",
      "author_initial": "D",
      "author_name": "David S.",
      "author_sub": "Bengaluru • College Ministry",
      "avatar_color": "var(--color-brand-burgundy)",
      "avatar_text_color": "var(--color-white)"
    },
    {
      "rating": 5,
      "quote": "The comfort of the loopback French Terry is outstanding, but the reminder of mental renewal on the chest serves as a quiet anchor of peace during my days.",
      "author_initial": "P",
      "author_name": "Priya M.",
      "author_sub": "Mumbai • Creative Director",
      "avatar_color": "var(--color-brand-gold)",
      "avatar_text_color": "var(--color-text-primary)"
    },
    {
      "rating": 5,
      "quote": "Perfect boxy fit. I wear my Ruven Studio tees to fellowships and study circles. It always sparks conversations about walk of faith and identity in Christ.",
      "author_initial": "R",
      "author_name": "Rahul K.",
      "author_sub": "New Delhi • Student Leader",
      "avatar_color": "var(--color-border)",
      "avatar_text_color": "var(--color-text-primary)"
    }
  ]
}'::jsonb),

('instagram-gallery', 9, TRUE, '{
  "subtitle": "fellowship studio",
  "title": "Shared on Instagram",
  "instagram_handle": "@ruven.studio",
  "instagram_link": "https://instagram.com/ruven.studio",
  "items": [
    {"image_url": "/brand_story_lifestyle.png", "link": "https://instagram.com/ruven.studio"},
    {"image_url": "/hero_lifestyle.png", "link": "https://instagram.com/ruven.studio"},
    {"image_url": "/oversized_tee_product.png", "link": "https://instagram.com/ruven.studio"},
    {"image_url": "/faith_hoodie_product.png", "link": "https://instagram.com/ruven.studio"}
  ]
}'::jsonb);

-- 4. Seed initial Campaign Settings
INSERT INTO campaign_settings (campaign_name, subtitle, description, tee_product_id, hoodie_product_id, is_active) VALUES
('The Armor & Protection Campaign', 'editorial drop 01', 'A meticulous collection representing strength and spiritual integrity in a chaotic world. Styled with Scandinavian minimalism and heavyweight textures.', 'f1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111112', TRUE);
