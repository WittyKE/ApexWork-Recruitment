# ApexWork Recruitment Agency

A production-ready recruitment and job-matching platform for the UK market, plus an internal admin panel — built with Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui (Base UI primitives), and Supabase.

The public site connects two kinds of job seekers with UK employers:

- **Skilled professionals** — upload a CV, get matched automatically.
- **Essential & skilled labour** (caregivers, SIA security guards, gardeners, general labour) — register directly with a structured, role-specific form, no CV required.

The `/admin` panel manages the same underlying data (jobs, candidates, employers, applications) with a dashboard, data tables, analytics and audit logs.

**This app runs immediately with zero configuration.** With no environment variables set, every page renders against realistic mock data ("demo mode") instead of crashing — see [Demo mode vs. live mode](#demo-mode-vs-live-mode) below.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, TypeScript) |
| Styling / UI | Tailwind CSS v4, shadcn/ui (Base UI primitives), Lucide icons |
| Forms & validation | React Hook Form + Zod |
| Database / Auth / Storage | Supabase (PostgreSQL, RLS, Auth, Storage) |
| Email | Resend |
| Data tables | TanStack Table v8 |
| Charts | Recharts (via shadcn `chart` wrapper) |
| Theming | next-themes (light/dark) |

> **Note on Next.js 16:** this project intentionally targets Next 16, which changed several App Router conventions from earlier versions (async `params`/`searchParams`, `middleware.ts` → `proxy.ts`, Turbopack-by-default). See `AGENTS.md` / `node_modules/next/dist/docs/` if you're extending this app with an AI agent.
>
> **Note on shadcn/ui here:** the installed shadcn registry uses [Base UI](https://base-ui.com) primitives rather than Radix. Polymorphic composition uses the `render` prop (`<Trigger render={<Button />}>`), not `asChild`.

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the site and `/admin` panel are both fully browsable immediately, backed by mock data.

To build for production:

```bash
npm run build
npm start
```

---

## Demo mode vs. live mode

`src/lib/env.ts` checks whether real Supabase/Resend credentials are present. If not (or if they look like placeholders), the app automatically:

- Serves jobs, candidates, employers, applications, admin users and audit logs from `src/lib/mock-data.ts` instead of querying Supabase (see `src/lib/data/*`).
- Skips auth enforcement in `src/proxy.ts` so `/admin` and `/dashboard` stay reachable for evaluation.
- Logs transactional emails to the server console instead of calling Resend (see `src/lib/email.ts`).
- Shows a "Demo mode" banner at the top of the admin panel.

Once you add real environment variables (see below) and re-deploy/restart, the app switches to live Supabase data and real email delivery with no code changes required.

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values below.

| Variable | Required for | Where to find it |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Live database/auth/storage | Supabase dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Live database/auth/storage | Supabase dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin panel data access, storage signed URLs, privileged writes | Supabase dashboard → Project Settings → API (**server-only — never expose to the client**) |
| `RESEND_API_KEY` | Real transactional emails | [resend.com/api-keys](https://resend.com/api-keys) |
| `RESEND_FROM_EMAIL` | Real transactional emails | A verified sender on your Resend domain |
| `NEXT_PUBLIC_SITE_URL` | Correct absolute URLs in metadata/OpenGraph/sitemap | Your production domain |

---

## Setting up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run the migrations in `supabase/migrations/` **in order**:
   - `0001_schema.sql` — tables, enums, triggers (incl. auto-creating a `profiles` row on signup)
   - `0002_rls.sql` — Row Level Security policies for every table
   - `0003_storage.sql` — `cvs` and `certificates` storage buckets + policies
3. (Optional, local/dev only) Run `supabase/seed.sql` to create a demo employer and a handful of published jobs.
4. Copy your Project URL and anon/service-role keys into `.env.local`.
5. In Supabase Auth settings, enable email/password sign-up. When a user signs up, pass `role` (`candidate` or `employer`), `full_name`, and `phone` in `options.data` — the `handle_new_user` trigger uses these to create the matching `profiles` row.
6. To grant someone admin/manager access to `/admin`, update their `profiles.role` to `admin` or `manager` directly in the Supabase table editor (there's no self-service admin sign-up by design).

### Data model

`profiles` (extends `auth.users`) → `candidates` / `employers` (1:1) → `essential_profiles` (1:1 with candidates, role-specific fields) → `jobs` (belongs to an employer) → `applications` (candidate ↔ job) → `contact_messages`, `audit_logs`.

Full column definitions live in `supabase/migrations/0001_schema.sql`; TypeScript types mirroring the schema are in `src/lib/supabase/types.ts`.

### Storage

CVs and certificates upload to private Supabase Storage buckets (`cvs`, `certificates`) under `{bucket}/{candidate_id}/{filename}`. Files are never public — access is via RLS-scoped signed URLs generated server-side.

---

## Setting up Resend

1. Create an account at [resend.com](https://resend.com) and verify a sending domain.
2. Create an API key and set `RESEND_API_KEY`.
3. Set `RESEND_FROM_EMAIL` to a verified address on that domain.

Transactional emails sent: application confirmation (candidate), new-applicant alert (employer), contact form notification + acknowledgement, job-posted confirmation. Templates live in `src/lib/email.ts`.

---

## Project structure

```
src/
  app/
    (site)/              Public site — shares header/footer via (site)/layout.tsx
      page.tsx            Homepage
      jobs/                Job board + [slug] detail page
      apply/skilled/       Skilled candidate CV upload (multi-step)
      apply/essential/     Essential worker registration (multi-step, role-specific)
      employers/           Employer marketing page + post-job form
      about/, contact/, privacy/, terms/
    admin/                Admin panel — separate layout (sidebar + header), RBAC via proxy.ts
      dashboard/, users/, jobs/, applications/, analytics/, logs/, settings/
    sitemap.ts, robots.ts
  components/
    layout/               Site header/footer
    site/                 Job cards, filters, hero search, contact form
    forms/                Multi-step form primitives (stepper, CV dropzone, essential role forms)
    admin/                Admin sidebar/header, data table, charts, per-module tables & dialogs
    ui/                   shadcn/ui primitives (Base UI-backed)
  lib/
    supabase/             Browser/server/admin Supabase clients + types
    data/                 Data-access layer — Supabase when configured, mock data otherwise
    validations/          Zod schemas per form
    mock-data.ts          Realistic seed data for demo mode + admin panel
    email.ts              Resend integration
    admin/                Admin nav config, analytics helpers
  proxy.ts                Next.js 16 middleware (session refresh + /admin RBAC)
supabase/
  migrations/             SQL schema, RLS policies, storage buckets
  seed.sql                Optional local demo data
```

---

## Accessibility & responsiveness

- Semantic landmarks (`header`, `nav`, `main`, `footer`), labelled form fields, keyboard-operable menus/dialogs (Base UI primitives handle focus trapping and ARIA out of the box).
- Mobile-first layouts across the public site and admin panel; the admin sidebar collapses to an icon rail and a drawer on small screens.
- Chart colours are drawn from a validated, colour-vision-deficiency-checked categorical palette (`src/app/globals.css` `--chart-*` tokens); all charts ship with visible legends/labels rather than relying on colour alone.

## SEO

- Per-page `Metadata` (title templates, descriptions, OpenGraph/Twitter cards) — see `src/app/layout.tsx` and individual `page.tsx` files.
- `src/app/sitemap.ts` generates `/sitemap.xml` from live (or mock) job listings plus static routes.
- `src/app/robots.ts` disallows `/admin`, `/dashboard`, `/api`.

## Known limitations / next steps for a real launch

- Candidate/employer authentication UI (sign-in/sign-up pages) is not included — server actions and RLS assume an authenticated Supabase session but the login screens themselves still need to be built.
- Admin panel CRUD (Users/Jobs/Applications) mutates local React state for demo purposes; wire the `onSave`/`onDelete` handlers in `src/components/admin/**` to Supabase server actions once you're ready to persist changes.
- Add a payment/billing step if job postings should not be free.
- Review and tighten Supabase Storage file-size/type limits for your risk tolerance before going live.
