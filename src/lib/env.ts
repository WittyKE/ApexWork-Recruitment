// Central place to read env vars and detect whether real backend services
// are configured. When they're not (fresh checkout, no .env.local yet), the
// app falls back to realistic mock data instead of crashing, so the UI is
// always viewable — see src/lib/mock-data.ts and src/lib/data/*.

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  return /your[-_]|placeholder|xxxx|changeme|example\.com/i.test(value);
}

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const RESEND_API_KEY = process.env.RESEND_API_KEY;

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY && !isPlaceholder(SUPABASE_URL) && !isPlaceholder(SUPABASE_ANON_KEY)
);

export const isEmailConfigured = Boolean(RESEND_API_KEY && !isPlaceholder(RESEND_API_KEY));

export const siteConfig = {
  name: "ApexWork Recruitment Agency",
  tagline: "Your Gateway to UK Jobs & Global Opportunities.",
  valueProp:
    "Whether you're a skilled professional uploading a CV or an essential worker looking for caregiver, security, or labour roles in the UK—we connect talent directly with employer opportunities.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.apexworkrecruitment.co.uk",
  address: {
    line1: "Unit B, Sovereign Court",
    line2: "Ermine Business Park",
    city: "Huntingdon",
    postcode: "PE29 6XU",
    country: "United Kingdom",
    full: "Unit B, Sovereign Court, Ermine Business Park, Huntingdon, PE29 6XU, United Kingdom",
  },
  phone: {
    display: "+44 744 636 4856",
    href: "tel:+447446364856",
  },
  email: "info@apexworkrecruitment.co.uk",
} as const;
