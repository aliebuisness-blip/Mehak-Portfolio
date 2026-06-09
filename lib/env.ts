export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    const cwd = typeof process.cwd === "function" ? process.cwd() : "Unavailable in browser runtime";

    throw new Error(
      [
        "Supabase environment configuration is incomplete.",
        `Current working directory: ${cwd}`,
        `NEXT_PUBLIC_SUPABASE_URL exists: ${Boolean(url)}`,
        `NEXT_PUBLIC_SUPABASE_ANON_KEY exists: ${Boolean(anonKey)}`,
        "Create .env.local in the same folder as package.json, add the Supabase Project URL and anon public key, then restart npm run dev."
      ].join("\n")
    );
  }

  return { url, anonKey };
}
