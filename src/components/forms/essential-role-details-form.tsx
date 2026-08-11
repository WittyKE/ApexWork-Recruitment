"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  caregiverDetailsSchema,
  securityDetailsSchema,
  gardenerFieldsSchema,
  type EssentialRoleDetailsValues,
} from "@/lib/validations/essential-application";
import type { EssentialRoleType } from "@/lib/supabase/types";

const SHIFT_OPTIONS = [
  { value: "days", label: "Days" },
  { value: "nights", label: "Nights" },
  { value: "weekends", label: "Weekends" },
  { value: "live_in", label: "Live-in" },
] as const;

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function EssentialRoleDetailsForm({
  roleType,
  onBack,
  onSubmit,
}: {
  roleType: EssentialRoleType;
  onBack: () => void;
  onSubmit: (values: EssentialRoleDetailsValues) => void;
}) {
  if (roleType === "caregiver") return <CaregiverForm onBack={onBack} onSubmit={onSubmit} />;
  if (roleType === "security") return <SecurityForm onBack={onBack} onSubmit={onSubmit} />;
  return <GardenerForm roleType={roleType} onBack={onBack} onSubmit={onSubmit} />;
}

function CaregiverForm({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: (values: EssentialRoleDetailsValues) => void;
}) {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(caregiverDetailsSchema),
    defaultValues: { roleType: "caregiver" as const, shiftAvailability: [] },
  });
  const shifts = watch("shiftAvailability") ?? [];

  function toggleShift(value: (typeof SHIFT_OPTIONS)[number]["value"]) {
    const next = shifts.includes(value) ? shifts.filter((s) => s !== value) : [...shifts, value];
    setValue("shiftAvailability", next, { shouldValidate: true });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Field label="Care Certificate Status" error={errors.careCertificateStatus?.message}>
        <Select onValueChange={(v) => setValue("careCertificateStatus", v as "held" | "in_progress" | "not_held", { shouldValidate: true })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="held">Held</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="not_held">Not Held</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field label="NVQ Level" error={errors.nvqLevel?.message}>
        <Select onValueChange={(v) => setValue("nvqLevel", v as "none" | "level_2" | "level_3" | "level_4_plus", { shouldValidate: true })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select NVQ level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="level_2">Level 2</SelectItem>
            <SelectItem value="level_3">Level 3</SelectItem>
            <SelectItem value="level_4_plus">Level 4+</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <div className="flex items-center gap-2.5">
        <Checkbox id="driving" onCheckedChange={(c) => setValue("drivingLicense", c === true)} />
        <Label htmlFor="driving" className="cursor-pointer font-normal">
          I hold a full UK driving licence
        </Label>
      </div>

      <Field label="Shift Availability" error={errors.shiftAvailability?.message as string | undefined}>
        <div className="grid grid-cols-2 gap-2.5">
          {SHIFT_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 rounded-md border p-2.5 text-sm hover:bg-accent"
            >
              <Checkbox checked={shifts.includes(opt.value)} onCheckedChange={() => toggleShift(opt.value)} />
              {opt.label}
            </label>
          ))}
        </div>
      </Field>

      <StepActions onBack={onBack} />
    </form>
  );
}

function SecurityForm({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: (values: EssentialRoleDetailsValues) => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(securityDetailsSchema),
    defaultValues: { roleType: "security" as const },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Field label="SIA Licence Number" error={errors.siaLicenseNumber?.message}>
        <Input {...register("siaLicenseNumber")} placeholder="e.g. 0012345678901234" />
      </Field>
      <div className="flex items-center gap-2.5">
        <Checkbox id="cctv" onCheckedChange={(c) => setValue("siaCctvEndorsement", c === true)} />
        <Label htmlFor="cctv" className="cursor-pointer font-normal">
          My licence has a CCTV endorsement
        </Label>
      </div>
      <Field label="Licence Expiry Date" error={errors.siaLicenseExpiry?.message}>
        <Input {...register("siaLicenseExpiry")} type="date" />
      </Field>
      <StepActions onBack={onBack} />
    </form>
  );
}

function GardenerForm({
  roleType,
  onBack,
  onSubmit,
}: {
  roleType: "gardener" | "general_labour";
  onBack: () => void;
  onSubmit: (values: EssentialRoleDetailsValues) => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(gardenerFieldsSchema),
  });

  return (
    <form
      onSubmit={handleSubmit((fields) => onSubmit({ roleType, ...fields } as EssentialRoleDetailsValues))}
      className="space-y-5"
    >
      <Field label="Equipment / Machinery Experience" error={errors.equipmentExperience?.message}>
        <Input {...register("equipmentExperience")} placeholder="e.g. Ride-on mower, strimmer, chainsaw" />
      </Field>
      <Field label="Physical Availability" error={errors.physicalAvailability?.message}>
        <Select
          onValueChange={(v) =>
            setValue("physicalAvailability", v as "full_time" | "part_time" | "weekends_only" | "seasonal", {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full_time">Full-Time</SelectItem>
            <SelectItem value="part_time">Part-Time</SelectItem>
            <SelectItem value="weekends_only">Weekends Only</SelectItem>
            <SelectItem value="seasonal">Seasonal</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <StepActions onBack={onBack} />
    </form>
  );
}

function StepActions({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex items-center justify-between pt-4">
      <Button type="button" variant="outline" onClick={onBack}>
        Back
      </Button>
      <Button type="submit">Continue</Button>
    </div>
  );
}
