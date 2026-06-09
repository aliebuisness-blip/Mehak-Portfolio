import Link from "next/link";
import { WebsiteInfo } from "@/lib/types";

export function Footer({ info }: { info: WebsiteInfo }) {
  const links = [
    ["Email", info.email ? `mailto:${info.email}` : ""],
    ["Instagram", info.instagram],
    ["Behance", info.behance],
    ["LinkedIn", info.linkedin]
  ].filter(([, href]) => href);

  return (
    <footer className="border-t border-ink/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-8 text-sm text-ink/65 md:flex-row md:items-center md:justify-between">
        <p>{info.footer_text || `© ${new Date().getFullYear()} ${info.portfolio_name}`}</p>
        <div className="flex flex-wrap gap-4">
          {links.map(([label, href]) => (
            <Link key={label} href={href} className="hover:text-ink" target={href.startsWith("http") ? "_blank" : undefined}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
