# Portfolio CMS

A modern Next.js portfolio website with a Supabase-powered CMS/admin panel.

## Routes

- `/` public landing page
- `/work` public work page with category filters
- `/contact` public contact page
- `/admin/login` Supabase email/password login
- `/admin/dashboard` CMS overview
- `/admin/website` website info editor
- `/admin/categories` category manager
- `/admin/works` work/project manager
- `/admin/messages` contact message inbox

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` in the same folder as `package.json`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Paste your Supabase Project URL and anon public key into those two values. Do not use the `service_role` key.

3. Restart the dev server after saving `.env.local`:

```bash
npm run dev
```

Next.js only loads updated environment variables when the dev server starts.

4. In Supabase SQL Editor, run:

```bash
supabase/schema.sql
```

5. In Supabase Auth, create the admin user with email/password. The included MVP policies treat authenticated users as admins, so only create trusted users.

6. Confirm the public Storage bucket exists:

```text
portfolio-media
```

The schema creates it and adds public read plus authenticated write policies.

Then open `http://localhost:3000`.

## Notes

- Supabase credentials are read only from environment variables.
- Public pages fetch active categories, published works, and website info from Supabase.
- Contact form submissions insert into `contact_messages`.
- Admin image uploads save public URLs from the `portfolio-media` bucket.
- Existing HEIC files already uploaded to Supabase must be converted to JPG/PNG/WEBP and re-uploaded.
- This is intentionally MVP-focused: no blog, testimonials, payment flow, animation library, or project detail pages.
