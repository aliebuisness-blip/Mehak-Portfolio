import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ImageIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button-link";
import { ProjectGallery } from "@/components/project-gallery";
import { getPublishedWorkBySlug } from "@/lib/data";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = await getPublishedWorkBySlug(slug);

  if (!work) notFound();

  const galleryImages = work.gallery_images?.length ? work.gallery_images : [];

  return (
    <main className="mx-auto max-w-6xl space-y-12 px-5 py-12">
      <Link href="/work" className="focus-ring inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-sm font-semibold text-ink/70 transition hover:text-ink">
        <ArrowLeft size={16} aria-hidden />
        Back to Work
      </Link>

      <section className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">{work.categories?.title ?? "Uncategorized"}</p>
          <h1 className="font-serif text-5xl font-semibold leading-tight md:text-7xl">{work.title}</h1>
          <p className="text-lg leading-8 text-ink/70">{work.short_description}</p>
          <div className="flex flex-wrap gap-3">
            {work.project_link ? (
              <ButtonLink href={work.project_link} variant="primary">
                <span className="inline-flex items-center gap-2">
                  Project link
                  <ExternalLink size={15} aria-hidden />
                </span>
              </ButtonLink>
            ) : null}
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-skysoft shadow-soft">
          {work.thumbnail_url ? (
            <Image src={work.thumbnail_url} alt={work.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
          ) : (
            <div className="flex h-full items-center justify-center text-ink/35">
              <ImageIcon size={42} aria-hidden />
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-8 border-y border-ink/10 py-10 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="space-y-5">
          {work.client_name ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/40">Client</p>
              <p className="mt-2 font-semibold">{work.client_name}</p>
            </div>
          ) : null}
          {work.tools?.length ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/40">Tools</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {work.tools.map((tool) => (
                  <span key={tool} className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-ink/65">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold">Overview</h2>
          <p className="whitespace-pre-wrap text-base leading-8 text-ink/70">{work.full_description || work.short_description}</p>
        </div>
      </section>

      <ProjectGallery images={galleryImages} title={work.title} />
    </main>
  );
}
