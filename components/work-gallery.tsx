"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Category, Work } from "@/lib/types";
import { ImageCard } from "@/components/image-card";

type WorkGalleryProps = {
  categories: Category[];
  works: Work[];
  initialCategory?: string;
};

export function WorkGallery({ categories, works, initialCategory = "all" }: WorkGalleryProps) {
  const validInitial = categories.some((category) => category.slug === initialCategory) ? initialCategory : "all";
  const [activeCategory, setActiveCategory] = useState(validInitial);

  const filteredWorks = useMemo(() => {
    if (activeCategory === "all") return works;
    return works.filter((work) => work.categories?.slug === activeCategory);
  }, [activeCategory, works]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        <button
          className={`focus-ring rounded-full px-4 py-2 text-sm font-semibold transition ${activeCategory === "all" ? "bg-ink text-white" : "bg-white/70 text-ink/70 hover:text-ink"}`}
          onClick={() => setActiveCategory("all")}
          type="button"
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`focus-ring rounded-full px-4 py-2 text-sm font-semibold transition ${activeCategory === category.slug ? "bg-ink text-white" : "bg-white/70 text-ink/70 hover:text-ink"}`}
            onClick={() => setActiveCategory(category.slug)}
            type="button"
          >
            {category.title}
          </button>
        ))}
      </div>

      {filteredWorks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink/20 bg-white/50 p-10 text-center text-ink/60">No work added yet.</div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorks.map((work) => (
            <Link key={work.id} href={`/work/${work.slug}`} className="group rounded-lg border border-ink/10 bg-white/60 p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
              <ImageCard src={work.thumbnail_url} alt={work.title} />
              <div className="space-y-3 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-clay">{work.categories?.title ?? "Uncategorized"}</p>
                <h3 className="text-xl font-semibold">{work.title}</h3>
                <p className="text-sm leading-6 text-ink/65">{work.short_description}</p>
                <span className="inline-flex text-sm font-semibold text-moss transition group-hover:text-ink">View project</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
