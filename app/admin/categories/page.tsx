import { AdminShell } from "@/components/admin/admin-shell";
import { CategoryManager } from "@/components/admin/category-manager";
import { getAdminCategories } from "@/lib/data";

export default async function CategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">CMS</p>
          <h1 className="mt-2 text-4xl font-semibold">Categories</h1>
        </div>
        <CategoryManager initialCategories={categories} />
      </div>
    </AdminShell>
  );
}
