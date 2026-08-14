"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminCreateUserSchema, adminUserSchema, type AdminCreateUserValues, type AdminUserValues } from "@/lib/validations/admin-user";
import type { AdminUserRow } from "@/lib/mock-data";
import { createAdminUser, updateAdminUser } from "@/app/admin/users/actions";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

function createDefaults(defaultRole?: AdminUserRow["role"]): AdminCreateUserValues {
  return {
    fullName: "",
    email: "",
    phone: "",
    role: defaultRole ?? "candidate",
    status: "active",
    passwordMode: "invite",
    password: "",
    companyName: "",
  };
}

function editDefaults(user: AdminUserRow): AdminUserValues {
  return { fullName: user.full_name, email: user.email, role: user.role, status: user.status };
}

export function UserFormDialog({
  trigger,
  user,
  defaultRole,
  open: openProp,
  onOpenChange,
  onSaved,
}: {
  trigger?: React.ReactElement;
  user?: AdminUserRow;
  defaultRole?: AdminUserRow["role"];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSaved?: () => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  const [isPending, startTransition] = React.useTransition();
  const [tempPassword, setTempPassword] = React.useState<string | null>(null);

  const createForm = useForm<AdminCreateUserValues>({
    resolver: zodResolver(adminCreateUserSchema),
    defaultValues: createDefaults(defaultRole),
  });
  const editForm = useForm<AdminUserValues>({
    resolver: zodResolver(adminUserSchema),
    defaultValues: user ? editDefaults(user) : undefined,
  });

  const createValues = createForm.watch();
  const editValues = editForm.watch();

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setTempPassword(null);
      if (user) editForm.reset(editDefaults(user));
      else createForm.reset(createDefaults(defaultRole));
    }
  }

  function onCreateSubmit(values: AdminCreateUserValues) {
    startTransition(async () => {
      const result = await createAdminUser(values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      onSaved?.();
      if (result.data?.tempPassword) {
        setTempPassword(result.data.tempPassword);
      } else {
        setOpen(false);
      }
    });
  }

  function onEditSubmit(values: AdminUserValues) {
    if (!user) return;
    startTransition(async () => {
      const result = await updateAdminUser(user.id, values);
      if (result.success) {
        toast.success(result.message);
        onSaved?.();
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  }

  const formId = `user-form-${user?.id ?? "new"}`;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="sm:max-w-lg">
        {tempPassword ? (
          <>
            <DialogHeader>
              <DialogTitle>Account created</DialogTitle>
              <DialogDescription>
                Share this temporary password with the user securely — it will not be shown again.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/40 p-4">
              <code className="text-sm font-medium">{tempPassword}</code>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Copy password"
                onClick={() => {
                  navigator.clipboard.writeText(tempPassword);
                  toast.success("Password copied to clipboard.");
                }}
              >
                <Copy className="size-4" />
              </Button>
            </div>
            <DialogFooter>
              <Button type="button" onClick={() => setOpen(false)}>
                Done
              </Button>
            </DialogFooter>
          </>
        ) : user ? (
          <>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update this account&apos;s details.</DialogDescription>
            </DialogHeader>
            <form id={formId} onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <Field label="Full Name" error={editForm.formState.errors.fullName?.message}>
                <Input {...editForm.register("fullName")} placeholder="e.g. Jane Doe" />
              </Field>
              <Field label="Email" error={editForm.formState.errors.email?.message}>
                <Input type="email" {...editForm.register("email")} placeholder="jane@example.com" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Role" error={editForm.formState.errors.role?.message}>
                  <Select value={editValues.role} onValueChange={(v) => editForm.setValue("role", v as AdminUserValues["role"], { shouldValidate: true })}>
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
                <Field label="Status" error={editForm.formState.errors.status?.message}>
                  <Select value={editValues.status} onValueChange={(v) => editForm.setValue("status", v as AdminUserValues["status"], { shouldValidate: true })}>
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
              <Button type="submit" form={formId} disabled={isPending}>
                Save Changes
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a real, login-capable account on the platform.</DialogDescription>
            </DialogHeader>
            <form id={formId} onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
              <Field label="Full Name" error={createForm.formState.errors.fullName?.message}>
                <Input {...createForm.register("fullName")} placeholder="e.g. Jane Doe" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Email" error={createForm.formState.errors.email?.message}>
                  <Input type="email" {...createForm.register("email")} placeholder="jane@example.com" />
                </Field>
                <Field label="Phone (optional)" error={createForm.formState.errors.phone?.message}>
                  <Input {...createForm.register("phone")} placeholder="+44 7700 900000" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Role" error={createForm.formState.errors.role?.message}>
                  <Select
                    value={createValues.role}
                    onValueChange={(v) => createForm.setValue("role", v as AdminCreateUserValues["role"], { shouldValidate: true })}
                  >
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
                <Field label="Status" error={createForm.formState.errors.status?.message}>
                  <Select
                    value={createValues.status}
                    onValueChange={(v) => createForm.setValue("status", v as AdminCreateUserValues["status"], { shouldValidate: true })}
                  >
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
              {createValues.role === "employer" && (
                <Field label="Company Name" error={createForm.formState.errors.companyName?.message}>
                  <Input {...createForm.register("companyName")} placeholder="e.g. Huntingdon Care Partners" />
                </Field>
              )}
              <Field label="Account Setup">
                <Select
                  value={createValues.passwordMode}
                  onValueChange={(v) => createForm.setValue("passwordMode", v as AdminCreateUserValues["passwordMode"], { shouldValidate: true })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invite">Email an invite link</SelectItem>
                    <SelectItem value="generate">Generate a temporary password</SelectItem>
                    <SelectItem value="set">Set a specific password</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              {createValues.passwordMode === "set" && (
                <Field label="Password" error={createForm.formState.errors.password?.message}>
                  <Input type="password" {...createForm.register("password")} placeholder="At least 8 characters" />
                </Field>
              )}
            </form>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" form={formId} disabled={isPending}>
                Create User
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
