import type { ReactNode } from "react";

// Auth route group layout — no sidebar or app shell
// Pages in (auth) group: /login, /register, /forgot-password, /reset-password, /verify-email
export default function AuthGroupLayout({ children }: { children: ReactNode }) {
  return children;
}

