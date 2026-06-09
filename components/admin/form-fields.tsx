export const inputClass = "focus-ring w-full rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm";
export const labelClass = "space-y-2 text-sm font-semibold text-ink/75";
export const panelClass = "rounded-lg border border-ink/10 bg-white p-5 shadow-sm";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
