"use client";

import * as React from "react";
import { toast } from "sonner";
import { Copy, KeyRound, RefreshCw, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/env";

export function SettingsView() {
  const [twoFactor, setTwoFactor] = React.useState(false);
  const [notifications, setNotifications] = React.useState({
    newApplications: true,
    newJobPostings: true,
    weeklyDigest: false,
    securityAlerts: true,
  });

  function save(section: string) {
    toast.success(`${section} settings saved.`);
  }

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="api">API Keys &amp; Integrations</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Platform-wide details shown to candidates and employers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Company Name</Label>
                <Input defaultValue={siteConfig.name} />
              </div>
              <div className="space-y-1.5">
                <Label>Support Email</Label>
                <Input defaultValue={siteConfig.email} />
              </div>
              <div className="space-y-1.5">
                <Label>Phone Number</Label>
                <Input defaultValue={siteConfig.phone.display} />
              </div>
              <div className="space-y-1.5">
                <Label>Office Address</Label>
                <Input defaultValue={siteConfig.address.full} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end border-t pt-6">
            <Button onClick={() => save("General")}>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Update Password</CardTitle>
            <CardDescription>Choose a strong password you don&apos;t use elsewhere.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Current Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-1.5">
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end border-t pt-6">
            <Button onClick={() => save("Password")}>Update Password</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Two-Factor Authentication</CardTitle>
            <CardDescription>Add an extra layer of security to your admin account.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className={`size-5 ${twoFactor ? "text-emerald-500" : "text-muted-foreground"}`} />
                <div>
                  <p className="font-medium">{twoFactor ? "2FA is enabled" : "2FA is disabled"}</p>
                  <p className="text-sm text-muted-foreground">Require an authenticator code when signing in.</p>
                </div>
              </div>
              <Switch
                checked={twoFactor}
                onCheckedChange={(c) => {
                  setTwoFactor(c);
                  toast.success(c ? "Two-factor authentication enabled." : "Two-factor authentication disabled.");
                }}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose what you get notified about.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <NotificationRow
              label="New Applications"
              description="Get notified when a candidate applies to a job."
              checked={notifications.newApplications}
              onCheckedChange={(c) => setNotifications((prev) => ({ ...prev, newApplications: c }))}
            />
            <Separator />
            <NotificationRow
              label="New Job Postings"
              description="Get notified when an employer posts a new job."
              checked={notifications.newJobPostings}
              onCheckedChange={(c) => setNotifications((prev) => ({ ...prev, newJobPostings: c }))}
            />
            <Separator />
            <NotificationRow
              label="Weekly Digest"
              description="A weekly summary of platform activity."
              checked={notifications.weeklyDigest}
              onCheckedChange={(c) => setNotifications((prev) => ({ ...prev, weeklyDigest: c }))}
            />
            <Separator />
            <NotificationRow
              label="Security Alerts"
              description="Failed logins, permission changes and suspicious activity."
              checked={notifications.securityAlerts}
              onCheckedChange={(c) => setNotifications((prev) => ({ ...prev, securityAlerts: c }))}
            />
          </CardContent>
          <CardFooter className="justify-end border-t pt-6">
            <Button onClick={() => save("Notification")}>Save Preferences</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="api" className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Used for server-to-server integrations. Keep these secret.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ApiKeyRow label="Live Secret Key" value="sk_live_••••••••••••••••••••4f2a" />
            <ApiKeyRow label="Public Key" value="pk_live_••••••••••••••••••••9c3d" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>Connected services powering the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <IntegrationRow name="Supabase" description="Database, Auth & Storage" connected />
            <IntegrationRow name="Resend" description="Transactional email delivery" connected />
            <IntegrationRow name="Google Maps" description="Office location embed" connected />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function NotificationRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function ApiKeyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <code className="text-xs text-muted-foreground">{value}</code>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Copy key"
          onClick={() => toast.success(`${label} copied to clipboard.`)}
        >
          <Copy className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Regenerate key"
          onClick={() => toast.success(`${label} regenerated.`)}
        >
          <RefreshCw className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function IntegrationRow({ name, description, connected }: { name: string; description: string; connected: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <KeyRound className="size-4" />
        </div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
        {connected ? "Connected" : "Not Connected"}
      </Badge>
    </div>
  );
}
