import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: { default: "Admin Panel", template: "%s | ApexWork Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        {!isSupabaseConfigured && (
          <div className="flex items-center gap-2 border-b bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800 dark:bg-amber-500/10 dark:text-amber-400">
            <AlertTriangle className="size-3.5 shrink-0" />
            Demo mode — Supabase is not configured, so this admin panel is running on realistic mock data. Connect
            your environment variables to manage live data.
          </div>
        )}
        <div className="flex-1 space-y-6 p-4 sm:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
