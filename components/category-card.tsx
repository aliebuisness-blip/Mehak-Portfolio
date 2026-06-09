import { Category } from "@/lib/types";
import { ButtonLink } from "@/components/button-link";
import { ImageCard } from "@/components/image-card";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <article className="group rounded-lg border border-ink/10 bg-white/55 p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <ImageCard src={category.thumbnail_url} alt={category.title} />
      <div className="space-y-4 p-3">
        <div>
          <h3 className="text-xl font-semibold">{category.title}</h3>
          <p className="mt-2 text-sm leading-6 text-ink/65">{category.description}</p>
        </div>
        <ButtonLink href={`/work?category=${category.slug}`} variant="secondary">
          View Work
        </ButtonLink>
      </div>
    </article>
  );
}
