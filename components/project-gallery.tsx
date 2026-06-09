type ProjectGalleryProps = {
  images: string[];
  title: string;
};

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  if (images.length === 0) return null;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">Gallery</p>
        <h2 className="mt-2 text-3xl font-semibold">Project visuals</h2>
      </div>
      <div className="columns-1 gap-5 md:columns-2 lg:columns-3">
        {images.map((src, index) => (
          <figure key={`${src}-${index}`} className="mb-5 break-inside-avoid overflow-hidden rounded-lg bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft">
            <img src={src} alt={`${title} gallery image ${index + 1}`} className="h-auto w-full rounded-lg" loading="lazy" />
          </figure>
        ))}
      </div>
    </section>
  );
}
