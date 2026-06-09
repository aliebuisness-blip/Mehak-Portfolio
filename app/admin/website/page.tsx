import { AdminShell } from "@/components/admin/admin-shell";
import { WebsiteForm } from "@/components/admin/website-form";
import { getWebsiteInfo } from "@/lib/data";

export default async function WebsitePage() {
  const info = await getWebsiteInfo();

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">CMS</p>
          <h1 className="mt-2 text-4xl font-semibold">Website info</h1>
        </div>
        <WebsiteForm info={info} />
      </div>
    </AdminShell>
  );
}
