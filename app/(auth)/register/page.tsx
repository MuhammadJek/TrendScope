import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create account | TrendScope",
  description: "Start exploring product trends and market intelligence.",
};

export default async function RegisterPage() {
  const session = await auth();

  // Redirect authenticated users away
  if (session?.user) redirect("/dashboard");

  return (
    <AuthLayout
      heading="Create your account"
      description="Start exploring product trends and market intelligence."
      footer={
        <span>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-teal-600 hover:underline dark:text-teal-400"
          >
            Sign in
          </Link>
        </span>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}

