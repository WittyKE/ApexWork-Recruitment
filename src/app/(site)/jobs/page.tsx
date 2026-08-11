import type { Metadata } from "next";
import { JobFilterSidebar } from "@/components/site/job-filter-sidebar";
import { JobCard } from "@/components/site/job-card";
import { searchJobs, type JobFilters } from "@/lib/data/jobs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { SearchX } from "lucide-react";
import type { EmploymentType, JobCategory } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Browse UK Jobs",
  description:
    "Search live UK job vacancies with ApexWork Recruitment — healthcare, security, gardening, IT, engineering and more, including visa sponsorship roles.",
};

const PAGE_SIZE = 9;

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const filters: JobFilters = {
    keyword: typeof params.keyword === "string" ? params.keyword : undefined,
    location: typeof params.location === "string" ? params.location : undefined,
    category: (typeof params.category === "string" ? params.category : "all") as JobCategory | "all",
    employmentType: (typeof params.employmentType === "string" ? params.employmentType : "all") as
      | EmploymentType
      | "all",
    visaSponsorship: params.visaSponsorship === "true",
    page: typeof params.page === "string" ? Number(params.page) || 1 : 1,
    pageSize: PAGE_SIZE,
  };

  const { jobs, total } = await searchJobs(filters);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = filters.page ?? 1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Browse UK Jobs</h1>
        <p className="mt-2 text-muted-foreground">
          {total} live {total === 1 ? "vacancy" : "vacancies"} from vetted UK employers.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <JobFilterSidebar />

        <div className="flex-1">
          {jobs.length === 0 ? (
            <div className="flex animate-in fade-in flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center duration-500">
              <SearchX className="size-10 text-muted-foreground" />
              <h2 className="mt-4 text-lg font-semibold">No jobs match your filters</h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Try broadening your search or clearing filters to see more live vacancies.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job, i) => (
                <JobCard key={job.id} job={job} index={i % 9} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <Pagination className="mt-10">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href={buildPageHref(params, currentPage - 1)} aria-disabled={currentPage <= 1} />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink href={buildPageHref(params, page)} isActive={page === currentPage}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext href={buildPageHref(params, currentPage + 1)} aria-disabled={currentPage >= totalPages} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}

function buildPageHref(params: { [key: string]: string | string[] | undefined }, page: number) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (key === "page" || value === undefined) continue;
    search.set(key, Array.isArray(value) ? value[0] : value);
  }
  if (page > 1) search.set("page", String(page));
  const query = search.toString();
  return query ? `/jobs?${query}` : "/jobs";
}
