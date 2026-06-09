"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export async function uploadPortfolioImage(file: File, folder: "categories" | "works" | "gallery") {
  const supabase = createSupabaseBrowserClient();
  const extension = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("portfolio-media").upload(path, file, { upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from("portfolio-media").getPublicUrl(path);
  return data.publicUrl;
}
