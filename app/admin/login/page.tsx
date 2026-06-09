"use client";

import { FormEvent, useState } from "react";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const supabase = createSupabaseBrowserClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,#dce8ed_0,#f7f4ee_38%,#f7f4ee_100%)] px-5">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-lg border border-ink/10 bg-white/75 p-6 shadow-soft">
        <div className="mb-6">
          <div className="mb-4 inline-flex rounded-full bg-paper p-3 text-moss">
            <Lock size={22} aria-hidden />
          </div>
          <h1 className="text-3xl font-semibold">Admin login</h1>
          <p className="mt-2 text-sm text-ink/60">Sign in with the Supabase admin user.</p>
        </div>
        <div className="space-y-4">
          <input className="focus-ring w-full rounded-lg border border-ink/10 px-4 py-3 text-sm" name="email" placeholder="Email" type="email" />
          <input className="focus-ring w-full rounded-lg border border-ink/10 px-4 py-3 text-sm" name="password" placeholder="Password" type="password" />
          <button className="focus-ring w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-moss" disabled={loading} type="submit">
            {loading ? "Signing in..." : "Sign in"}
          </button>
          {error ? <p className="text-sm font-medium text-clay">{error}</p> : null}
        </div>
      </form>
    </main>
  );
}
