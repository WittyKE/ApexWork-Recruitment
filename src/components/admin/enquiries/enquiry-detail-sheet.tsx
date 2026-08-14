"use client";

import * as React from "react";
import { toast } from "sonner";
import { CheckCircle2, Mail, Phone } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { ContactMessage, ContactStatus } from "@/lib/supabase/types";
import { updateEnquiryStatus } from "@/app/admin/enquiries/actions";
import { CONTACT_STATUS_LABELS, contactStatusColors } from "@/lib/admin/contact-status";

export function EnquiryDetailSheet({
  enquiry,
  open,
  onOpenChange,
}: {
  enquiry: ContactMessage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isPending, startTransition] = React.useTransition();

  if (!enquiry) return null;

  function handleStatusChange(status: ContactStatus) {
    startTransition(async () => {
      const result = await updateEnquiryStatus(enquiry!.id, status);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{enquiry.subject || "General enquiry"}</SheetTitle>
          <SheetDescription>From {enquiry.name}</SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4">
          <Badge className={contactStatusColors[enquiry.status]}>{CONTACT_STATUS_LABELS[enquiry.status]}</Badge>

          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-3.5" />
              <span>{enquiry.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="size-3.5" />
              <span>{enquiry.phone || "No phone provided"}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-1.5">
            <Label>Message</Label>
            <p className="whitespace-pre-wrap rounded-lg border bg-muted/30 p-3 text-sm">{enquiry.message}</p>
          </div>

          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={enquiry.status} onValueChange={(v) => handleStatusChange(v as ContactStatus)} disabled={isPending}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CONTACT_STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter>
          <Button
            type="button"
            className="gap-1.5"
            disabled={isPending || enquiry.status === "resolved"}
            onClick={() => handleStatusChange("resolved")}
          >
            <CheckCircle2 className="size-3.5" /> Mark Resolved &amp; Notify
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
