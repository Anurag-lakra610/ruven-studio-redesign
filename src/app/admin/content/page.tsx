"use client";

import React, { useState, useEffect } from "react";
import { 
  getDevotionals, 
  getProducts, 
  getHomepageSections, 
  updateHomepageSection, 
  getActiveCampaign, 
  updateCampaignSettings,
  MockDevotional, 
  MockProduct, 
  HomepageSection, 
  CampaignSettings 
} from "@/lib/db";
import { 
  Plus, 
  Trash2, 
  Save, 
  Book, 
  FileText, 
  ShoppingBag, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  Settings, 
  Eye, 
  EyeOff, 
  Layout, 
  ChevronRight, 
  Star 
} from "lucide-react";

interface EditorialBlock {
  id: string;
  type: "paragraph" | "heading" | "scripture" | "product";
  content: string;
  reference?: string; // for scripture
  productId?: string; // for product embed
}

export default function AdminContentStudioPage() {
  const [activeTab, setActiveTab] = useState<"devotionals" | "homepage">("devotionals");
  
  // Devotionals State
  const [devotionals, setDevotionals] = useState<MockDevotional[]>([]);
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [selectedDevotional, setSelectedDevotional] = useState<MockDevotional | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [coverImage, setCoverImage] = useState("/hero_lifestyle.png");
  const [status, setStatus] = useState("Draft");
  const [blocks, setBlocks] = useState<EditorialBlock[]>([]);

  // Homepage CMS State
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [campaign, setCampaign] = useState<CampaignSettings | null>(null);
  const [selectedSection, setSelectedSection] = useState<HomepageSection | null>(null);

  // Seeded scriptures database list for editor
  const scripturesDB = [
    { ref: "Romans 13:12", text: "The night is far gone; the day is at hand. So then let us cast off the works of darkness and put on the armor of light." },
    { ref: "Romans 12:2", text: "Do not be conformed to this world, but be transformed by the renewal of your mind, that by testing you may discern what is the will of God, what is good and acceptable and perfect." }
  ];

  // Load Initial Data
  useEffect(() => {
    getDevotionals().then(res => {
      setDevotionals(res);
      if (res.length > 0) {
        handleLoadDevotional(res[0]);
      }
    });
    getProducts().then(res => setProducts(res));
    getHomepageSections().then(res => {
      setSections(res);
      if (res.length > 0) {
        setSelectedSection(res[0]);
      }
    });
    getActiveCampaign().then(res => setCampaign(res));
  }, []);

  // DEVOTIONAL EDITING HANDLERS
  const handleLoadDevotional = (dev: MockDevotional) => {
    setSelectedDevotional(dev);
    setTitle(dev.title);
    setSummary(dev.summary);
    setCoverImage(dev.cover_image_url);
    setStatus(dev.published_at ? "Published" : "Draft");

    const mapped = dev.body_json.map((b: any, idx: number) => ({
      id: `${idx}-${Date.now()}`,
      type: b.type,
      content: b.content,
      reference: b.reference,
      productId: b.productId
    }));
    setBlocks(mapped);
  };

  const handleAddBlock = (type: "paragraph" | "heading" | "scripture" | "product") => {
    const newBlock: EditorialBlock = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      content:
        type === "heading"
          ? "New Section Header"
          : type === "scripture"
          ? scripturesDB[0].text
          : type === "product"
          ? "Shop the Armor Tee drop below"
          : "Write your devotional paragraph content here...",
      reference: type === "scripture" ? scripturesDB[0].ref : undefined,
      productId: type === "product" ? products[0]?.id : undefined
    };
    setBlocks(prev => [...prev, newBlock]);
  };

  const handleUpdateBlockContent = (id: string, text: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, content: text } : b));
  };

  const handleUpdateBlockMeta = (id: string, key: string, value: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, [key]: value } : b));
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const handleMoveBlock = (idx: number, dir: "up" | "down") => {
    const updated = [...blocks];
    const targetIdx = dir === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;

    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setBlocks(updated);
  };

  const handleSaveDevotional = () => {
    if (!selectedDevotional) return;
    setDevotionals(prev =>
      prev.map(d =>
        d.id === selectedDevotional.id
          ? {
              ...d,
              title,
              summary,
              cover_image_url: coverImage,
              body_json: blocks.map(b => ({
                type: b.type,
                content: b.content,
                reference: b.reference,
                productId: b.productId
              }))
            }
          : d
      )
    );
    alert("Devotional article draft saved in database successfully!");
  };

  // HOMEPAGE CMS HANDLERS
  const handleSaveCampaign = () => {
    if (!campaign) return;
    updateCampaignSettings(campaign.id, campaign).then(success => {
      if (success) {
        alert("Active storefront campaign settings updated in database!");
      }
    });
  };

  const handleSaveSection = () => {
    if (!selectedSection) return;
    updateHomepageSection(
      selectedSection.section_key, 
      selectedSection.settings, 
      selectedSection.is_active, 
      selectedSection.section_order
    ).then(success => {
      if (success) {
        // Refresh section list from DB
        getHomepageSections().then(res => {
          setSections(res);
          const updated = res.find(s => s.section_key === selectedSection.section_key);
          if (updated) setSelectedSection(updated);
        });
        alert(`Homepage section "${selectedSection.section_key}" updated successfully!`);
      }
    });
  };

  const handleMoveSection = (idx: number, dir: "up" | "down") => {
    const updated = [...sections];
    const targetIdx = dir === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;

    // Swap orders
    const tempOrder = updated[idx].section_order;
    updated[idx].section_order = updated[targetIdx].section_order;
    updated[targetIdx].section_order = tempOrder;

    // Save orders
    Promise.all([
      updateHomepageSection(updated[idx].section_key, updated[idx].settings, updated[idx].is_active, updated[idx].section_order),
      updateHomepageSection(updated[targetIdx].section_key, updated[targetIdx].settings, updated[targetIdx].is_active, updated[targetIdx].section_order)
    ]).then(() => {
      getHomepageSections().then(res => {
        setSections(res);
        if (selectedSection) {
          const updatedSelected = res.find(s => s.section_key === selectedSection.section_key);
          if (updatedSelected) setSelectedSection(updatedSelected);
        }
      });
    });
  };

  const handleSettingsChange = (key: string, value: any) => {
    if (!selectedSection) return;
    const updatedSettings = { ...selectedSection.settings, [key]: value };
    setSelectedSection({
      ...selectedSection,
      settings: updatedSettings
    });
    setSections(prev => prev.map(s => s.section_key === selectedSection.section_key ? { ...s, settings: updatedSettings } : s));
  };

  const handleListItemChange = (idx: number, field: string, val: any) => {
    if (!selectedSection || !selectedSection.settings.items) return;
    const items = [...selectedSection.settings.items];
    items[idx] = { ...items[idx], [field]: val };
    handleSettingsChange("items", items);
  };

  const handleReviewChange = (idx: number, field: string, val: any) => {
    if (!selectedSection || !selectedSection.settings.reviews) return;
    const reviews = [...selectedSection.settings.reviews];
    reviews[idx] = { ...reviews[idx], [field]: val };
    handleSettingsChange("reviews", reviews);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-left">
      {/* TABS HEADER */}
      <div className="flex justify-between items-center pb-4 border-b border-[var(--adm-border-subtle)] flex-wrap gap-4">
        <div className="adm-tabs">
          <button 
            onClick={() => setActiveTab("devotionals")}
            className={`adm-tab ${activeTab === "devotionals" ? "active" : ""}`}
          >
            Devotional Journal
          </button>
          <button 
            onClick={() => setActiveTab("homepage")}
            className={`adm-tab ${activeTab === "homepage" ? "active" : ""}`}
          >
            Homepage Content CMS
          </button>
        </div>
        <div className="text-[10px] font-mono text-[var(--adm-text-secondary)] bg-[var(--adm-bg-surface)] px-3 py-1 rounded border border-[var(--adm-border-subtle)]">
          Ruven Content Studio • Live Mode
        </div>
      </div>

      {activeTab === "devotionals" ? (
        /* ==================== DEVOTIONALS STUDIO TAB ==================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT SIDE: ARTICLES LIST */}
          <aside className="lg:col-span-4 bg-[var(--adm-bg-surface)] border border-[var(--adm-border-subtle)] rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--adm-border-subtle)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--adm-text-primary)]">Journal Articles</h3>
              <span className="text-[10px] font-bold text-[var(--adm-brand-burgundy-light)] uppercase">{devotionals.length} Drafts</span>
            </div>

            <div className="space-y-2">
              {devotionals.map((dev) => {
                const isSelected = selectedDevotional?.id === dev.id;
                return (
                  <button
                    key={dev.id}
                    onClick={() => handleLoadDevotional(dev)}
                    className={`w-full p-4 rounded-lg border text-left space-y-2 transition-all ${
                      isSelected
                        ? "border-[var(--adm-brand-burgundy)] bg-[var(--adm-bg-elevated)]"
                        : "border-[var(--adm-border-subtle)] hover:border-[var(--adm-text-secondary)] bg-[var(--adm-bg-surface)]"
                    }`}
                  >
                    <h4 className="text-xs font-bold uppercase tracking-wide text-[var(--adm-text-primary)] line-clamp-1">
                      {dev.title}
                    </h4>
                    <p className="text-[10px] text-[var(--adm-text-secondary)] line-clamp-2 leading-relaxed">
                      {dev.summary}
                    </p>
                    <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest text-[var(--adm-text-muted)] pt-2 border-t border-[var(--adm-border-subtle)]">
                      <span>Author: {dev.author}</span>
                      <span className="text-green-600">Published</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* RIGHT SIDE: RICH BLOCK-EDITOR */}
          <section className="lg:col-span-8 bg-[var(--adm-bg-surface)] border border-[var(--adm-border-subtle)] rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-[var(--adm-border-subtle)]">
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-brand-gold)]">Notion block-composer</span>
                <h3 className="text-sm font-bold uppercase text-[var(--adm-text-primary)] tracking-wide">Weekly Journal Editor</h3>
              </div>
              <button
                onClick={handleSaveDevotional}
                className="px-5 py-2 bg-[var(--adm-brand-burgundy)] hover:bg-[var(--adm-brand-burgundy-mid)] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Devotional</span>
              </button>
            </div>

            {/* Article Metadata Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-primary)] block">Devotional Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2.5 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-primary)] block">Cover Image Path</label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2.5 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-primary)] block">SEO Summary (Meta description)</label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2.5 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                />
              </div>
            </div>

            {/* Interactive Blocks list */}
            <div className="space-y-5 pt-5 border-t border-[var(--adm-border-subtle)]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--adm-text-muted)] block">Article Blocks</span>

              <div className="space-y-4">
                {blocks.map((block, idx) => (
                  <div
                    key={block.id}
                    className="group flex gap-3 p-4 bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded-lg relative hover:border-[var(--adm-text-primary)] transition-all"
                  >
                    {/* Block Action Buttons */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        disabled={idx === 0}
                        onClick={() => handleMoveBlock(idx, "up")}
                        className="p-1 border border-[var(--adm-border-subtle)] hover:bg-[var(--adm-bg-overlay)] rounded transition-colors text-[var(--adm-text-secondary)] disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={idx === blocks.length - 1}
                        onClick={() => handleMoveBlock(idx, "down")}
                        className="p-1 border border-[var(--adm-border-subtle)] hover:bg-[var(--adm-bg-overlay)] rounded transition-colors text-[var(--adm-text-secondary)] disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBlock(block.id)}
                        className="p-1 border border-red-500/20 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-[var(--adm-bg-surface)] border border-[var(--adm-border-subtle)] flex items-center justify-center text-[var(--adm-brand-gold)] text-xs font-bold flex-shrink-0 mt-1">
                      {block.type === "paragraph" && <FileText className="w-4 h-4 text-emerald-600" />}
                      {block.type === "heading" && "H"}
                      {block.type === "scripture" && <Book className="w-4 h-4 text-[var(--adm-brand-burgundy)]" />}
                      {block.type === "product" && <ShoppingBag className="w-4 h-4 text-[var(--adm-text-primary)]" />}
                    </div>

                    <div className="flex-1 space-y-3">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--adm-text-muted)] block">
                        {block.type === "paragraph" && "Paragraph Block"}
                        {block.type === "heading" && "Heading Block"}
                        {block.type === "scripture" && "Scripture Block Embed"}
                        {block.type === "product" && "Commerce Buy Card Embed"}
                      </span>

                      {/* Block Editor Content */}
                      {block.type === "scripture" ? (
                        <div className="space-y-3 text-xs">
                          <select
                            value={block.reference}
                            onChange={(e) => {
                              const script = scripturesDB.find(s => s.ref === e.target.value);
                              if (script) {
                                handleUpdateBlockMeta(block.id, "reference", script.ref);
                                handleUpdateBlockContent(block.id, script.text);
                              }
                            }}
                            className="border border-[var(--adm-border-subtle)] bg-[var(--adm-bg-surface)] rounded p-2 text-[var(--adm-text-primary)] font-bold focus:outline-none focus:border-[var(--adm-brand-burgundy)]"
                          >
                            {scripturesDB.map(s => (
                              <option key={s.ref} value={s.ref}>{s.ref}</option>
                            ))}
                          </select>
                          <blockquote className="border-l-2 border-[var(--adm-brand-burgundy)] pl-4 italic text-[var(--adm-brand-burgundy-light)] bg-[var(--adm-bg-surface)] p-3 rounded leading-relaxed">
                            "{block.content}"
                          </blockquote>
                        </div>
                      ) : block.type === "product" ? (
                        <div className="space-y-3 text-xs">
                          <div className="flex gap-2">
                            <select
                              value={block.productId}
                              onChange={(e) => handleUpdateBlockMeta(block.id, "productId", e.target.value)}
                              className="border border-[var(--adm-border-subtle)] bg-[var(--adm-bg-surface)] rounded p-2 text-[var(--adm-text-primary)] font-bold focus:outline-none focus:border-[var(--adm-brand-burgundy)]"
                            >
                              {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                            </select>
                          </div>
                          <input
                            type="text"
                            value={block.content}
                            onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                            className="w-full bg-[var(--adm-bg-surface)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] font-medium"
                          />
                        </div>
                      ) : (
                        <textarea
                          rows={block.type === "heading" ? 1 : 3}
                          value={block.content}
                          onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                          className={`w-full border border-[var(--adm-border-subtle)] bg-[var(--adm-bg-surface)] rounded p-2.5 text-xs focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] ${
                            block.type === "heading" ? "font-bold uppercase tracking-wider" : "leading-relaxed"
                          }`}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Block Composer Toolbar Actions */}
              <div className="flex justify-center gap-3 pt-5 border-t border-[var(--adm-border-subtle)] flex-wrap">
                <button
                  onClick={() => handleAddBlock("paragraph")}
                  className="px-4 py-2 border border-[var(--adm-border-subtle)] hover:bg-[var(--adm-bg-elevated)] rounded text-[10px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)] hover:text-[var(--adm-text-primary)] transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Paragraph</span>
                </button>
                <button
                  onClick={() => handleAddBlock("heading")}
                  className="px-4 py-2 border border-[var(--adm-border-subtle)] hover:bg-[var(--adm-bg-elevated)] rounded text-[10px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)] hover:text-[var(--adm-text-primary)] transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Heading</span>
                </button>
                <button
                  onClick={() => handleAddBlock("scripture")}
                  className="px-4 py-2 border border-[var(--adm-border-subtle)] hover:bg-[var(--adm-bg-elevated)] rounded text-[10px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)] hover:text-[var(--adm-text-primary)] transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Scripture Embed</span>
                </button>
                <button
                  onClick={() => handleAddBlock("product")}
                  className="px-4 py-2 border border-[var(--adm-border-subtle)] hover:bg-[var(--adm-bg-elevated)] rounded text-[10px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)] hover:text-[var(--adm-text-primary)] transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Product Embed</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : (
        /* ==================== HOMEPAGE CONTENT CMS TAB ==================== */
        <div className="space-y-6">
          {/* SECTION A: ACTIVE CAMPAIGN SETTINGS */}
          {campaign && (
            <section className="bg-[var(--adm-bg-surface)] border border-[var(--adm-border-subtle)] rounded-xl p-5 md:p-6 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[var(--adm-border-subtle)]">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--adm-brand-gold)]">Storefront Drops</span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--adm-text-primary)]">Active Campaign Configuration</h3>
                </div>
                <button 
                  onClick={handleSaveCampaign}
                  className="px-4 py-1.5 bg-[var(--adm-brand-burgundy)] hover:bg-[var(--adm-brand-burgundy-mid)] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Campaign</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Campaign Name</label>
                  <input 
                    type="text" 
                    value={campaign.campaign_name} 
                    onChange={e => setCampaign({ ...campaign, campaign_name: e.target.value })}
                    className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Campaign Subtitle</label>
                  <input 
                    type="text" 
                    value={campaign.subtitle} 
                    onChange={e => setCampaign({ ...campaign, subtitle: e.target.value })}
                    className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Campaign Status</label>
                  <select 
                    value={campaign.is_active ? "active" : "inactive"} 
                    onChange={e => setCampaign({ ...campaign, is_active: e.target.value === "active" })}
                    className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] font-bold"
                  >
                    <option value="active">Active (Renders on Storefront)</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Campaign Banner Description</label>
                  <textarea 
                    rows={2}
                    value={campaign.description} 
                    onChange={e => setCampaign({ ...campaign, description: e.target.value })}
                    className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] leading-relaxed resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Featured Tee Product</label>
                  <select 
                    value={campaign.tee_product_id || ""} 
                    onChange={e => setCampaign({ ...campaign, tee_product_id: e.target.value || null })}
                    className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                  >
                    <option value="">-- Select Product --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (₹{p.base_price})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Featured Hoodie Product</label>
                  <select 
                    value={campaign.hoodie_product_id || ""} 
                    onChange={e => setCampaign({ ...campaign, hoodie_product_id: e.target.value || null })}
                    className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                  >
                    <option value="">-- Select Product --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (₹{p.base_price})</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>
          )}

          {/* SECTION B: HOMEPAGE LAYOUT CMS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: SECTIONS SEQUENCER */}
            <aside className="lg:col-span-4 bg-[var(--adm-bg-surface)] border border-[var(--adm-border-subtle)] rounded-xl p-5 space-y-4">
              <div className="pb-3 border-b border-[var(--adm-border-subtle)]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--adm-text-primary)]">Layout Hierarchy</h3>
                <span className="text-[8px] font-mono text-[var(--adm-text-muted)] block mt-0.5">Drag-and-drop / Sequencer</span>
              </div>

              <div className="space-y-2">
                {sections.map((sec, idx) => {
                  const isSelected = selectedSection?.section_key === sec.section_key;
                  return (
                    <div
                      key={sec.id}
                      onClick={() => setSelectedSection(sec)}
                      className={`w-full p-3.5 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? "border-[var(--adm-brand-burgundy)] bg-[var(--adm-bg-elevated)]"
                          : "border-[var(--adm-border-subtle)] hover:border-[var(--adm-text-secondary)] bg-[var(--adm-bg-surface)]"
                      }`}
                    >
                      <div className="space-y-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono text-[var(--adm-brand-gold)] font-bold">0{idx + 1}</span>
                          <h4 className="text-xs font-bold uppercase tracking-wide text-[var(--adm-text-primary)] truncate">
                            {sec.section_key.replace("-", " ")}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase">
                          {sec.is_active ? (
                            <span className="text-emerald-500 flex items-center gap-0.5"><Eye className="w-2.5 h-2.5" /> Visible</span>
                          ) : (
                            <span className="text-[var(--adm-text-muted)] flex items-center gap-0.5"><EyeOff className="w-2.5 h-2.5" /> Hidden</span>
                          )}
                        </div>
                      </div>

                      {/* Sequencer Buttons */}
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveSection(idx, "up")}
                          className="p-1 border border-[var(--adm-border-subtle)] hover:bg-[var(--adm-bg-overlay)] rounded transition-colors text-[var(--adm-text-secondary)] disabled:opacity-30"
                          aria-label="Move Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          disabled={idx === sections.length - 1}
                          onClick={() => handleMoveSection(idx, "down")}
                          className="p-1 border border-[var(--adm-border-subtle)] hover:bg-[var(--adm-bg-overlay)] rounded transition-colors text-[var(--adm-text-secondary)] disabled:opacity-30"
                          aria-label="Move Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* RIGHT COLUMN: SECTION FIELDS EDITOR */}
            <section className="lg:col-span-8 bg-[var(--adm-bg-surface)] border border-[var(--adm-border-subtle)] rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
              {selectedSection ? (
                <>
                  {/* Editor Header */}
                  <div className="flex justify-between items-center pb-4 border-b border-[var(--adm-border-subtle)]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Layout className="w-4 h-4 text-[var(--adm-brand-gold)]" />
                        <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--adm-brand-gold)]">Section Configurator</span>
                      </div>
                      <h3 className="text-sm font-bold uppercase text-[var(--adm-text-primary)] tracking-wide">
                        Edit: {selectedSection.section_key.replace("-", " ")}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Active/Inactive Toggle */}
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold uppercase text-[var(--adm-text-secondary)]">
                        <input 
                          type="checkbox"
                          checked={selectedSection.is_active}
                          onChange={e => {
                            setSelectedSection({ ...selectedSection, is_active: e.target.checked });
                            setSections(prev => prev.map(s => s.section_key === selectedSection.section_key ? { ...s, is_active: e.target.checked } : s));
                          }}
                          className="rounded border-[var(--adm-border-subtle)] bg-[var(--adm-bg-base)] text-[var(--adm-brand-burgundy)] focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5"
                        />
                        <span>Is Active</span>
                      </label>
                      <button
                        onClick={handleSaveSection}
                        className="px-5 py-2 bg-[var(--adm-brand-burgundy)] hover:bg-[var(--adm-brand-burgundy-mid)] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Section</span>
                      </button>
                    </div>
                  </div>

                  {/* Settings Form Builder */}
                  <div className="space-y-4 text-xs">
                    {/* 1. TRUST STRIP FORM */}
                    {selectedSection.section_key === "trust-strip" && selectedSection.settings.items && (
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--adm-text-muted)] block border-b border-[var(--adm-border-subtle)] pb-1">Trust Strip Items (Max 6)</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedSection.settings.items.map((item: any, idx: number) => (
                            <div key={idx} className="p-3.5 bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded-lg space-y-2 relative">
                              <span className="text-[8px] font-mono text-[var(--adm-brand-gold)] font-bold">Badge 0{idx + 1}</span>
                              <div className="space-y-1.5">
                                <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Badge Text</label>
                                <input 
                                  type="text" 
                                  value={item.text} 
                                  onChange={e => handleListItemChange(idx, "text", e.target.value)}
                                  className="w-full bg-[var(--adm-bg-surface)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Icon Selector</label>
                                <select 
                                  value={item.icon} 
                                  onChange={e => handleListItemChange(idx, "icon", e.target.value)}
                                  className="w-full bg-[var(--adm-bg-surface)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                                >
                                  <option value="Shirt">Shirt (Fabric)</option>
                                  <option value="Sparkles">Sparkles (Faith)</option>
                                  <option value="ShieldCheck">ShieldCheck (Security)</option>
                                  <option value="Truck">Truck (Shipping)</option>
                                  <option value="Compass">Compass (Purpose)</option>
                                  <option value="Activity">Activity (Everyday)</option>
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. EDITORIAL MISSION STORY FORM */}
                    {selectedSection.section_key === "editorial-mission" && (
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--adm-text-muted)] block border-b border-[var(--adm-border-subtle)] pb-1">Editorial Mission Settings</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Section Tag/Subtitle</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.subtitle || ""} 
                              onChange={e => handleSettingsChange("subtitle", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Headline Title</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.title || ""} 
                              onChange={e => handleSettingsChange("title", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] font-bold"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Main Description Paragraph</label>
                            <textarea 
                              rows={3}
                              value={selectedSection.settings.paragraph || ""} 
                              onChange={e => handleSettingsChange("paragraph", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] leading-relaxed resize-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Featured Callout Quote Text</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.quote_text || ""} 
                              onChange={e => handleSettingsChange("quote_text", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Featured Quote Author</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.quote_author || ""} 
                              onChange={e => handleSettingsChange("quote_author", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Scripture Accent Verse</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.verse_quote || ""} 
                              onChange={e => handleSettingsChange("verse_quote", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Scripture Reference Tag</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.verse_ref || ""} 
                              onChange={e => handleSettingsChange("verse_ref", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Lifestyle Image Path</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.image_url || ""} 
                              onChange={e => handleSettingsChange("image_url", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3. FEATURED CAMPAIGN EDITORIAL FORM */}
                    {selectedSection.section_key === "featured-campaign" && (
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--adm-text-muted)] block border-b border-[var(--adm-border-subtle)] pb-1">Featured Drop Campaign Layout Settings</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Campaign Headline</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.title || ""} 
                              onChange={e => handleSettingsChange("title", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] font-bold"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Campaign Tagline</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.subtitle || ""} 
                              onChange={e => handleSettingsChange("subtitle", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Campaign Subtitle Summary</label>
                            <textarea 
                              rows={2}
                              value={selectedSection.settings.description || ""} 
                              onChange={e => handleSettingsChange("description", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] resize-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Editorial Statement Headline</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.statement_title || ""} 
                              onChange={e => handleSettingsChange("statement_title", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Editorial Statement CTA Link</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.statement_cta_link || ""} 
                              onChange={e => handleSettingsChange("statement_cta_link", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Editorial Statement Body Copy</label>
                            <textarea 
                              rows={2}
                              value={selectedSection.settings.statement_description || ""} 
                              onChange={e => handleSettingsChange("statement_description", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 4. LIFESTYLE IMMERSIVE FORM */}
                    {selectedSection.section_key === "lifestyle-immersive" && (
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--adm-text-muted)] block border-b border-[var(--adm-border-subtle)] pb-1">Immersive Video / Image Banner Settings</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Campaign Headline</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.title || ""} 
                              onChange={e => handleSettingsChange("title", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] font-bold"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Campaign Label</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.subtitle || ""} 
                              onChange={e => handleSettingsChange("subtitle", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Banner Subheading Description</label>
                            <textarea 
                              rows={2}
                              value={selectedSection.settings.description || ""} 
                              onChange={e => handleSettingsChange("description", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] resize-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">CTA Button Text</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.cta_text || ""} 
                              onChange={e => handleSettingsChange("cta_text", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">CTA Target URL Link</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.cta_link || ""} 
                              onChange={e => handleSettingsChange("cta_link", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] font-mono"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Background Image Source</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.image_url || ""} 
                              onChange={e => handleSettingsChange("image_url", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 5. SCRIPTURE HIGHLIGHT FORM */}
                    {selectedSection.section_key === "scripture-highlight" && (
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--adm-text-muted)] block border-b border-[var(--adm-border-subtle)] pb-1">Scripture Spotlight & Reflection Block</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Category Label Tag</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.label || ""} 
                              onChange={e => handleSettingsChange("label", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Scripture Citation Reference</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.reference || ""} 
                              onChange={e => handleSettingsChange("reference", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Scripture Content Text</label>
                            <textarea 
                              rows={2}
                              value={selectedSection.settings.verse || ""} 
                              onChange={e => handleSettingsChange("verse", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] leading-relaxed resize-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Reflection Title Header</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.explanation_title || ""} 
                              onChange={e => handleSettingsChange("explanation_title", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">CTA Button Tag</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.cta_text || ""} 
                              onChange={e => handleSettingsChange("cta_text", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Reflection Body Commentary</label>
                            <textarea 
                              rows={3}
                              value={selectedSection.settings.explanation_text || ""} 
                              onChange={e => handleSettingsChange("explanation_text", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] leading-relaxed resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 6. BEST SELLERS EDITORIAL FORM */}
                    {selectedSection.section_key === "best-sellers" && (
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--adm-text-muted)] block border-b border-[var(--adm-border-subtle)] pb-1">Best Sellers Section Header & Accent Copy</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Headline Title</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.title || ""} 
                              onChange={e => handleSettingsChange("title", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] font-bold"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Subtitle Accent</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.subtitle || ""} 
                              onChange={e => handleSettingsChange("subtitle", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Featured Fabric Copy Tag</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.hero_product_fabric || ""} 
                              onChange={e => handleSettingsChange("hero_product_fabric", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Featured Verse Quote Preview</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.hero_product_verse || ""} 
                              onChange={e => handleSettingsChange("hero_product_verse", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 7. WHY CHOOSE RUVEN ANATOMY FORM */}
                    {selectedSection.section_key === "why-ruven" && selectedSection.settings.items && (
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--adm-text-muted)] block border-b border-[var(--adm-border-subtle)] pb-1">Brand Anatomy Features (Max 6)</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedSection.settings.items.map((item: any, idx: number) => (
                            <div key={idx} className="p-3.5 bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded-lg space-y-2">
                              <span className="text-[8px] font-mono text-[var(--adm-brand-gold)] font-bold">Feature 0{idx + 1}</span>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[8px] uppercase tracking-wider text-[var(--adm-text-secondary)]">Card Title</label>
                                  <input 
                                    type="text" 
                                    value={item.title} 
                                    onChange={e => handleListItemChange(idx, "title", e.target.value)}
                                    className="w-full bg-[var(--adm-bg-surface)] border border-[var(--adm-border-subtle)] rounded p-1.5 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] text-[10px]"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[8px] uppercase tracking-wider text-[var(--adm-text-secondary)]">Icon Type</label>
                                  <select 
                                    value={item.icon} 
                                    onChange={e => handleListItemChange(idx, "icon", e.target.value)}
                                    className="w-full bg-[var(--adm-bg-surface)] border border-[var(--adm-border-subtle)] rounded p-1.5 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] text-[10px]"
                                  >
                                    <option value="MessageSquare">MessageSquare (Chat)</option>
                                    <option value="Shirt">Shirt (Cotton)</option>
                                    <option value="Feather">Feather (Grace)</option>
                                    <option value="Calendar">Calendar (Drops)</option>
                                    <option value="Heart">Heart (Ethical)</option>
                                    <option value="Activity">Activity (Daily)</option>
                                  </select>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[8px] uppercase tracking-wider text-[var(--adm-text-secondary)]">Feature Description</label>
                                <textarea 
                                  rows={2}
                                  value={item.description} 
                                  onChange={e => handleListItemChange(idx, "description", e.target.value)}
                                  className="w-full bg-[var(--adm-bg-surface)] border border-[var(--adm-border-subtle)] rounded p-1.5 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] text-[10px] leading-relaxed resize-none"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 8. TESTIMONIALS / REFLECTIONS FORM */}
                    {selectedSection.section_key === "testimonials" && selectedSection.settings.reviews && (
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--adm-text-muted)] block border-b border-[var(--adm-border-subtle)] pb-1">Customer Testimonial Reviews (Max 3)</span>
                        <div className="space-y-4">
                          {selectedSection.settings.reviews.map((rev: any, idx: number) => (
                            <div key={idx} className="p-4 bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded-lg space-y-3">
                              <span className="text-[8px] font-mono text-[var(--adm-brand-gold)] font-bold">Reviewer Card 0{idx + 1}</span>
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                <div className="space-y-1.5">
                                  <label className="text-[8px] uppercase tracking-wider text-[var(--adm-text-secondary)]">Reviewer Name</label>
                                  <input 
                                    type="text" 
                                    value={rev.author_name} 
                                    onChange={e => handleReviewChange(idx, "author_name", e.target.value)}
                                    className="w-full bg-[var(--adm-bg-surface)] border border-[var(--adm-border-subtle)] rounded p-1.5 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[8px] uppercase tracking-wider text-[var(--adm-text-secondary)]">Avatar Initial</label>
                                  <input 
                                    type="text" 
                                    maxLength={1}
                                    value={rev.author_initial} 
                                    onChange={e => handleReviewChange(idx, "author_initial", e.target.value)}
                                    className="w-full bg-[var(--adm-bg-surface)] border border-[var(--adm-border-subtle)] rounded p-1.5 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] text-center font-bold"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[8px] uppercase tracking-wider text-[var(--adm-text-secondary)]">Ministry/Occupation Tag</label>
                                  <input 
                                    type="text" 
                                    value={rev.author_sub} 
                                    onChange={e => handleReviewChange(idx, "author_sub", e.target.value)}
                                    className="w-full bg-[var(--adm-bg-surface)] border border-[var(--adm-border-subtle)] rounded p-1.5 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[8px] uppercase tracking-wider text-[var(--adm-text-secondary)]">Star Rating Score</label>
                                  <select 
                                    value={rev.rating} 
                                    onChange={e => handleReviewChange(idx, "rating", parseInt(e.target.value))}
                                    className="w-full bg-[var(--adm-bg-surface)] border border-[var(--adm-border-subtle)] rounded p-1.5 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] font-bold"
                                  >
                                    <option value="5">5 Stars</option>
                                    <option value="4">4 Stars</option>
                                    <option value="3">3 Stars</option>
                                  </select>
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[8px] uppercase tracking-wider text-[var(--adm-text-secondary)]">Quote Review Text</label>
                                <textarea 
                                  rows={2}
                                  value={rev.quote} 
                                  onChange={e => handleReviewChange(idx, "quote", e.target.value)}
                                  className="w-full bg-[var(--adm-bg-surface)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] leading-relaxed resize-none"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 9. INSTAGRAM GALLERY FEED FORM */}
                    {selectedSection.section_key === "instagram-gallery" && selectedSection.settings.items && (
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--adm-text-muted)] block border-b border-[var(--adm-border-subtle)] pb-1">Instagram Media Feed Layout (4 Items)</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Instagram Handle Display Name</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.instagram_handle || ""} 
                              onChange={e => handleSettingsChange("instagram_handle", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)]"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--adm-text-secondary)]">Instagram Direct Feed URL Link</label>
                            <input 
                              type="text" 
                              value={selectedSection.settings.instagram_link || ""} 
                              onChange={e => handleSettingsChange("instagram_link", e.target.value)}
                              className="w-full bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded p-2 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] font-mono"
                            />
                          </div>
                          
                          {selectedSection.settings.items.map((item: any, idx: number) => (
                            <div key={idx} className="p-3 bg-[var(--adm-bg-base)] border border-[var(--adm-border-subtle)] rounded-lg space-y-2">
                              <span className="text-[8px] font-mono text-[var(--adm-brand-gold)] font-bold">Feed Photo 0{idx + 1}</span>
                              <div className="space-y-1">
                                <label className="text-[8px] uppercase text-[var(--adm-text-secondary)]">Image Source URL</label>
                                <input 
                                  type="text" 
                                  value={item.image_url} 
                                  onChange={e => handleListItemChange(idx, "image_url", e.target.value)}
                                  className="w-full bg-[var(--adm-bg-surface)] border border-[var(--adm-border-subtle)] rounded p-1.5 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] font-mono text-[10px]"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[8px] uppercase text-[var(--adm-text-secondary)]">Target Post Redirect Link</label>
                                <input 
                                  type="text" 
                                  value={item.link} 
                                  onChange={e => handleListItemChange(idx, "link", e.target.value)}
                                  className="w-full bg-[var(--adm-bg-surface)] border border-[var(--adm-border-subtle)] rounded p-1.5 focus:outline-none focus:border-[var(--adm-brand-burgundy)] text-[var(--adm-text-primary)] font-mono text-[10px]"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-[var(--adm-text-muted)]">
                  <Layout className="w-8 h-8 opacity-20 mb-2" />
                  <p className="text-xs uppercase tracking-wider font-bold">Select a layout section from sequence index sidebar to configure</p>
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
