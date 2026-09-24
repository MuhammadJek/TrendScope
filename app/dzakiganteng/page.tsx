import { redirect } from "next/navigation";
import { isSuperAdmin } from "@/lib/super-admin-auth";
import { SuperAdminLoginForm } from "@/components/super-admin-login-form";
import { Shield } from "lucide-react";

export default async function SuperAdminPage() {
  const authed = await isSuperAdmin();
  if (authed) {
    redirect("/dzakiganteng/users");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-slate-950 dark:text-slate-50">
            Restricted Access
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            This area requires elevated credentials.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <SuperAdminLoginForm />
        </div>
      </div>
    </div>
  );
}

