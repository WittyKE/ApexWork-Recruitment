"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { jobPostingSchema, type JobPostingValues } from "@/lib/validations/job-posting";
import { EMPLOYMENT_TYPE_LABELS, JOB_CATEGORY_LABELS } from "@/lib/supabase/types";
import { postJob } from "./actions";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export default function PostJobPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = React.useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<JobPostingValues>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: { isRemote: false, visaSponsorship: false },
  });

  const isRemote = watch("isRemote");
  const visaSponsorship = watch("visaSponsorship");

  async function onSubmit(values: JobPostingValues) {
    const result = await postJob(values);
    if (result.success) {
      setSubmitted(result.message);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <CheckCircle2 className="mx-auto size-14 text-emerald-500" />
        <h1 className="mt-6 text-2xl font-bold">Job Submitted</h1>
        <p className="mt-3 text-muted-foreground">{submitted}</p>
        <Button className="mt-8" onClick={() => router.push("/jobs")}>
          View Live Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Post a Job</h1>
        <p className="mt-2 text-muted-foreground">
          Reach right-to-work verified candidates across the UK — skilled professionals and essential workers alike.
        </p>
      </div>

      <Card className="mt-8">
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Field label="Job Title" error={errors.title?.message}>
              <Input {...register("title")} placeholder="e.g. Live-in Caregiver" />
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Category" error={errors.category?.message}>
                <Select onValueChange={(v) => setValue("category", v as JobPostingValues["category"], { shouldValidate: true })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(JOB_CATEGORY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Employment Type" error={errors.employmentType?.message}>
                <Select onValueChange={(v) => setValue("employmentType", v as JobPostingValues["employmentType"], { shouldValidate: true })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field label="Location" error={errors.location?.message}>
              <Input {...register("location")} placeholder="e.g. Huntingdon, UK" />
            </Field>

            <div className="flex items-center gap-2.5">
              <Switch checked={isRemote} onCheckedChange={(c) => setValue("isRemote", c)} />
              <Label className="font-normal">This role can be performed remotely</Label>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Salary Min (£)" error={errors.salaryMin?.message}>
                <Input {...register("salaryMin")} type="number" placeholder="24000" />
              </Field>
              <Field label="Salary Max (£)" error={errors.salaryMax?.message}>
                <Input {...register("salaryMax")} type="number" placeholder="28000" />
              </Field>
            </div>

            <div className="flex items-center gap-2.5 rounded-lg border bg-muted/30 p-4">
              <Switch checked={visaSponsorship} onCheckedChange={(c) => setValue("visaSponsorship", c)} />
              <div>
                <Label className="font-normal">Visa Sponsorship Available</Label>
                <p className="text-xs text-muted-foreground">Flag this role as eligible for UK visa sponsorship</p>
              </div>
            </div>

            <Field label="Job Description" error={errors.description?.message}>
              <Textarea {...register("description")} rows={6} placeholder="Describe the role, responsibilities and what makes it a great opportunity..." />
            </Field>

            <Field label="Requirements" error={errors.requirements?.message}>
              <Textarea {...register("requirements")} rows={4} placeholder="List the key requirements, certifications or licences needed..." />
            </Field>

            <Field label="Benefits (optional)" error={errors.benefits?.message}>
              <Textarea {...register("benefits")} rows={3} placeholder="e.g. Company van, pension scheme, relocation support..." />
            </Field>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Publishing..." : "Publish Job"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
