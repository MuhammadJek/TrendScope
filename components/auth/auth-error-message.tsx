import { AlertCircle } from "lucide-react";

type AuthErrorMessageProps = {
  message: string;
  id?: string;
};

export function AuthErrorMessage({ message, id }: AuthErrorMessageProps) {
  return (
    <div
      id={id}
      role="alert"
      aria-live="polite"
      className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

type FieldErrorProps = {
  message?: string | string[];
  id?: string;
};

export function FieldError({ message, id }: FieldErrorProps) {
  if (!message) return null;
  const text = Array.isArray(message) ? message[0] : message;
  return (
    <p id={id} role="alert" className="mt-1 text-xs text-rose-600 dark:text-rose-400">
      {text}
    </p>
  );
}

