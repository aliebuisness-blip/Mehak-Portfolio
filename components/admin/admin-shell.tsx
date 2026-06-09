import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Mail, FolderKanban, Settings, BriefcaseBusiness } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/admin/sign-out-button";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/website", label: "Website", icon: Settings },
  { href: "/admin/categories", label: "Categories", icon: FolderKanban },
  { href: "/admin/works", label: "Works", icon: BriefcaseBusiness },
  { href: "/admin/messages", label: "Messages", icon: Mail }
];

export async function AdminShell({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#f6f5f1]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-ink/10 bg-white/75 p-5 lg:block">
        <Link href="/admin/dashboard" className="block text-lg font-bold">
          Portfolio CMS
        </Link>
        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition hover:bg-paper hover:text-ink">
                <Icon size={17} aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-5 left-5 right-5">
          <p className="mb-3 truncate text-xs text-ink/45">{user.email}</p>
          <SignOutButton />
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-ink/10 bg-white/80 px-5 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <Link href="/admin/dashboard" className="font-bold">
              Portfolio CMS
            </Link>
            <SignOutButton compact />
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-full bg-paper px-3 py-2 text-xs font-semibold text-ink/70">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
      </div>
    </div>
  );
}
