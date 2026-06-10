"use client";

import Link from "next/link";
import { Category, Work } from "@/lib/types";
import { ImageCard } from "@/components/image-card";

type WorkGalleryProps = {
  categories: Category[];
  works: Work[];
  selectedCategory?: string;
};

export function WorkGallery({ categories, works, selectedCategory }: WorkGalleryProps) {
  const filteredWorks = selectedCategory ? works.filter((work) => work.categories?.slug === selectedCategory) : [];

  if (categories.length === 0) {
    return <div className="rounded-lg border border-dashed border-ink/20 bg-white/50 p-10 text-center text-ink/60">No categories added yet.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            className={`focus-ring rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCategory === category.slug ? "bg-ink text-white" : "bg-white/70 text-ink/70 hover:text-ink"}`}
            href={`/work?category=${category.slug}`}
          >
            {category.title}
          </Link>
        ))}
      </div>

      {filteredWorks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink/20 bg-white/50 p-10 text-center text-ink/60">No projects added in this category yet.</div>
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
