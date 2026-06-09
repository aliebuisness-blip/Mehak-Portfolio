import { AdminShell } from "@/components/admin/admin-shell";
import { WorksManager } from "@/components/admin/WorksManager";
import { getAdminCategories, getAdminWorks } from "@/lib/data";

export default async function WorksPage() {
  const [categories, works] = await Promise.all([getAdminCategories(), getAdminWorks()]);

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">CMS</p>
          <h1 className="mt-2 text-4xl font-semibold">Work/projects</h1>
        </div>
        <WorksManager categories={categories} initialWorks={works} />
      </div>
    </AdminShell>
  );
}
