"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminUserSchema, type AdminUserValues } from "@/lib/validations/admin-user";
import type { AdminUserRow } from "@/lib/mock-data";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

/**
 * Two usage modes:
 * - Uncontrolled: pass `trigger` (e.g. an "Add New User" button) and the dialog manages its own open state.
 * - Controlled: pass `open` + `onOpenChange` (e.g. triggered from a row's dropdown menu item) and omit `trigger`.
 */
export function UserFormDialog({
  trigger,
  user,
  onSave,
  open: openProp,
  onOpenChange,
}: {
  trigger?: React.ReactElement;
  user?: AdminUserRow;
  onSave: (values: AdminUserValues) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AdminUserValues>({
    resolver: zodResolver(adminUserSchema),
    defaultValues: user
      ? { fullName: user.full_name, email: user.email, role: user.role, status: user.status }
      : { fullName: "", email: "", role: "candidate", status: "active" },
  });

  const role = watch("role");
  const status = watch("status");

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      reset(user ? { fullName: user.full_name, email: user.email, role: user.role, status: user.status } : undefined);
    }
  }

  function onSubmit(values: AdminUserValues) {
    onSave(values);
    setOpen(false);
    if (!user) reset();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {user ? "Update this user's details and permissions." : "Create a new user account for the platform."}
          </DialogDescription>
        </DialogHeader>
        <form id={`user-form-${user?.id ?? "new"}`} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Full Name" error={errors.fullName?.message}>
            <Input {...register("fullName")} placeholder="Jane Doe" />
          </Field>
          <Field label="Email Address" error={errors.email?.message}>
            <Input {...register("email")} type="email" placeholder="jane@example.com" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Role" error={errors.role?.message}>
              <Select value={role} onValueChange={(v) => setValue("role", v as AdminUserValues["role"], { shouldValidate: true })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="candidate">Candidate</SelectItem>
                  <SelectItem value="employer">Employer</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Status" error={errors.status?.message}>
              <Select value={status} onValueChange={(v) => setValue("status", v as AdminUserValues["status"], { shouldValidate: true })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" form={`user-form-${user?.id ?? "new"}`}>
            {user ? "Save Changes" : "Create User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
