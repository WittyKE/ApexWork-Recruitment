"use server";

import { contactFormSchema, type ContactFormValues } from "@/lib/validations/contact";
import { createClient } from "@/lib/supabase/server";
import { sendContactFormAcknowledgement, sendContactFormNotification } from "@/lib/email";
import { isSupabaseConfigured } from "@/lib/env";
import type { ActionResult } from "@/lib/action-result";

export async function submitContactForm(values: ContactFormValues): Promise<ActionResult> {
  const parsed = contactFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: "Please check the form for errors and try again." };
  }
  const data = parsed.data;

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    if (supabase) {
      await supabase.from("contact_messages").insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
      });
    }
  }

  await Promise.all([
    sendContactFormNotification(data),
    sendContactFormAcknowledgement({ name: data.name, email: data.email }),
  ]);

  return { success: true, message: "Thanks — your message has been sent. We'll be in touch shortly." };
}
