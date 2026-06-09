"use client";

import { FormEvent, useState } from "react";
import { Edit, ImageIcon, ImagePlus, Plus, Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminModal, ConfirmModal } from "@/components/admin/modal";
import { inputClass, labelClass, slugify } from "@/components/admin/form-fields";
import { uploadPortfolioImage } from "@/components/admin/upload";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Category, Work } from "@/lib/types";

type DraftWork = Partial<Work> & { slugTouched?: boolean };
type PendingGalleryFile = { file: File; previewUrl: string };

const emptyWork: DraftWork = {
  title: "",
  slug: "",
  category_id: "",
  short_description: "",
  full_description: "",
  thumbnail_url: "",
  gallery_images: [],
  tools: [],
  client_name: "",
  project_link: "",
  status: "draft",
  slugTouched: false
};

type WorksManagerProps = {
  initialWorks: Work[];
  categories: Category[];
};

export function WorksManager({ initialWorks, categories }: WorksManagerProps) {
  const router = useRouter();
  const [works, setWorks] = useState<Work[]>(initialWorks);
  const [editingWork, setEditingWork] = useState<DraftWork | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Work | null>(null);
  const [pendingGalleryFiles, setPendingGalleryFiles] = useState<PendingGalleryFile[]>([]);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function categoryName(categoryId?: string | null) {
    return categories.find((category) => category.id === categoryId)?.title ?? "Uncategorized";
  }

  function openAddModal() {
    setStatus("");
    setPendingGalleryFiles([]);
    setEditingWork({ ...emptyWork, category_id: categories[0]?.id ?? "" });
  }

  function openEditModal(work: Work) {
    setStatus("");
    setPendingGalleryFiles([]);
    setEditingWork({ ...work, gallery_images: work.gallery_images ?? [], slugTouched: true });
  }

  function updateDraft(patch: DraftWork) {
    setEditingWork((item) => (item ? { ...item, ...patch } : item));
  }

  function closeModal() {
    if (saving) return;
    pendingGalleryFiles.forEach((galleryFile) => URL.revokeObjectURL(galleryFile.previewUrl));
    setPendingGalleryFiles([]);
    setEditingWork(null);
  }

  function getErrorMessage(error: unknown) {
    if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
      return error.message;
    }

    return "Could not save work. Please check the form and try again.";
  }

  function addPendingGalleryFiles(files: FileList | null) {
    if (!files?.length) return;

    const previews = Array.from(files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));

    setPendingGalleryFiles((items) => [...items, ...previews]);
  }

  function removePendingGalleryFile(previewUrl: string) {
    setPendingGalleryFiles((items) => {
      const nextFiles = items.filter((item) => item.previewUrl !== previewUrl);
      URL.revokeObjectURL(previewUrl);
      return nextFiles;
    });
  }

  function removeSavedGalleryImage(imageUrl: string) {
    if (!editingWork) return;
    updateDraft({ gallery_images: (editingWork.gallery_images ?? []).filter((url) => url !== imageUrl) });
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingWork || saving) return;

    setStatus("Saving work...");
    setSaving(true);
    const file = (new FormData(event.currentTarget).get("thumbnail") as File | null) ?? null;
    let thumbnailUrl = editingWork.thumbnail_url || "";
    let galleryImages = [...(editingWork.gallery_images ?? [])];
    const slug = slugify(editingWork.slug || editingWork.title || "");
    const categoryId = editingWork.category_id || categories[0]?.id || "";
    const selectedCategory = categories.find((category) => category.id === categoryId);

    try {
      if (!slug || !editingWork.title?.trim()) {
        setStatus("Please add a title and slug before saving.");
        return;
      }

      if (!selectedCategory) {
        setStatus("Please select a valid category before saving.");
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const duplicateQuery = supabase.from("works").select("id").eq("slug", slug).limit(1);
      const { data: duplicateWorks, error: duplicateError } = editingWork.id ? await duplicateQuery.neq("id", editingWork.id) : await duplicateQuery;

      if (duplicateError) {
        console.error("Could not check work slug uniqueness:", duplicateError);
        setStatus(duplicateError.message);
        return;
      }

      if (duplicateWorks && duplicateWorks.length > 0) {
        setStatus("This slug already exists. Please use another slug.");
        return;
      }

      if (file?.size) {
        thumbnailUrl = await uploadPortfolioImage(file, "works");
        updateDraft({ thumbnail_url: thumbnailUrl });
      }

      if (pendingGalleryFiles.length > 0) {
        const uploadedGalleryUrls = await Promise.all(pendingGalleryFiles.map((galleryFile) => uploadPortfolioImage(galleryFile.file, "gallery")));
        galleryImages = [...galleryImages, ...uploadedGalleryUrls];
        pendingGalleryFiles.forEach((galleryFile) => URL.revokeObjectURL(galleryFile.previewUrl));
        setPendingGalleryFiles([]);
        updateDraft({ gallery_images: galleryImages });
      }

      const payload = {
        title: editingWork.title.trim(),
        slug,
        category_id: selectedCategory.id,
        short_description: editingWork.short_description || "",
        full_description: editingWork.full_description || "",
        thumbnail_url: thumbnailUrl,
        gallery_images: galleryImages,
        tools: Array.isArray(editingWork.tools) ? editingWork.tools : [],
        client_name: editingWork.client_name || null,
        project_link: editingWork.project_link || null,
        status: editingWork.status || "draft",
        updated_at: new Date().toISOString()
      };
      const result = editingWork.id
        ? await supabase.from("works").update(payload).eq("id", editingWork.id).select("*, categories(id,title,slug)").single()
        : await supabase.from("works").insert(payload).select("*, categories(id,title,slug)").single();
      const { data: savedWork, error } = result;

      if (error) {
        console.error("Supabase work save error:", error);
        setStatus(error.message);
        return;
      }

      const normalizedSavedWork = savedWork as Work;
      setWorks((items) =>
        editingWork.id ? items.map((work) => (work.id === normalizedSavedWork.id ? normalizedSavedWork : work)) : [normalizedSavedWork, ...items]
      );
      setStatus("Work saved.");
      setEditingWork(null);
      router.refresh();
    } catch (error) {
      console.error("Work save failed:", error);
      setStatus(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget || deleting) return;

    setDeleting(true);
    setStatus("Deleting work...");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("works").delete().eq("id", deleteTarget.id);

    if (error) {
      console.error("Supabase work delete error:", error);
      setStatus(error.message);
      setDeleting(false);
      return;
    }

    setWorks((items) => items.filter((work) => work.id !== deleteTarget.id));
    setStatus("Work deleted.");
    setDeleteTarget(null);
    setDeleting(false);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          className="focus-ring inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-moss disabled:cursor-not-allowed disabled:opacity-60"
          onClick={openAddModal}
          disabled={categories.length === 0}
          type="button"
        >
          <Plus size={16} aria-hidden />
          Add work
        </button>
        {status ? <p className="text-sm font-medium text-ink/60">{status}</p> : null}
      </div>

      {categories.length === 0 ? <p className="rounded-lg bg-white p-4 text-sm text-clay">Add at least one category before creating work.</p> : null}

      {works.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink/20 bg-white p-10 text-center text-ink/55">No work/projects added yet.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {works.map((work) => (
            <article key={work.id} className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
              <div className="aspect-[16/10] bg-skysoft">
                {work.thumbnail_url ? (
                  <img src={work.thumbnail_url} alt={work.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink/35">
                    <ImageIcon size={28} aria-hidden />
                  </div>
                )}
              </div>
              <div className="space-y-3 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${work.status === "published" ? "bg-moss/10 text-moss" : "bg-ink/10 text-ink/55"}`}>
                    {work.status}
                  </span>
                  <span className="rounded-full bg-paper px-2.5 py-1 text-xs font-semibold text-ink/55">{categoryName(work.category_id)}</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{work.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-ink/60">{work.short_description || "No short description added."}</p>
                </div>
                {work.tools?.length ? <p className="truncate text-xs font-semibold text-ink/45">{work.tools.join(" / ")}</p> : null}
                <div className="flex gap-2">
                  <button className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-paper px-3 py-2 text-sm font-semibold text-ink/70 transition hover:text-ink" onClick={() => openEditModal(work)} type="button">
                    <Edit size={15} aria-hidden />
                    Edit
                  </button>
                  <button className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-clay/20 px-3 py-2 text-sm font-semibold text-clay" onClick={() => setDeleteTarget(work)} type="button">
                    <Trash2 size={15} aria-hidden />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editingWork ? (
        <AdminModal title={editingWork.id ? "Edit work/project" : "Add work/project"} onClose={closeModal} maxWidth="max-w-4xl">
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className={labelClass}>
                <span>Title</span>
                <input
                  className={inputClass}
                  value={editingWork.title ?? ""}
                  onChange={(event) => {
                    const title = event.target.value;
                    updateDraft({ title, slug: editingWork.slugTouched ? editingWork.slug : slugify(title) });
                  }}
                />
              </label>
              <label className={labelClass}>
                <span>Slug</span>
                <input className={inputClass} value={editingWork.slug ?? ""} onChange={(event) => updateDraft({ slug: slugify(event.target.value), slugTouched: true })} />
              </label>
              <label className={labelClass}>
                <span>Category</span>
                <select className={inputClass} value={editingWork.category_id ?? ""} onChange={(event) => updateDraft({ category_id: event.target.value })}>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                <span>Status</span>
                <select className={inputClass} value={editingWork.status ?? "draft"} onChange={(event) => updateDraft({ status: event.target.value as Work["status"] })}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
              <label className={`${labelClass} md:col-span-2`}>
                <span>Short description</span>
                <textarea className={`${inputClass} min-h-20`} value={editingWork.short_description ?? ""} onChange={(event) => updateDraft({ short_description: event.target.value })} />
              </label>
              <label className={`${labelClass} md:col-span-2`}>
                <span>Full description</span>
                <textarea className={`${inputClass} min-h-28`} value={editingWork.full_description ?? ""} onChange={(event) => updateDraft({ full_description: event.target.value })} />
              </label>
              <label className={labelClass}>
                <span>Tools used</span>
                <input className={inputClass} value={(editingWork.tools ?? []).join(", ")} onChange={(event) => updateDraft({ tools: event.target.value.split(",").map((tool) => tool.trim()).filter(Boolean) })} />
              </label>
              <label className={labelClass}>
                <span>Thumbnail upload</span>
                <input className={inputClass} name="thumbnail" type="file" accept="image/*" />
              </label>
              <label className={labelClass}>
                <span>Client name</span>
                <input className={inputClass} value={editingWork.client_name ?? ""} onChange={(event) => updateDraft({ client_name: event.target.value })} />
              </label>
              <label className={labelClass}>
                <span>Project link</span>
                <input className={inputClass} value={editingWork.project_link ?? ""} onChange={(event) => updateDraft({ project_link: event.target.value })} />
              </label>
              <div className="space-y-3 md:col-span-2">
                <label className={labelClass}>
                  <span>Gallery images</span>
                  <input className={inputClass} type="file" accept="image/*" multiple onChange={(event) => addPendingGalleryFiles(event.target.files)} />
                </label>
                {(editingWork.gallery_images?.length || pendingGalleryFiles.length) ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {(editingWork.gallery_images ?? []).map((imageUrl) => (
                      <div key={imageUrl} className="relative overflow-hidden rounded-lg border border-ink/10 bg-white p-2">
                        <img src={imageUrl} alt={`${editingWork.title ?? "Work"} gallery`} className="h-auto w-full rounded-md" />
                        <button className="focus-ring absolute right-3 top-3 inline-flex rounded-full bg-white/90 p-2 text-clay shadow-sm" onClick={() => removeSavedGalleryImage(imageUrl)} type="button" aria-label="Remove saved gallery image">
                          <X size={14} aria-hidden />
                        </button>
                      </div>
                    ))}
                    {pendingGalleryFiles.map((galleryFile) => (
                      <div key={galleryFile.previewUrl} className="relative overflow-hidden rounded-lg border border-dashed border-moss/30 bg-white p-2">
                        <img src={galleryFile.previewUrl} alt="Pending gallery preview" className="h-auto w-full rounded-md" />
                        <button className="focus-ring absolute right-3 top-3 inline-flex rounded-full bg-white/90 p-2 text-clay shadow-sm" onClick={() => removePendingGalleryFile(galleryFile.previewUrl)} type="button" aria-label="Remove pending gallery image">
                          <X size={14} aria-hidden />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-lg border border-dashed border-ink/15 bg-white p-4 text-sm text-ink/55">
                    <ImagePlus size={17} aria-hidden />
                    No gallery images added yet.
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-2 border-t border-ink/10 pt-4">
              <button className="focus-ring rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink/70 transition hover:text-ink" onClick={closeModal} type="button">
                Cancel
              </button>
              <button className="focus-ring inline-flex items-center gap-2 rounded-full bg-moss px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={saving || categories.length === 0} type="submit">
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
