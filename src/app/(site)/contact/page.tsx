import type { Metadata } from "next";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/site/contact-form";
import { siteConfig } from "@/lib/env";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with ApexWork Recruitment. Visit us at Ermine Business Park, Huntingdon, or call +44 744 636 4856.",
};

const mapQuery = encodeURIComponent(siteConfig.address.full);

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Contact Us</h1>
        <p className="mt-4 text-muted-foreground">
          Whether you&apos;re a candidate or an employer, our team in Huntingdon is ready to help.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold">Send us a message</h2>
              <p className="mt-1 text-sm text-muted-foreground">We typically respond within one business day.</p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Office Address</p>
                  <p className="text-sm text-muted-foreground">{siteConfig.address.full}</p>
                </div>
              </div>
              <a href={siteConfig.phone.href} className="flex items-start gap-3 hover:text-primary">
                <Phone className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{siteConfig.phone.display}</p>
                </div>
              </a>
              <a href={`mailto:${siteConfig.email}`} className="flex items-start gap-3 hover:text-primary">
                <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{siteConfig.email}</p>
                </div>
              </a>
            </CardContent>
          </Card>

          <Card className="overflow-hidden py-0">
            <div className="relative h-48 w-full">
              <Image src="/images/office-location.jpg" alt="ApexWork Recruitment office exterior" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
            <div className="aspect-video w-full">
              <iframe
                title="ApexWork Recruitment location map"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
