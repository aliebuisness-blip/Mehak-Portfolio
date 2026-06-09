import { AdminShell } from "@/components/admin/admin-shell";
import { MessagesManager } from "@/components/admin/messages-manager";
import { getContactMessages } from "@/lib/data";

export default async function MessagesPage() {
  const messages = await getContactMessages();

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">Inbox</p>
          <h1 className="mt-2 text-4xl font-semibold">Contact messages</h1>
        </div>
        <MessagesManager messages={messages} />
      </div>
    </AdminShell>
  );
}
