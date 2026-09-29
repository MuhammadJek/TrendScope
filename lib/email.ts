import { Resend } from "resend";

// Inisialisasi Resend — jika RESEND_API_KEY tidak ada, email dicetak ke console (mode dev)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.EMAIL_FROM ?? "TrendScope <onboarding@resend.dev>";
const APP_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
  if (!resend) {
    // Dev mode: print to console instead of sending
    console.log("\n📧 [DEV EMAIL] ─────────────────────────────");
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:    ${html.replace(/<[^>]+>/g, "").trim()}`);
    console.log("────────────────────────────────────────────\n");
    return;
  }

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });

  if (error) {
    console.error("[Resend] Failed to send email:", error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
}

// ─── Template: Email Verification ────────────────────────────────────────────
export function buildVerificationEmail(name: string, verificationUrl: string): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verifikasi Email — TrendScope</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f766e,#134e4a);padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">TrendScope</p>
              <p style="margin:6px 0 0;font-size:13px;color:#99f6e4;">Market Intelligence Platform</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:600;color:#0f172a;">Halo, ${name}! 👋</h1>
              <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
                Terima kasih telah mendaftar di TrendScope! Untuk mengaktifkan akun Anda,
                klik tombol di bawah ini untuk memverifikasi alamat email Anda.
              </p>
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 28px;">
                    <a href="${verificationUrl}"
                       style="display:inline-block;background:#0f766e;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:10px;">
                      ✅ Verifikasi Email Saya
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 16px;font-size:13px;color:#94a3b8;line-height:1.5;">
                Tombol tidak berfungsi? Salin dan tempel link ini di browser Anda:
              </p>
              <p style="margin:0 0 24px;word-break:break-all;">
                <a href="${verificationUrl}" style="font-size:12px;color:#0f766e;">${verificationUrl}</a>
              </p>
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 24px;" />
              <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.5;">
                Link verifikasi ini akan kadaluarsa dalam <strong>24 jam</strong>.
                Jika Anda tidak mendaftar di TrendScope, abaikan email ini.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                © ${new Date().getFullYear()} TrendScope. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export { APP_URL };
