"use client";

import { LogOut } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ButtonSpinner } from "@/components/auth/auth-loading-state";

type ConfirmLogoutDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
};

export function ConfirmLogoutDialog({
  open,
  onClose,
  onConfirm,
  loading,
}: ConfirmLogoutDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Sign out"
      description="Are you sure you want to sign out of your TrendScope account?"
    >
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={onConfirm}
          disabled={loading}
          className="bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600"
        >
          {loading ? (
            <>
              <ButtonSpinner />
              Signing out…
            </>
          ) : (
            <>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </>
          )}
        </Button>
      </div>
    </Dialog>
  );
}

