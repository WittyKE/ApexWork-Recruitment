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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stepper } from "@/components/forms/stepper";
import { CvDropzone } from "@/components/forms/cv-dropzone";
import { skilledApplicationSchema, type SkilledApplicationValues } from "@/lib/validations/skilled-application";
import { RIGHT_TO_WORK_LABELS } from "@/lib/supabase/types";
import { submitSkilledApplication } from "./actions";

const STEPS = ["Contact Info", "Eligibility", "CV Upload"];

export default function SkilledApplicationPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [submitted, setSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<SkilledApplicationValues>({
    resolver: zodResolver(skilledApplicationSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      headline: "",
      rightToWorkStatus: undefined,
      cvFile: undefined,
      consent: undefined,
    },
  });

  const {
    register,
    trigger,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = form;

  const cvFile = watch("cvFile");
  const consent = watch("consent");

  async function goNext() {
    const fieldsByStep: (keyof SkilledApplicationValues)[][] = [
      ["fullName", "email", "phone", "location"],
      ["headline", "rightToWorkStatus"],
    ];
    const valid = await trigger(fieldsByStep[step - 1]);
    if (valid) setStep((s) => s + 1);
  }

  async function onSubmit(values: SkilledApplicationValues) {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("location", values.location);
    formData.append("headline", values.headline);
    formData.append("rightToWorkStatus", values.rightToWorkStatus);
    formData.append("cvFile", values.cvFile);

    const result = await submitSkilledApplication(formData);
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
        <h1 className="mt-6 text-2xl font-bold">Application Submitted</h1>
        <p className="mt-3 text-muted-foreground">
          Thanks for uploading your CV. Our team will review your profile and match you against live roles —
          you&apos;ll hear from us by email.
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
        <h1 className="text-3xl font-bold tracking-tight">Upload Your CV</h1>
        <p className="mt-2 text-muted-foreground">
          For skilled professionals — we&apos;ll parse your CV and automatically match you against live UK roles.
        </p>
      </div>

      <div className="mt-10">
        <Stepper steps={STEPS} currentStep={step} />
      </div>

      <Card className="mt-8">
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {step === 1 && (
              <>
                <Field label="Full Name" error={errors.fullName?.message}>
                  <Input {...register("fullName")} placeholder="Jane Doe" />
                </Field>
                <Field label="Email Address" error={errors.email?.message}>
                  <Input {...register("email")} type="email" placeholder="jane@example.com" />
                </Field>
                <Field label="Phone Number" error={errors.phone?.message}>
                  <Input {...register("phone")} type="tel" placeholder="+44 7700 900000" />
                </Field>
                <Field label="Current Location" error={errors.location?.message}>
                  <Input {...register("location")} placeholder="London, UK" />
                </Field>
              </>
            )}

            {step === 2 && (
              <>
                <Field label="Current / Target Job Title" error={errors.headline?.message}>
                  <Input {...register("headline")} placeholder="Senior Software Engineer" />
                </Field>
                <Field label="Right to Work Status" error={errors.rightToWorkStatus?.message}>
                  <Select onValueChange={(v) => setValue("rightToWorkStatus", v as SkilledApplicationValues["rightToWorkStatus"], { shouldValidate: true })}>
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
              </>
            )}

            {step === 3 && (
              <>
                <Field label="Upload CV (PDF or DOCX)" error={errors.cvFile?.message as string | undefined}>
                  <CvDropzone
                    file={cvFile ?? null}
                    onChange={(file) => setValue("cvFile", file as File, { shouldValidate: true })}
                    error={errors.cvFile?.message as string | undefined}
                  />
                </Field>
                <div className="flex items-start gap-2.5 rounded-lg border bg-muted/30 p-4">
                  <Checkbox
                    id="consent"
                    checked={consent === true}
                    onCheckedChange={(checked) => setValue("consent", checked === true ? true : (undefined as never), { shouldValidate: true })}
                  />
                  <Label htmlFor="consent" className="cursor-pointer text-sm font-normal leading-relaxed">
                    I consent to ApexWork Recruitment Agency processing my personal data and CV in accordance with
                    the{" "}
                    <a href="/privacy" className="text-primary underline">
                      Privacy Policy
                    </a>{" "}
                    to match me with relevant job opportunities.
                  </Label>
                </div>
                {errors.consent && <p className="text-sm text-destructive">{errors.consent.message as string}</p>}
              </>
            )}

            <div className="flex items-center justify-between pt-4">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
                  Back
                </Button>
              ) : (
                <span />
              )}
              {step < 3 ? (
                <Button type="button" onClick={goNext}>
                  Continue
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
