import { redirect } from "next/navigation";
import { WorkGallery } from "@/components/work-gallery";
import { getPublicCategories, getPublishedWorks } from "@/lib/data";

export default async function WorkPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const [{ category }, categories, works] = await Promise.all([searchParams, getPublicCategories(), getPublishedWorks()]);
  const firstCategory = categories[0];
  const selectedCategory = categories.find((item) => item.slug === category);

  if (firstCategory && !selectedCategory) {
    redirect(`/work?category=${firstCategory.slug}`);
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-10 max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">Work</p>
        <h1 className="font-serif text-5xl font-semibold md:text-6xl">Published projects and selected pieces.</h1>
        <p className="text-lg leading-8 text-ink/70">Browse the latest portfolio work by category. Only published projects appear here.</p>
      </div>
      <WorkGallery categories={categories} works={works} selectedCategory={selectedCategory?.slug} />
    </main>
  );
}
