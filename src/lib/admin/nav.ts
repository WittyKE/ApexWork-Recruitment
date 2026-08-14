import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  ClipboardList,
  MessagesSquare,
  BarChart3,
  ScrollText,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Employers", href: "/admin/employers", icon: Building2 },
  { title: "Jobs", href: "/admin/jobs", icon: Briefcase },
  { title: "Applications", href: "/admin/applications", icon: ClipboardList },
  { title: "Enquiries", href: "/admin/enquiries", icon: MessagesSquare },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Audit Logs", href: "/admin/logs", icon: ScrollText },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];
