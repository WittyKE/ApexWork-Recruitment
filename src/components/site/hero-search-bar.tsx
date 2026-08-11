"use client";

import * as React from "react";
import { MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type JobSuggestion = {
  title: string;
  slug: string;
  location: string;
  employerName: string;
};

type JobSuggestionResponse = {
  jobs: JobSuggestion[];
};

type SuggestionResult = {
  keyword: string;
  jobs: JobSuggestion[];
  hasError?: boolean;
};

export function HeroSearchBar() {
  const router = useRouter();
  const [keyword, setKeyword] = React.useState("");
  const [suggestionResult, setSuggestionResult] = React.useState<SuggestionResult | null>(null);
  const [suggestionsDismissed, setSuggestionsDismissed] = React.useState(false);
  const trimmedKeyword = keyword.trim();

  React.useEffect(() => {
    if (trimmedKeyword.length < 1) return;

    const controller = new AbortController();

    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/jobs/suggestions?keyword=${encodeURIComponent(trimmedKeyword)}`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Unable to load job suggestions");

        const data = (await response.json()) as JobSuggestionResponse;
        if (!controller.signal.aborted) {
          setSuggestionResult({ keyword: trimmedKeyword, jobs: data.jobs });
        }
      } catch {
        if (!controller.signal.aborted) {
          setSuggestionResult({ keyword: trimmedKeyword, jobs: [], hasError: true });
        }
      }
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [trimmedKeyword]);

  function clearSuggestions() {
    setSuggestionsDismissed(true);
  }

  function searchJobs() {
    clearSuggestions();
    router.push(trimmedKeyword ? `/jobs?keyword=${encodeURIComponent(trimmedKeyword)}` : "/jobs");
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    searchJobs();
  }

  function openJob(slug: string) {
    clearSuggestions();
    router.push(`/jobs/${slug}`);
  }

  const activeSuggestionResult = suggestionResult?.keyword === trimmedKeyword ? suggestionResult : null;
  const showSuggestions = !suggestionsDismissed && trimmedKeyword.length >= 1;
  const isLoading = showSuggestions && !activeSuggestionResult;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-2 rounded-2xl bg-white/95 p-2.5 shadow-xl backdrop-blur dark:bg-card/95 sm:flex-row sm:items-center"
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search jobs by title"
          value={keyword}
          onChange={(event) => {
            setKeyword(event.target.value);
            setSuggestionsDismissed(false);
          }}
          onFocus={() => setSuggestionsDismissed(false)}
          onKeyDown={(event) => {
            if (event.key === "Escape") clearSuggestions();
          }}
          className="border-0 pl-9 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          aria-label="Search jobs"
          aria-autocomplete="list"
          aria-controls={showSuggestions ? "hero-job-suggestions" : undefined}
          aria-expanded={showSuggestions}
          autoComplete="off"
        />

        {showSuggestions && (
          <div
            id="hero-job-suggestions"
            role="listbox"
            className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-xl border bg-popover py-1 text-popover-foreground shadow-xl"
          >
            {isLoading ? (
              <p className="px-3 py-2 text-sm text-muted-foreground">Searching live jobs…</p>
            ) : activeSuggestionResult?.hasError ? (
              <p className="px-3 py-3 text-sm text-muted-foreground">
                Suggestions are unavailable right now. Press Search Jobs to view results.
              </p>
            ) : activeSuggestionResult?.jobs.length ? (
              <>
                <p className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Matching jobs
                </p>
                {activeSuggestionResult.jobs.map((job) => (
                  <button
                    key={job.slug}
                    type="button"
                    role="option"
                    aria-selected={false}
                    onClick={() => openJob(job.slug)}
                    className="flex w-full flex-col gap-1 px-3 py-2.5 text-left transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                  >
                    <span className="font-medium">{job.title}</span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      {job.location} · {job.employerName}
                    </span>
                  </button>
                ))}
              </>
            ) : (
              <p className="px-3 py-3 text-sm text-muted-foreground">No live jobs match “{trimmedKeyword}”.</p>
            )}
          </div>
        )}
      </div>
      <Button type="submit" size="lg" className="w-full sm:w-auto">
        Search Jobs
      </Button>
    </form>
  );
}
