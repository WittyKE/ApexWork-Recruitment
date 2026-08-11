"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations/contact";
import { submitContactForm } from "@/app/(site)/contact/actions";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) });

  async function onSubmit(values: ContactFormValues) {
    const result = await submitContactForm(values);
    if (result.success) {
      toast.success(result.message);
      reset();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full Name" error={errors.name?.message}>
          <Input {...register("name")} placeholder="Jane Doe" />
        </Field>
        <Field label="Email Address" error={errors.email?.message}>
          <Input {...register("email")} type="email" placeholder="jane@example.com" />
        </Field>
      </div>
      <Field label="Phone Number (optional)" error={errors.phone?.message}>
        <Input {...register("phone")} type="tel" placeholder="+44 7700 900000" />
      </Field>
      <Field label="Subject" error={errors.subject?.message}>
        <Input {...register("subject")} placeholder="How can we help?" />
      </Field>
      <Field label="Message" error={errors.message?.message}>
        <Textarea {...register("message")} rows={5} placeholder="Tell us a little more..." />
      </Field>
      <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
        <Send className="size-4" />
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
