import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in | TrendScope",
  description: "Sign in to continue exploring market intelligence.",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const session = await auth();

  // Redirect authenticated users away from the login page
  if (session?.user) {
    const callbackUrl =
      typeof params.callbackUrl === "string" && params.callbackUrl.startsWith("/")
        ? params.callbackUrl
        : "/dashboard";
    redirect(callbackUrl);
  }

  const callbackUrl =
    typeof params.callbackUrl === "string" ? params.callbackUrl : undefined;

  const passwordReset = params.passwordReset === "true";
  const registered = params.registered === "true";

  return (
    <AuthLayout
      heading="Welcome back"
      description="Sign in to continue exploring market intelligence."
      footer={
        <span>
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-teal-600 hover:underline dark:text-teal-400"
          >
            Create one
          </Link>
        </span>
      }
    >
      {/* Success messages from other flows */}
      {passwordReset && (
        <div className="mb-5 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-700 dark:border-teal-900/50 dark:bg-teal-950/20 dark:text-teal-400">
          Password reset successfully. Sign in with your new password.
        </div>
      )}
      {registered && (
        <div className="mb-5 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-700 dark:border-teal-900/50 dark:bg-teal-950/20 dark:text-teal-400">
          Account created! Sign in to get started.
        </div>
      )}

      <LoginForm callbackUrl={callbackUrl} />
    </AuthLayout>
  );
}

