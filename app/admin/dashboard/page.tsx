import { MailOpen } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminCategories, getAdminWorks, getContactMessages } from "@/lib/data";

export default async function DashboardPage() {
  const [categories, works, messages] = await Promise.all([getAdminCategories(), getAdminWorks(), getContactMessages()]);
  const cards = [
    ["Total categories", categories.length],
    ["Total work/projects", works.length],
    ["Featured home categories", categories.filter((category) => category.show_on_home).length],
    ["Contact messages", messages.length]
  ];

  return (
    <AdminShell>
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">Admin</p>
        <h1 className="mt-2 text-4xl font-semibold">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <p className="text-sm text-ink/55">{label}</p>
            <p className="mt-3 text-4xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
      <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <MailOpen size={18} aria-hidden />
          <h2 className="text-xl font-semibold">Recent messages</h2>
        </div>
        {messages.length === 0 ? (
          <p className="text-sm text-ink/55">No messages yet.</p>
        ) : (
          <div className="space-y-3">
            {messages.slice(0, 5).map((message) => (
              <div key={message.id} className="rounded-lg bg-paper p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{message.subject}</p>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink/60">{message.status}</span>
                </div>
                <p className="mt-1 text-sm text-ink/60">{message.name} · {message.email}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
    </AdminShell>
  );
}
