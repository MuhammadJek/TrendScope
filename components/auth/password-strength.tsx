import { cn } from "@/lib/utils";

type Strength = "none" | "weak" | "fair" | "strong" | "very-strong";

function getStrength(password: string): Strength {
  if (!password) return "none";
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return "weak";
  if (score === 2) return "fair";
  if (score === 3) return "strong";
  return "very-strong";
}

const strengthConfig: Record<
  Exclude<Strength, "none">,
  { label: string; segments: number; color: string }
> = {
  weak: { label: "Weak", segments: 1, color: "bg-rose-500" },
  fair: { label: "Fair", segments: 2, color: "bg-amber-500" },
  strong: { label: "Strong", segments: 3, color: "bg-teal-500" },
  "very-strong": { label: "Very strong", segments: 4, color: "bg-teal-600" },
};

type PasswordStrengthProps = {
  password: string;
};

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = getStrength(password);
  if (strength === "none") return null;
  const config = strengthConfig[strength];

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1" role="presentation" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i < config.segments ? config.color : "bg-slate-200 dark:bg-slate-800"
            )}
          />
        ))}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Strength: <span className="font-medium text-slate-700 dark:text-slate-300">{config.label}</span>
      </p>
    </div>
  );
}

