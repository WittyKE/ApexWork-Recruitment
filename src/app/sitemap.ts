import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/env";
import { searchJobs } from "@/lib/data/jobs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "daily", priority: 1 },
    { url: `${siteConfig.url}/jobs`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/apply/skilled`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/apply/essential`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/employers`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/employers/post-job`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/about`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteConfig.url}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const { jobs } = await searchJobs({ pageSize: 500 });
  const jobRoutes: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${siteConfig.url}/jobs/${job.slug}`,
    lastModified: job.updated_at,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...jobRoutes];
}
