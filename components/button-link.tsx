import Link from "next/link";
import { ArrowRight } from "lucide-react";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

export function ButtonLink({ href, children, variant = "primary" }: ButtonLinkProps) {
  const classes =
    variant === "primary"
      ? "bg-ink text-white hover:bg-moss"
      : "border border-ink/15 bg-white/50 text-ink hover:border-moss hover:text-moss";

  return (
    <Link className={`focus-ring inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${classes}`} href={href}>
      {children}
      <ArrowRight size={16} aria-hidden />
    </Link>
  );
}
