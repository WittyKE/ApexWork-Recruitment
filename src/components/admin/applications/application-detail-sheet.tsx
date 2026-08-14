"use client";

import * as React from "react";
import { toast } from "sonner";
import { FileText, Mail, Phone, Save } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { APPLICATION_STATUS_LABELS, RIGHT_TO_WORK_LABELS, type ApplicationStatus } from "@/lib/supabase/types";
import { applicationStatusColors, type AdminApplicationRow } from "@/lib/mock-data";
import { getApplicationFileUrl, updateApplicationNotes, updateApplicationStatus } from "@/app/admin/applications/actions";

export function ApplicationDetailSheet({
  application,
  open,
  onOpenChange,
}: {
  application: AdminApplicationRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [notes, setNotes] = React.useState(application?.employer_notes ?? "");
  const [syncedId, setSyncedId] = React.useState(application?.id);
  const [isPending, startTransition] = React.useTransition();

  if (application && application.id !== syncedId) {
    setSyncedId(application.id);
    setNotes(application.employer_notes ?? "");
  }

  if (!application) return null;

  function openFile(ref: Parameters<typeof getApplicationFileUrl>[1]) {
    startTransition(async () => {
      const result = await getApplicationFileUrl(application!.id, ref);
      if (result.success && result.data) {
        window.open(result.data.url, "_blank", "noopener,noreferrer");
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleStatusChange(status: ApplicationStatus) {
    startTransition(async () => {
      const result = await updateApplicationStatus(application!.id, status);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  function handleSaveNotes() {
    startTransition(async () => {
      const result = await updateApplicationNotes(application!.id, notes);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{application.candidate_name}</SheetTitle>
          <SheetDescription>
            {application.job_title} &middot; {application.employer_company_name}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={applicationStatusColors[application.status]}>{APPLICATION_STATUS_LABELS[application.status]}</Badge>
            {application.right_to_work_status && (
              <Badge variant="secondary">{RIGHT_TO_WORK_LABELS[application.right_to_work_status]}</Badge>
            )}
          </div>

          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-3.5" />
              <span>{application.candidate_email || "No email on file"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="size-3.5" />
              <span>{application.candidate_phone || "No phone on file"}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-1.5">
            <Label>Change Status</Label>
            <Select value={application.status} onValueChange={(v) => handleStatusChange(v as ApplicationStatus)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(APPLICATION_STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Files</Label>
            <div className="flex flex-col gap-2">
              <Button type="button" variant="outline" size="sm" className="justify-start gap-1.5" disabled={!application.cv_url || isPending} onClick={() => openFile({ type: "cv" })}>
                <FileText className="size-3.5" />
                {application.cv_filename || "No CV on file"}
              </Button>
              {application.certificate_urls.length === 0 && <p className="text-sm text-muted-foreground">No certificates uploaded.</p>}
              {application.certificate_urls.map((url, index) => (
                <Button
                  key={url}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="justify-start gap-1.5"
                  disabled={isPending}
                  onClick={() => openFile({ type: "certificate", index })}
                >
                  <FileText className="size-3.5" />
                  Certificate {index + 1}
                </Button>
              ))}
            </div>
          </div>

          {application.cover_note && (
            <div className="space-y-1.5">
              <Label>Cover Note</Label>
              <p className="rounded-lg border bg-muted/30 p-3 text-sm">{application.cover_note}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Internal Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Notes visible only to staff..." />
          </div>
        </div>

        <SheetFooter>
          <Button type="button" className="gap-1.5" disabled={isPending} onClick={handleSaveNotes}>
            <Save className="size-3.5" /> Save Notes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
