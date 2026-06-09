"use client";

import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ContactMessage } from "@/lib/types";

export function MessagesManager({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter();
  const [status, setStatus] = useState("");

  async function markRead(id: string) {
    setStatus("Updating message...");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("contact_messages").update({ status: "read" }).eq("id", id);
    setStatus(error ? error.message : "Marked as read.");
    if (!error) router.refresh();
  }

  async function remove(id: string) {
    setStatus("Deleting message...");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    setStatus(error ? error.message : "Message deleted.");
    if (!error) router.refresh();
  }

  if (messages.length === 0) {
    return <div className="rounded-lg border border-dashed border-ink/20 bg-white p-10 text-center text-ink/55">No contact messages yet.</div>;
  }

  return (
    <div className="space-y-4">
      {status ? <p className="text-sm font-medium text-ink/60">{status}</p> : null}
      {messages.map((message) => (
        <article key={message.id} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold">{message.subject}</h2>
                <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-ink/60">{message.status}</span>
              </div>
              <p className="mt-2 text-sm text-ink/55">{message.name} · {message.email} · {message.phone}</p>
              <p className="mt-1 text-xs text-ink/40">{new Date(message.created_at).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <button className="focus-ring inline-flex items-center gap-2 rounded-full bg-moss px-4 py-2 text-sm font-semibold text-white" onClick={() => markRead(message.id)} type="button">
                <Check size={16} aria-hidden />
                Read
              </button>
              <button className="focus-ring inline-flex items-center gap-2 rounded-full border border-clay/25 px-4 py-2 text-sm font-semibold text-clay" onClick={() => remove(message.id)} type="button">
                <Trash2 size={16} aria-hidden />
                Delete
              </button>
            </div>
          </div>
          <p className="mt-5 whitespace-pre-wrap rounded-lg bg-paper p-4 text-sm leading-6 text-ink/70">{message.message}</p>
        </article>
      ))}
    </div>
  );
}
