"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminJobSchema, type AdminJobValues } from "@/lib/validations/admin-job";
import { EMPLOYMENT_TYPE_LABELS, JOB_CATEGORY_LABELS, type JobWithEmployer } from "@/lib/supabase/types";
import type { EmployerOption } from "@/lib/data/admin/jobs";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

function toDefaults(job?: JobWithEmployer): AdminJobValues {
  if (!job) {
    return {
      title: "",
      employerId: "",
      category: "healthcare_caregiving",
      employmentType: "full_time",
      location: "",
      isRemote: false,
      visaSponsorship: false,
      description: "",
      requirements: "",
      benefits: "",
      status: "draft",
    };
  }
  return {
    title: job.title,
    employerId: job.employer.id,
    category: job.category,
    employmentType: job.employment_type,
    location: job.location,
    isRemote: job.is_remote,
    visaSponsorship: job.visa_sponsorship,
    description: job.description,
    requirements: job.requirements ?? "",
    benefits: job.benefits ?? "",
    status: job.status,
  };
}

export function JobFormDialog({
  trigger,
  job,
  employers,
  onSave,
  open: openProp,
  onOpenChange,
}: {
  trigger?: React.ReactElement;
  job?: JobWithEmployer;
  employers: EmployerOption[];
  onSave: (values: AdminJobValues) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AdminJobValues>({ resolver: zodResolver(adminJobSchema), defaultValues: toDefaults(job) });

  const values = watch();

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) reset(toDefaults(job));
  }

  function onSubmit(vals: AdminJobValues) {
    onSave(vals);
    setOpen(false);
  }

  const formId = `job-form-${job?.id ?? "new"}`;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{job ? "Edit Job" : "Add New Job"}</DialogTitle>
          <DialogDescription>
            {job ? "Update this job listing." : "Create a new job listing on the platform."}
          </DialogDescription>
        </DialogHeader>
        <form id={formId} onSubmit={handleSubmit(onSubmit)} className="max-h-[65vh] space-y-4 overflow-y-auto pr-1">
          <Field label="Job Title" error={errors.title?.message}>
            <Input {...register("title")} placeholder="e.g. Live-in Caregiver" />
          </Field>
          <Field label="Employer" error={errors.employerId?.message}>
            <Select value={values.employerId} onValueChange={(v) => setValue("employerId", v ?? "", { shouldValidate: true })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an employer" />
              </SelectTrigger>
              <SelectContent>
                {employers.map((employer) => (
                  <SelectItem key={employer.id} value={employer.id}>
                    {employer.company_name}
                    {!employer.is_verified && " (unverified)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category" error={errors.category?.message}>
              <Select value={values.category} onValueChange={(v) => setValue("category", v as AdminJobValues["category"], { shouldValidate: true })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
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
              <Select
                value={values.employmentType}
                onValueChange={(v) => setValue("employmentType", v as AdminJobValues["employmentType"], { shouldValidate: true })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
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
          <Field label="Description" error={errors.description?.message}>
            <Textarea {...register("description")} rows={4} placeholder="Describe the role, responsibilities and setting..." />
          </Field>
          <Field label="Requirements" error={errors.requirements?.message}>
            <Textarea {...register("requirements")} rows={3} placeholder="List the key requirements..." />
          </Field>
          <Field label="Benefits (optional)" error={errors.benefits?.message}>
            <Textarea {...register("benefits")} rows={2} placeholder="e.g. Visa sponsorship, paid training..." />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Status" error={errors.status?.message}>
              <Select value={values.status} onValueChange={(v) => setValue("status", v as AdminJobValues["status"], { shouldValidate: true })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <div className="flex flex-col justify-end gap-3 pb-2">
              <div className="flex items-center gap-2.5">
                <Switch checked={values.isRemote} onCheckedChange={(c) => setValue("isRemote", c)} />
                <Label className="font-normal">Remote</Label>
              </div>
              <div className="flex items-center gap-2.5">
                <Switch checked={values.visaSponsorship} onCheckedChange={(c) => setValue("visaSponsorship", c)} />
                <Label className="font-normal">Visa Sponsorship</Label>
              </div>
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" form={formId}>
            {job ? "Save Changes" : "Create Job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
