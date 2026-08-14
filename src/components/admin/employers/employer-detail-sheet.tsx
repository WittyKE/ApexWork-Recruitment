"use client";

import * as React from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Globe, Save, ShieldCheck } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { JOB_STATUS_STYLES } from "@/lib/admin/job-status";
import { updateAdminEmployer } from "@/app/admin/employers/actions";
import type { AdminEmployerRow } from "@/lib/data/admin/employers";
import type { JobWithEmployer } from "@/lib/supabase/types";

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"] as const;

export function EmployerDetailSheet({
  employer,
  jobs,
  open,
  onOpenChange,
}: {
  employer: AdminEmployerRow | null;
  jobs: JobWithEmployer[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isVerified, setIsVerified] = React.useState(employer?.is_verified ?? false);
  const [industry, setIndustry] = React.useState(employer?.industry ?? "");
  const [companySize, setCompanySize] = React.useState(employer?.company_size ?? "");
  const [syncedId, setSyncedId] = React.useState(employer?.id);
  const [isPending, startTransition] = React.useTransition();

  if (employer && employer.id !== syncedId) {
    setSyncedId(employer.id);
    setIsVerified(employer.is_verified);
    setIndustry(employer.industry ?? "");
    setCompanySize(employer.company_size ?? "");
  }

  if (!employer) return null;

  const employerJobs = jobs.filter((j) => j.employer_id === employer.id);

  function handleSave() {
    startTransition(async () => {
      const result = await updateAdminEmployer(employer!.id, {
        isVerified,
        industry,
        companySize: companySize ? (companySize as (typeof COMPANY_SIZES)[number]) : undefined,
      });
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{employer.company_name}</SheetTitle>
          <SheetDescription>{employer.contact_name} &middot; {employer.contact_email}</SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className={`size-4 ${isVerified ? "text-emerald-500" : "text-muted-foreground"}`} />
              <Label className="font-normal">Verified employer</Label>
            </div>
            <Switch checked={isVerified} onCheckedChange={setIsVerified} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Industry</Label>
              <Input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Healthcare" />
            </div>
            <div className="space-y-1.5">
              <Label>Company Size</Label>
              <Select value={companySize} onValueChange={(v) => setCompanySize(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {COMPANY_SIZES.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {employer.website && (
            <a
              href={employer.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <Globe className="size-3.5" /> {employer.website}
            </a>
          )}

          <Separator />

          <div className="space-y-1.5">
            <Label>Jobs Posted ({employerJobs.length})</Label>
            {employerJobs.length === 0 && <p className="text-sm text-muted-foreground">No jobs posted yet.</p>}
            <div className="space-y-2">
              {employerJobs.map((job) => (
                <Link
                  key={job.id}
                  href="/admin/jobs"
                  className="flex items-center justify-between gap-2 rounded-lg border p-2.5 text-sm hover:bg-muted/40"
                >
                  <span className="truncate">{job.title}</span>
                  <Badge className={JOB_STATUS_STYLES[job.status]}>{job.status}</Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button type="button" className="gap-1.5" disabled={isPending} onClick={handleSave}>
            <Save className="size-3.5" /> Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
