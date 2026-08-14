"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Phone } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/env";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Find Jobs" },
  { href: "/employers", label: "For Employers" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/images/logo.png"
            alt="ApexWork Recruitment"
            width={158}
            height={40}
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {siteConfig.phones.map((phone) => (
            <a
              key={phone.href}
              href={phone.href}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <Phone className="size-4" />
              {phone.display}
            </a>
          ))}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" />}>
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle>
                <Image
                  src="/images/logo.png"
                  alt="ApexWork Recruitment"
                  width={135}
                  height={34}
                  className="h-9 w-auto object-contain"
                />
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1 px-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-base font-medium hover:bg-accent",
                    pathname === link.href ? "bg-accent text-primary" : "text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {siteConfig.phones.map((phone) => (
                <a
                  key={phone.href}
                  href={phone.href}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-base font-medium text-muted-foreground hover:bg-accent"
                >
                  <Phone className="size-4" />
                  {phone.display}
                </a>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
