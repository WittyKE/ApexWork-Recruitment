"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, HeartHandshake, Leaf, ShieldCheck, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stepper } from "@/components/forms/stepper";
import { EssentialRoleDetailsForm } from "@/components/forms/essential-role-details-form";
import {
  essentialContactSchema,
  type EssentialContactValues,
  type EssentialRoleDetailsValues,
} from "@/lib/validations/essential-application";
import { RIGHT_TO_WORK_LABELS } from "@/lib/supabase/types";
import type { EssentialRoleType } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { submitEssentialApplication } from "./actions";

const STEPS = ["Role", "Contact Info", "Role Details"];

const ROLE_OPTIONS: { value: EssentialRoleType; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: "caregiver",
    label: "Caregiver",
    description: "Live-in, domiciliary or residential care roles",
    icon: <HeartHandshake className="size-6" />,
  },
  {
    value: "security",
    label: "SIA Security Guard",
    description: "Static, mobile & door supervision roles",
    icon: <ShieldCheck className="size-6" />,
  },
  {
    value: "gardener",
    label: "Gardener",
    description: "Grounds maintenance & landscaping roles",
    icon: <Leaf className="size-6" />,
  },
  {
    value: "general_labour",
    label: "General Labour",
    description: "Warehouse, construction & manual roles",
    icon: <Wrench className="size-6" />,
  },
];

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export default function EssentialApplicationPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [roleType, setRoleType] = React.useState<EssentialRoleType | null>(null);
  const [contact, setContact] = React.useState<EssentialContactValues | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const contactForm = useForm<EssentialContactValues>({
    resolver: zodResolver(essentialContactSchema),
    mode: "onTouched",
    defaultValues: { fullName: "", email: "", phone: "", location: "", rightToWorkStatus: undefined },
  });

  async function handleContactSubmit(values: EssentialContactValues) {
    setContact(values);
    setStep(3);
  }

  async function handleDetailsSubmit(details: EssentialRoleDetailsValues) {
    if (!contact) return;
    setIsSubmitting(true);
    const result = await submitEssentialApplication(contact, details);
    setIsSubmitting(false);
    if (result.success) {
      setSubmitted(true);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <CheckCircle2 className="mx-auto size-14 text-emerald-500" />
        <h1 className="mt-6 text-2xl font-bold">You&apos;re Registered</h1>
        <p className="mt-3 text-muted-foreground">
          Thanks for registering with ApexWork. We&apos;ll match you with suitable vacancies and contact you
          directly by phone or email.
        </p>
        <Button className="mt-8" onClick={() => router.push("/jobs")}>
          Browse More Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Register for Essential Roles</h1>
        <p className="mt-2 text-muted-foreground">
          No CV required — tell us about your trade and we&apos;ll match you with live vacancies.
        </p>
      </div>

      <div className="mt-10">
        <Stepper steps={STEPS} currentStep={step} />
      </div>

      <Card className="mt-8">
        <CardContent className="p-6 sm:p-8">
          {step === 1 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ROLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setRoleType(opt.value);
                    setStep(2);
                  }}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-xl border-2 p-5 text-left transition-colors hover:border-primary/50 hover:bg-accent",
                    roleType === opt.value ? "border-primary bg-accent" : "border-border"
                  )}
                >
                  <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {opt.icon}
                  </span>
                  <span className="font-semibold">{opt.label}</span>
                  <span className="text-sm text-muted-foreground">{opt.description}</span>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <form onSubmit={contactForm.handleSubmit(handleContactSubmit)} className="space-y-5">
              <Field label="Full Name" error={contactForm.formState.errors.fullName?.message}>
                <Input {...contactForm.register("fullName")} placeholder="Jane Doe" />
              </Field>
              <Field label="Email Address" error={contactForm.formState.errors.email?.message}>
                <Input {...contactForm.register("email")} type="email" placeholder="jane@example.com" />
              </Field>
              <Field label="Phone Number" error={contactForm.formState.errors.phone?.message}>
                <Input {...contactForm.register("phone")} type="tel" placeholder="+44 7700 900000" />
              </Field>
              <Field label="Current Location" error={contactForm.formState.errors.location?.message}>
                <Input {...contactForm.register("location")} placeholder="Huntingdon, UK" />
              </Field>
              <Field label="Right to Work Status" error={contactForm.formState.errors.rightToWorkStatus?.message}>
                <Select
                  onValueChange={(v) =>
                    contactForm.setValue("rightToWorkStatus", v as EssentialContactValues["rightToWorkStatus"], {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(RIGHT_TO_WORK_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <div className="flex items-center justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit">Continue</Button>
              </div>
            </form>
          )}

          {step === 3 && roleType && (
            <fieldset disabled={isSubmitting}>
              <EssentialRoleDetailsForm roleType={roleType} onBack={() => setStep(2)} onSubmit={handleDetailsSubmit} />
            </fieldset>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
