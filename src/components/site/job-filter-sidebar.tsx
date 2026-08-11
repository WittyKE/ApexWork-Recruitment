"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { EMPLOYMENT_TYPE_LABELS, JOB_CATEGORY_LABELS, type JobCategory } from "@/lib/supabase/types";
import { categoryAccent } from "@/lib/category-colors";

export function JobFilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = React.useState(searchParams.get("keyword") ?? "");
  const [location, setLocation] = React.useState(searchParams.get("location") ?? "");

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (keyword) params.set("keyword", keyword);
    else params.delete("keyword");
    if (location) params.set("location", location);
    else params.delete("location");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  const activeCategory = searchParams.get("category") ?? "all";
  const activeEmploymentType = searchParams.get("employmentType") ?? "all";
  const visaOnly = searchParams.get("visaSponsorship") === "true";

  const hasFilters =
    keyword || location || activeCategory !== "all" || activeEmploymentType !== "all" || visaOnly;

  return (
    <aside className="w-full space-y-6 lg:w-72 lg:shrink-0">
      <form onSubmit={handleSearchSubmit} className="space-y-3">
        <div>
          <Label htmlFor="filter-keyword" className="mb-1.5">
            Keyword
          </Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="filter-keyword"
              placeholder="Job title"
              className="pl-9"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="filter-location" className="mb-1.5">
            Location
          </Label>
          <Input
            id="filter-location"
            placeholder="Town, city, or 'Remote'"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          Apply Filters
        </Button>
        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => {
              setKeyword("");
              setLocation("");
              router.push(pathname);
            }}
          >
            <X className="size-4" /> Clear all
          </Button>
        )}
      </form>

      <Separator />

      <div>
        <p className="mb-3 text-sm font-semibold">Industry / Role</p>
        <div className="space-y-2.5">
          <FilterOption
            label="All Categories"
            checked={activeCategory === "all"}
            onChange={() => updateParam("category", null)}
          />
          {Object.entries(JOB_CATEGORY_LABELS).map(([value, label]) => (
            <FilterOption
              key={value}
              label={label}
              checked={activeCategory === value}
              onChange={() => updateParam("category", value)}
              dotColor={categoryAccent(value as JobCategory)}
            />
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <p className="mb-3 text-sm font-semibold">Employment Type</p>
        <div className="space-y-2.5">
          <FilterOption
            label="All Types"
            checked={activeEmploymentType === "all"}
            onChange={() => updateParam("employmentType", null)}
          />
          {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([value, label]) => (
            <FilterOption
              key={value}
              label={label}
              checked={activeEmploymentType === value}
              onChange={() => updateParam("employmentType", value)}
            />
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex items-center gap-2.5">
        <Checkbox
          id="visa-sponsorship"
          checked={visaOnly}
          onCheckedChange={(checked) => updateParam("visaSponsorship", checked ? "true" : null)}
        />
        <Label htmlFor="visa-sponsorship" className="cursor-pointer font-normal">
          Visa Sponsorship Available
        </Label>
      </div>
    </aside>
  );
}

function FilterOption({
  label,
  checked,
  onChange,
  dotColor,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  dotColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent ${
        checked ? "bg-accent font-medium text-primary" : "text-muted-foreground"
      }`}
    >
      {dotColor && <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: dotColor }} />}
      {label}
    </button>
  );
}
