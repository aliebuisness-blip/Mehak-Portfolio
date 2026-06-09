"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { z } from "zod";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  subject: z.string().min(3),
  message: z.string().min(10)
});

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const parsed = contactSchema.safeParse(payload);

    if (!parsed.success) {
      setStatus("error");
      setError("Please complete all fields with valid details.");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const { error: insertError } = await supabase.from("contact_messages").insert(parsed.data);

    if (insertError) {
      setStatus("error");
      setError(insertError.message);
      return;
    }

    event.currentTarget.reset();
    setStatus("success");
  }

  const inputClass = "focus-ring w-full rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm";

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-ink/10 bg-white/65 p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <input className={inputClass} name="name" placeholder="Name" />
        <input className={inputClass} name="email" placeholder="Email" type="email" />
        <input className={inputClass} name="phone" placeholder="Phone / WhatsApp" />
        <input className={inputClass} name="subject" placeholder="Subject" />
      </div>
      <textarea className={`${inputClass} min-h-36 resize-y`} name="message" placeholder="Message" />
      <button className="focus-ring inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-moss" disabled={status === "loading"} type="submit">
        <Send size={16} aria-hidden />
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
      {status === "success" ? <p className="text-sm font-medium text-moss">Message sent successfully.</p> : null}
      {status === "error" ? <p className="text-sm font-medium text-clay">{error}</p> : null}
    </form>
  );
}
