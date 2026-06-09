import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { getWebsiteInfo } from "@/lib/data";

export default async function ContactPage() {
  const info = await getWebsiteInfo();
  const socials = [
    ["Instagram", info.instagram],
    ["Behance", info.behance],
    ["LinkedIn", info.linkedin]
  ].filter(([, href]) => href);

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[0.85fr_1.15fr]">
      <section className="space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">Contact</p>
        <h1 className="font-serif text-5xl font-semibold md:text-6xl">Let&apos;s talk about the work.</h1>
        <p className="text-lg leading-8 text-ink/70">Send a note with a few details and it will be saved in the admin message inbox.</p>
        <div className="space-y-3 text-sm text-ink/70">
          {info.email ? <p>Email: <Link className="font-semibold text-ink hover:text-moss" href={`mailto:${info.email}`}>{info.email}</Link></p> : null}
          {info.phone ? <p>Phone / WhatsApp: <span className="font-semibold text-ink">{info.phone}</span></p> : null}
          {socials.map(([label, href]) => (
            <p key={label}>
              {label}: <Link className="font-semibold text-ink hover:text-moss" href={href} target="_blank">{href}</Link>
            </p>
          ))}
        </div>
      </section>
      <ContactForm />
    </main>
  );
}
