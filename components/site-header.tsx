import Link from "next/link";

type SiteHeaderProps = {
  name: string;
};

export function SiteHeader({ name }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-semibold tracking-wide">
          {name}
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium text-ink/70">
          {[
            ["Home", "/"],
            ["Work", "/work"],
            ["Contact", "/contact"]
          ].map(([label, href]) => (
            <Link key={href} href={href} className="rounded-full px-4 py-2 transition hover:bg-white hover:text-ink">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
