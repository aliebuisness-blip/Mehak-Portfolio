"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignOutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button className="focus-ring inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink/70 transition hover:text-ink" onClick={signOut} type="button">
      <LogOut size={16} aria-hidden />
      {compact ? "Exit" : "Sign out"}
    </button>
  );
}
