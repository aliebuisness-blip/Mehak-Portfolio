import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Category, ContactMessage, emptyWebsiteInfo, WebsiteInfo, Work } from "@/lib/types";

export async function getWebsiteInfo(): Promise<WebsiteInfo> {
  noStore();
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("website_info").select("*").eq("id", 1).maybeSingle();
  return (data as WebsiteInfo | null) ?? ({ id: 1, created_at: "", updated_at: "", ...emptyWebsiteInfo } satisfies WebsiteInfo);
}

export async function getPublicCategories(): Promise<Category[]> {
  noStore();
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("status", "active")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (data ?? []) as Category[];
}

export async function getHomeCategories(): Promise<Category[]> {
  const categories = await getPublicCategories();
  return categories.filter((category) => category.show_on_home);
}

export async function getPublishedWorks(): Promise<Work[]> {
  noStore();
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("works")
    .select("*, categories(id,title,slug)")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (data ?? []) as Work[];
}

export async function getPublishedWorkBySlug(slug: string): Promise<Work | null> {
  noStore();
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("works")
    .select("*, categories(id,title,slug)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  return (data as Work | null) ?? null;
}

export async function getAdminCategories(): Promise<Category[]> {
  noStore();
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("categories").select("*").order("display_order", { ascending: true });
  return (data ?? []) as Category[];
}

export async function getAdminWorks(): Promise<Work[]> {
  noStore();
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("works").select("*, categories(id,title,slug)").order("created_at", { ascending: false });
  return (data ?? []) as Work[];
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  noStore();
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
  return (data ?? []) as ContactMessage[];
}
