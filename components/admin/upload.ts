"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export const unsupportedImageMessage = "HEIC images are not supported on the website. Please convert the image to JPG, PNG, or WEBP before uploading.";

const allowedMimeTypes = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const allowedExtensions = new Set(["jpg", "jpeg", "png", "webp"]);
const blockedExtensions = new Set(["heic", "heif"]);

export function isSupportedPortfolioImage(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (blockedExtensions.has(extension) || file.type === "image/heic" || file.type === "image/heif") {
    return false;
  }

  return allowedMimeTypes.has(file.type) && allowedExtensions.has(extension);
}

export function validatePortfolioImage(file: File) {
  if (!isSupportedPortfolioImage(file)) {
    throw new Error(unsupportedImageMessage);
  }
}

export async function uploadPortfolioImage(file: File, folder: "categories" | "works" | "gallery") {
  validatePortfolioImage(file);

  const supabase = createSupabaseBrowserClient();
  const extension = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("portfolio-media").upload(path, file, { upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from("portfolio-media").getPublicUrl(path);
  return data.publicUrl;
}
