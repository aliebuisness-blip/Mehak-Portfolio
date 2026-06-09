import { CategoryCard } from "@/components/category-card";
import { ButtonLink } from "@/components/button-link";
import { getHomeCategories, getWebsiteInfo } from "@/lib/data";

export default async function HomePage() {
  const [info, categories] = await Promise.all([getWebsiteInfo(), getHomeCategories()]);

  return (
    <main>
      <section className="mx-auto grid min-h-[78vh] max-w-6xl content-center px-5 py-20">
        <div className="max-w-4xl space-y-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-clay">{info.intro_line}</p>
          <h1 className="font-serif text-5xl font-semibold leading-tight md:text-7xl">{info.main_title}</h1>
          <p className="max-w-2xl text-lg leading-8 text-ink/70">{info.description}</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/work">{info.primary_button_text || "View Work"}</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              {info.secondary_button_text || "Contact"}
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">Featured Categories</p>
            <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Work organized by focus.</h2>
          </div>
        </div>
        {categories.length === 0 ? (
          <div className="rounded-lg border border-dashed border-ink/20 bg-white/50 p-10 text-center text-ink/60">No featured categories yet.</div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="rounded-lg bg-ink p-8 text-white md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">Start a Conversation</p>
          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-2xl text-3xl font-semibold md:text-5xl">Have a project that needs a thoughtful creative partner?</h2>
            <ButtonLink href="/contact" variant="secondary">
              Contact
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
