import type { Metadata } from "next";
import { EnquiriesTable } from "@/components/admin/enquiries/enquiries-table";
import { getContactMessages } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Enquiries" };

export default async function AdminEnquiriesPage() {
  const enquiries = await getContactMessages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Enquiries</h1>
        <p className="text-sm text-muted-foreground">Review and respond to messages submitted through the contact form.</p>
      </div>
      <EnquiriesTable initialEnquiries={enquiries} />
    </div>
  );
}
