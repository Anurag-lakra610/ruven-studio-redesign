"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "../AccountContext";
import { BookOpen, Bookmark, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function JournalPage() {
  const { customerId } = useAccount();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load articles from Supabase or fallback mock data
    const fetchArticles = async () => {
      const isDummy =
        process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("dummy") ||
        !process.env.NEXT_PUBLIC_SUPABASE_URL;

      const mock = [
        { id: "art-1", title: "Romans 13:12 — Armoring with Light", slug: "romans-13-12-armoring-with-light", cover_image_url: "/faith_hoodie_product.png", published_at: "June 24, 2026", duration: "4 min read" },
        { id: "art-2", title: "The Art of Heavyweight Boxy Cuts", slug: "art-of-heavyweight-boxy-cuts", cover_image_url: "/oversized_tee_product.png", published_at: "June 20, 2026", duration: "6 min read" },
        { id: "art-3", title: "Renewal of Mind: A Creative Manifesto", slug: "renewal-of-mind-creative-manifesto", cover_image_url: "/faith_hoodie_product.png", published_at: "June 15, 2026", duration: "5 min read" }
      ];

      if (isDummy) {
        setArticles(mock);
        setLoading(false);
        return;
      }

      try {
        const supabase = (window as any).supabase || null;
        if (supabase) {
          const { data, error } = await supabase
            .from("articles")
            .select("id, title, slug, cover_image_url, published_at")
            .eq("status", "Published")
            .order("published_at", { ascending: false })
            .limit(6);
          if (data && data.length > 0) {
            setArticles(data.map((item: any) => ({
              id: item.id,
              title: item.title,
              slug: item.slug,
              cover_image_url: item.cover_image_url || "/oversized_tee_product.png",
              published_at: new Date(item.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
              duration: "4 min read"
            })));
          } else {
            setArticles(mock);
          }
        } else {
          setArticles(mock);
        }
      } catch (err) {
        setArticles(mock);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="space-y-10">
      <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-50">
          My Journal Library
        </h2>
      </div>

      {/* 2-Column Split: Saved Devotions & Stroll History */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Saved Devotions List */}
        <div className="md:col-span-8 space-y-6">
          <div className="flex items-center gap-2 text-zinc-400">
            <Bookmark className="w-4 h-4" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Bookmarks & Reflections</h3>
          </div>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 bg-zinc-50 dark:bg-zinc-900/50 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {articles.map((art) => (
                <div key={art.id} className="group border border-zinc-100 dark:border-zinc-800/80 p-5 bg-white dark:bg-zinc-900/10 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="aspect-[4/5] bg-zinc-50 dark:bg-zinc-900 overflow-hidden relative">
                      <img
                        src={art.cover_image_url}
                        alt={art.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-wider block">
                        {art.published_at} &bull; {art.duration}
                      </span>
                      <h4 className="text-xs font-bold uppercase tracking-wide line-clamp-2 text-zinc-900 dark:text-zinc-100">
                        {art.title}
                      </h4>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/60 mt-4">
                    <Link
                      href={`/journal/${art.slug}`}
                      className="text-[9px] font-bold uppercase tracking-widest text-[#670000] dark:text-red-400 flex items-center gap-1.5 group-hover:underline"
                    >
                      <span>Read Devotional</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reading History */}
        <div className="md:col-span-4 space-y-6">
          <div className="flex items-center gap-2 text-zinc-400">
            <Clock className="w-4 h-4" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Reading History</h3>
          </div>

          <div className="space-y-4">
            {[
              { title: " Romans 12:2 Refinement", date: "June 24, 2026" },
              { title: " Romans 13:12 Linear Design", date: "June 21, 2026" },
              { title: " The Armor of God Manifesto", date: "June 19, 2026" }
            ].map((item, idx) => (
              <div key={idx} className="p-4 border border-zinc-100 dark:border-zinc-800 bg-zinc-50/10 dark:bg-zinc-900/10 space-y-1">
                <span className="text-[8px] font-mono text-zinc-400 block uppercase">{item.date}</span>
                <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-800 dark:text-zinc-200 block truncate">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
