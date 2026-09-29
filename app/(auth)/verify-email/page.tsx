import { CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { verifyEmailAction } from "@/lib/auth-actions";
import { EmailVerificationNotice } from "@/components/auth/email-verification-notice";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify email | TrendScope",
  description: "Verify your TrendScope account email address.",
};

export default async function VerifyEmailPage({ searchParams }: PageProps<"/verify-email">) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : null;
  const email = typeof params.email === "string" ? params.email : null;

  // No token — show a "check your inbox" holding page
  if (!token) {
    return (
      <AuthLayout
        heading="Cek inbox email Anda"
        description="Kami mengirimkan link verifikasi ke alamat email Anda."
        footer={
          <Link href="/login" className="font-medium text-teal-600 hover:underline dark:text-teal-400">
            Kembali ke halaman login
          </Link>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-teal-100 dark:bg-teal-950">
              <CheckCircle2 className="h-7 w-7 text-teal-600 dark:text-teal-400" aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">Email verifikasi terkirim!</p>
              {email && (
                <p className="mt-1 text-sm text-slate-500">
                  Link dikirim ke <strong>{email}</strong>
                </p>
              )}
            </div>
          </div>
          {email && <EmailVerificationNotice email={email} />}
          <p className="text-xs text-slate-400 text-center">
            Tidak menemukan email? Cek folder Spam atau klik "Kirim ulang" di atas.
          </p>
          <Button href="/login" variant="secondary" className="w-full">
            Kembali ke Login
          </Button>
        </div>
      </AuthLayout>
    );
  }

  // Consume the token server-side
  const result = await verifyEmailAction(token);

  // Redirect to login with success flag on success
  if (result?.success) {
    redirect(`/login?emailVerified=true`);
  }


  // Invalid or expired token
  return (
    <AuthLayout
      heading="Verification failed"
      description="This verification link is invalid or has expired."
      footer={
        <Link href="/login" className="font-medium text-teal-600 hover:underline dark:text-teal-400">
          Back to sign in
        </Link>
      }
    >
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-rose-100 dark:bg-rose-950">
          <AlertCircle className="h-6 w-6 text-rose-600 dark:text-rose-400" aria-hidden="true" />
        </span>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {result?.message ?? "This link is no longer valid. Please request a new verification email."}
        </p>
        {email && <EmailVerificationNotice email={email} />}
      </div>
    </AuthLayout>
  );
}

