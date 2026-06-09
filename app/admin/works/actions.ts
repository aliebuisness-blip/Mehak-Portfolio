"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

type SlugCheckResult = {
  exists: boolean;
  error?: string;
};

export async function checkWorkSlugExists(slug: string, currentWorkId?: string): Promise<SlugCheckResult> {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) {
    return { exists: false };
  }

  const supabase = await createSupabaseServerClient();
  let query = supabase.from("works").select("id").eq("slug", normalizedSlug).limit(1);

  if (currentWorkId) {
    query = query.neq("id", currentWorkId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Could not check work slug uniqueness:", error);
    return { exists: false, error: error.message };
  }

  return { exists: Boolean(data?.length) };
}
