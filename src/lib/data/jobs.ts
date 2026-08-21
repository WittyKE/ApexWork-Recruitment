import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { mockJobsWithEmployer } from "@/lib/mock-data";
import { JOB_CATEGORY_LABELS, type EmploymentType, type JobCategory, type JobWithEmployer } from "@/lib/supabase/types";

export interface JobFilters {
  keyword?: string;
  location?: string;
  category?: JobCategory | "all";
  employmentType?: EmploymentType | "all";
  visaSponsorship?: boolean;
  page?: number;
  pageSize?: number;
}

export interface JobSearchResult {
  jobs: JobWithEmployer[];
  total: number;
}

export interface JobSuggestion {
  title: string;
  slug: string;
  location: string;
  employerName: string;
}

function getKeywordTerms(keyword?: string): string[] {
  return keyword?.trim().toLowerCase().split(/\s+/).filter(Boolean) ?? [];
}

function matchesKeywordTerms(job: JobWithEmployer, terms: string[]): boolean {
  if (terms.length === 0) return true;

  const title = job.title.toLowerCase();
  return terms.every((term) => title.includes(term));
}

function escapeIlikeTerm(term: string): string {
  return term.replace(/[\\%_*]/g, "\\$&").replace(/[(),]/g, "");
}

function filterMockJobs(filters: JobFilters): JobWithEmployer[] {
  let jobs = mockJobsWithEmployer.filter((j) => j.status === "published");

  if (filters.keyword) {
    jobs = jobs.filter((job) => matchesKeywordTerms(job, getKeywordTerms(filters.keyword)));
  }
  if (filters.location) {
    const loc = filters.location.toLowerCase();
    jobs = jobs.filter((j) => j.location.toLowerCase().includes(loc));
  }
  if (filters.category && filters.category !== "all") {
    jobs = jobs.filter((j) => j.category === filters.category);
  }
  if (filters.employmentType && filters.employmentType !== "all") {
    jobs = jobs.filter((j) => j.employment_type === filters.employmentType);
  }
  if (filters.visaSponsorship) {
    jobs = jobs.filter((j) => j.visa_sponsorship);
  }
  return jobs.sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));
}

export async function searchJobs(filters: JobFilters = {}): Promise<JobSearchResult> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 9;

  if (!isSupabaseConfigured) {
    const all = filterMockJobs(filters);
    const start = (page - 1) * pageSize;
    return { jobs: all.slice(start, start + pageSize), total: all.length };
  }

  const supabase = await createClient();
  if (!supabase) {
    const all = filterMockJobs(filters);
    const start = (page - 1) * pageSize;
    return { jobs: all.slice(start, start + pageSize), total: all.length };
  }

  let query = supabase
    .from("jobs")
    .select("*, employer:employers(id, company_name, industry, is_verified)", { count: "exact" })
    .eq("status", "published");

  for (const term of getKeywordTerms(filters.keyword)) {
    const escapedTerm = escapeIlikeTerm(term);
    if (escapedTerm) {
      query = query.ilike("title", `%${escapedTerm}%`);
    }
  }
  if (filters.location) query = query.ilike("location", `%${filters.location}%`);
  if (filters.category && filters.category !== "all") query = query.eq("category", filters.category);
  if (filters.employmentType && filters.employmentType !== "all")
    query = query.eq("employment_type", filters.employmentType);
  if (filters.visaSponsorship) query = query.eq("visa_sponsorship", true);

  const start = (page - 1) * pageSize;
  const { data, error, count } = await query
    .order("published_at", { ascending: false })
    .range(start, start + pageSize - 1);

  if (error || !data) {
    const all = filterMockJobs(filters);
    return { jobs: all.slice(start, start + pageSize), total: all.length };
  }

  return { jobs: data as unknown as JobWithEmployer[], total: count ?? data.length };
}

export async function getFeaturedJobs(): Promise<JobWithEmployer[]> {
  const otherCategories = (Object.keys(JOB_CATEGORY_LABELS) as JobCategory[]).filter(
    (category) => category !== "au_pair"
  );

  const [auPairResult, ...otherResults] = await Promise.all([
    searchJobs({ category: "au_pair", pageSize: 3, page: 1 }),
    ...otherCategories.map((category) => searchJobs({ category, pageSize: 1, page: 1 })),
  ]);

  const otherJobs = otherResults.map((result) => result.jobs[0]).filter((job): job is JobWithEmployer => Boolean(job));

  return [...auPairResult.jobs, ...otherJobs];
}

export async function getJobSuggestions(keyword: string, limit = 6): Promise<JobSuggestion[]> {
  const { jobs } = await searchJobs({ keyword, page: 1, pageSize: Math.min(Math.max(limit, 1), 10) });
  return jobs.map((job) => ({
    title: job.title,
    slug: job.slug,
    location: job.location,
    employerName: job.employer.company_name,
  }));
}

export async function getJobBySlug(slug: string): Promise<JobWithEmployer | null> {
  if (!isSupabaseConfigured) {
    return mockJobsWithEmployer.find((j) => j.slug === slug) ?? null;
  }

  const supabase = await createClient();
  if (!supabase) return mockJobsWithEmployer.find((j) => j.slug === slug) ?? null;

  const { data, error } = await supabase
    .from("jobs")
    .select("*, employer:employers(id, company_name, industry, is_verified, about, website)")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return mockJobsWithEmployer.find((j) => j.slug === slug) ?? null;
  return data as unknown as JobWithEmployer;
}

export async function getRelatedJobs(job: JobWithEmployer, limit = 3): Promise<JobWithEmployer[]> {
  const { jobs } = await searchJobs({ category: job.category, pageSize: limit + 1 });
  return jobs.filter((j) => j.id !== job.id).slice(0, limit);
}
