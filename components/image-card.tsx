import Image from "next/image";
import { ImageIcon } from "lucide-react";

type ImageCardProps = {
  src?: string | null;
  alt: string;
  className?: string;
};

export function ImageCard({ src, alt, className = "" }: ImageCardProps) {
  return (
    <div className={`relative aspect-[4/3] overflow-hidden rounded-lg bg-skysoft ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
      ) : (
        <div className="flex h-full items-center justify-center text-ink/35">
          <ImageIcon size={32} aria-hidden />
        </div>
      )}
    </div>
  );
}
