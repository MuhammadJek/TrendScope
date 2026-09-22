"use client";

import { useActionState, useState } from "react";
import { Trash2 } from "lucide-react";
import { updateProfileAction, changePasswordAction, deleteAccountAction } from "@/lib/auth-actions";
import { AuthErrorMessage, FieldError } from "@/components/auth/auth-error-message";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrength } from "@/components/auth/password-strength";
import { ButtonSpinner } from "@/components/auth/auth-loading-state";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { SessionUser } from "@/lib/auth-definitions";

// ---------------------------------------------------------------------------
// Edit Profile Form
// ---------------------------------------------------------------------------
export function EditProfileForm({ user }: { user: SessionUser }) {
  const boundAction = updateProfileAction.bind(null, user.email);
  const [state, action, pending] = useActionState(boundAction, undefined);

  return (
    <form action={action} noValidate className="space-y-4">
      {state?.message && !state.success && <AuthErrorMessage message={state.message} />}
      {state?.success && (
        <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-700 dark:border-teal-900/50 dark:bg-teal-950/20 dark:text-teal-400">
          {state.message}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={(state?.values?.name as string) ?? user.name}
          required
          aria-invalid={!!state?.errors?.name}
        />
        <FieldError message={state?.errors?.name} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email-display">Email address</Label>
        <Input
          id="email-display"
          value={user.email}
          readOnly
          disabled
          className="cursor-not-allowed opacity-60"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Email cannot be changed in the prototype.
        </p>
      </div>

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? <><ButtonSpinner /> Saving…</> : "Save profile"}
      </Button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Change Password Form
// ---------------------------------------------------------------------------
export function ChangePasswordForm({ email }: { email: string }) {
  const boundAction = changePasswordAction.bind(null, email);
  const [state, action, pending] = useActionState(boundAction, undefined);
  const [newPassword, setNewPassword] = useState("");

  return (
    <form action={action} noValidate className="space-y-4">
      {state?.message && !state.success && <AuthErrorMessage message={state.message} />}
      {state?.success && (
        <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-700 dark:border-teal-900/50 dark:bg-teal-950/20 dark:text-teal-400">
          {state.message}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="currentPassword">Current password</Label>
        <PasswordInput id="currentPassword" name="currentPassword" autoComplete="current-password" placeholder="••••••••" />
        <FieldError message={state?.errors?.currentPassword} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="newPassword">New password</Label>
        <PasswordInput
          id="newPassword"
          name="newPassword"
          autoComplete="new-password"
          placeholder="••••••••"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <PasswordStrength password={newPassword} />
        <FieldError message={state?.errors?.newPassword} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <PasswordInput id="confirmPassword" name="confirmPassword" autoComplete="new-password" placeholder="••••••••" />
        <FieldError message={state?.errors?.confirmPassword} />
      </div>

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? <><ButtonSpinner /> Updating…</> : "Update password"}
      </Button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Delete Account Section
// ---------------------------------------------------------------------------
export function DeleteAccountSection({ email }: { email: string }) {
  const [showDialog, setShowDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await deleteAccountAction(email);
  }

  return (
    <>
      <Card className="border-rose-200 dark:border-rose-900/50">
        <CardHeader>
          <CardTitle className="text-rose-700 dark:text-rose-400">Delete account</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            onClick={() => setShowDialog(true)}
            className="bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete my account
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        title="Delete account"
        description="This will permanently delete your account and all your data. This cannot be undone."
      >
        <div className="flex justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={() => setShowDialog(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="bg-rose-600 text-white hover:bg-rose-700"
          >
            {deleting ? <><ButtonSpinner /> Deleting…</> : <><Trash2 className="h-4 w-4" /> Yes, delete account</>}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
