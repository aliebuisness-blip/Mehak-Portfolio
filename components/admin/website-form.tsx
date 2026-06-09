"use client";

import { FormEvent, useState } from "react";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { WebsiteInfo } from "@/lib/types";
import { inputClass, labelClass, panelClass } from "@/components/admin/form-fields";

export function WebsiteForm({ info }: { info: WebsiteInfo }) {
  const router = useRouter();
  const [status, setStatus] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving...");
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("website_info").upsert({ id: 1, ...payload, updated_at: new Date().toISOString() });
    setStatus(error ? error.message : "Saved.");
    if (!error) router.refresh();
  }

  const fields: Array<[keyof WebsiteInfo, string, "input" | "textarea"]> = [
    ["portfolio_name", "Portfolio name", "input"],
    ["intro_line", "Intro line", "input"],
    ["main_title", "Main title", "input"],
    ["description", "Description", "textarea"],
    ["primary_button_text", "Primary button text", "input"],
    ["secondary_button_text", "Secondary button text", "input"],
    ["email", "Email", "input"],
    ["phone", "Phone / WhatsApp", "input"],
    ["instagram", "Instagram", "input"],
    ["behance", "Behance", "input"],
    ["linkedin", "LinkedIn", "input"],
    ["footer_text", "Footer text", "input"]
  ];

  return (
    <form onSubmit={onSubmit} className={`${panelClass} space-y-5`}>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map(([name, label, type]) => (
          <label key={name} className={`${labelClass} ${type === "textarea" ? "md:col-span-2" : ""}`}>
            <span>{label}</span>
            {type === "textarea" ? (
              <textarea className={`${inputClass} min-h-32`} name={name} defaultValue={String(info[name] ?? "")} />
            ) : (
              <input className={inputClass} name={name} defaultValue={String(info[name] ?? "")} />
            )}
          </label>
        ))}
      </div>
      <button className="focus-ring inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-moss" type="submit">
        <Save size={16} aria-hidden />
        Save website info
      </button>
      {status ? <p className="text-sm font-medium text-ink/60">{status}</p> : null}
    </form>
  );
}
