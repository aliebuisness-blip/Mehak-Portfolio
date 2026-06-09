"use client";

import { FormEvent, useState } from "react";
import { Edit, ImageIcon, Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminModal, ConfirmModal } from "@/components/admin/modal";
import { inputClass, labelClass, slugify } from "@/components/admin/form-fields";
import { uploadPortfolioImage } from "@/components/admin/upload";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/types";

type DraftCategory = Partial<Category> & { slugTouched?: boolean };

const emptyCategory: DraftCategory = {
  title: "",
  slug: "",
  description: "",
  thumbnail_url: "",
  show_on_home: false,
  display_order: 0,
  status: "active",
  slugTouched: false
};

export function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingCategory, setEditingCategory] = useState<DraftCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function openAddModal() {
    setStatus("");
    setEditingCategory({ ...emptyCategory });
  }

  function openEditModal(category: Category) {
    setStatus("");
    setEditingCategory({ ...category, slugTouched: true });
  }

  function updateDraft(patch: DraftCategory) {
    setEditingCategory((item) => (item ? { ...item, ...patch } : item));
  }

  function closeModal() {
    if (!saving) setEditingCategory(null);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingCategory || saving) return;

    setSaving(true);
    setStatus("Saving category...");
    const file = (new FormData(event.currentTarget).get("thumbnail") as File | null) ?? null;
    let thumbnailUrl = editingCategory.thumbnail_url || "";

    try {
      const slug = slugify(editingCategory.slug || editingCategory.title || "");
      if (!editingCategory.title?.trim() || !slug) {
        setStatus("Please add a title and slug before saving.");
        return;
      }

      if (file?.size) {
        thumbnailUrl = await uploadPortfolioImage(file, "categories");
        updateDraft({ thumbnail_url: thumbnailUrl });
      }

      const payload = {
        title: editingCategory.title.trim(),
        slug,
        description: editingCategory.description || "",
        thumbnail_url: thumbnailUrl,
        show_on_home: Boolean(editingCategory.show_on_home),
        display_order: Number(editingCategory.display_order || 0),
        status: editingCategory.status || "active",
        updated_at: new Date().toISOString()
      };
      const supabase = createSupabaseBrowserClient();
      const result = editingCategory.id
        ? await supabase.from("categories").update(payload).eq("id", editingCategory.id).select("*").single()
        : await supabase.from("categories").insert(payload).select("*").single();

      if (result.error) {
        console.error("Supabase category save error:", result.error);
        setStatus(result.error.message);
        return;
      }

      const savedCategory = result.data as Category;
      setCategories((items) =>
        editingCategory.id ? items.map((category) => (category.id === savedCategory.id ? savedCategory : category)) : [savedCategory, ...items]
      );
      setStatus("Category saved.");
      setEditingCategory(null);
      router.refresh();
    } catch (error) {
      console.error("Category save failed:", error);
      setStatus(error instanceof Error ? error.message : "Could not save category.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget || deleting) return;

    setDeleting(true);
    setStatus("Deleting category...");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("categories").delete().eq("id", deleteTarget.id);

    if (error) {
      console.error("Supabase category delete error:", error);
      setStatus(error.message);
      setDeleting(false);
      return;
    }

    setCategories((items) => items.filter((category) => category.id !== deleteTarget.id));
    setStatus("Category deleted.");
    setDeleteTarget(null);
    setDeleting(false);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button className="focus-ring inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-moss" onClick={openAddModal} type="button">
          <Plus size={16} aria-hidden />
          Add category
        </button>
        {status ? <p className="text-sm font-medium text-ink/60">{status}</p> : null}
      </div>

      {categories.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink/20 bg-white p-10 text-center text-ink/55">No categories added yet.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {categories.map((category) => (
            <article key={category.id} className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
              <div className="aspect-[16/10] bg-skysoft">
                {category.thumbnail_url ? (
                  <img src={category.thumbnail_url} alt={category.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink/35">
                    <ImageIcon size={28} aria-hidden />
                  </div>
                )}
              </div>
              <div className="space-y-3 p-4">
                <div className="flex flex-wrap gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${category.status === "active" ? "bg-moss/10 text-moss" : "bg-ink/10 text-ink/55"}`}>
                    {category.status}
                  </span>
                  {category.show_on_home ? <span className="rounded-full bg-clay/10 px-2.5 py-1 text-xs font-semibold text-clay">Home</span> : null}
                  <span className="rounded-full bg-paper px-2.5 py-1 text-xs font-semibold text-ink/55">Order {category.display_order}</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{category.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-ink/60">{category.description || "No description added."}</p>
                </div>
                <div className="flex gap-2">
                  <button className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-paper px-3 py-2 text-sm font-semibold text-ink/70 transition hover:text-ink" onClick={() => openEditModal(category)} type="button">
                    <Edit size={15} aria-hidden />
                    Edit
                  </button>
                  <button className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-clay/20 px-3 py-2 text-sm font-semibold text-clay" onClick={() => setDeleteTarget(category)} type="button">
                    <Trash2 size={15} aria-hidden />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editingCategory ? (
        <AdminModal title={editingCategory.id ? "Edit category" : "Add category"} onClose={closeModal} maxWidth="max-w-2xl">
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className={labelClass}>
                <span>Title</span>
                <input
                  className={inputClass}
                  value={editingCategory.title ?? ""}
                  onChange={(event) => {
                    const title = event.target.value;
                    updateDraft({ title, slug: editingCategory.slugTouched ? editingCategory.slug : slugify(title) });
                  }}
                />
              </label>
              <label className={labelClass}>
                <span>Slug</span>
                <input className={inputClass} value={editingCategory.slug ?? ""} onChange={(event) => updateDraft({ slug: slugify(event.target.value), slugTouched: true })} />
              </label>
              <label className={`${labelClass} md:col-span-2`}>
                <span>Description</span>
                <textarea className={`${inputClass} min-h-24`} value={editingCategory.description ?? ""} onChange={(event) => updateDraft({ description: event.target.value })} />
              </label>
              <label className={labelClass}>
                <span>Thumbnail upload</span>
                <input className={inputClass} name="thumbnail" type="file" accept="image/*" />
              </label>
              <label className={labelClass}>
                <span>Display order</span>
                <input className={inputClass} type="number" value={editingCategory.display_order ?? 0} onChange={(event) => updateDraft({ display_order: Number(event.target.value) })} />
              </label>
              <label className={labelClass}>
                <span>Status</span>
                <select className={inputClass} value={editingCategory.status ?? "active"} onChange={(event) => updateDraft({ status: event.target.value as Category["status"] })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
              <label className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-ink/75">
                <input type="checkbox" checked={Boolean(editingCategory.show_on_home)} onChange={(event) => updateDraft({ show_on_home: event.target.checked })} />
                Show on Home Page
              </label>
            </div>
            <div className="flex flex-wrap justify-end gap-2 border-t border-ink/10 pt-4">
              <button className="focus-ring rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink/70 transition hover:text-ink" onClick={closeModal} type="button">
                Cancel
              </button>
              <button className="focus-ring inline-flex items-center gap-2 rounded-full bg-moss px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={saving} type="submit">
                <Save size={16} aria-hidden />
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </AdminModal>
      ) : null}

      {deleteTarget ? <ConfirmModal loading={deleting} onCancel={() => (deleting ? null : setDeleteTarget(null))} onConfirm={confirmDelete} /> : null}
    </div>
  );
}
