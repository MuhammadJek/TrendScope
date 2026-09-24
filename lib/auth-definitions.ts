import * as z from "zod";

// ---------------------------------------------------------------------------
// Password policy
// ---------------------------------------------------------------------------
const passwordSchema = z
  .string()
  .min(8, { message: "Must be at least 8 characters." })
  .regex(/[a-zA-Z]/, { message: "Must contain at least one letter." })
  .regex(/[0-9]/, { message: "Must contain at least one number." })
  .trim();

// ---------------------------------------------------------------------------
// Signup
// ---------------------------------------------------------------------------
export const SignupSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }).trim(),
    email: z.string().email({ message: "Please enter a valid email address." }).trim().toLowerCase(),
    password: passwordSchema,
    confirmPassword: z.string(),
    terms: z.boolean().refine((v) => v === true, {
      message: "You must accept the terms and conditions.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignupInput = z.infer<typeof SignupSchema>;

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
export const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }).trim().toLowerCase(),
  password: z.string().min(1, { message: "Password is required." }),
});

export type LoginInput = z.infer<typeof LoginSchema>;

// ---------------------------------------------------------------------------
// Forgot password
// ---------------------------------------------------------------------------
export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }).trim().toLowerCase(),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

// ---------------------------------------------------------------------------
// Reset password
// ---------------------------------------------------------------------------
export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

// ---------------------------------------------------------------------------
// User types
// ---------------------------------------------------------------------------
export type SessionUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  image?: string | null;
  role: "USER" | "ADMIN";
};

export type AuthFormState =
  | {
      success?: boolean;
      message?: string;
      errors?: Record<string, string[]>;
      values?: Record<string, string | boolean>;
    }
  | undefined;

