import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";
import type { SessionUser } from "@/lib/auth-definitions";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        // Fetch from real DB
        const user = await prisma.user.findUnique({
          where: { email }
        });
        
        if (!user) return null;

        const passwordMatch = await compare(password, user.passwordHash);
        if (!passwordMatch) return null;

        // Return the object that will be stored in the JWT
        const sessionUser: SessionUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          // Ignoring emailVerified type mismatch
          emailVerified: user.emailVerified as any,
          createdAt: user.createdAt.toISOString(),
          image: user.image ?? null,
          role: user.role as any,
        };

        return sessionUser;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. Saat pertama kali login (user object ada)
      if (user) {
        const su = user as unknown as SessionUser;
        token.id = su.id;
        token.emailVerified = su.emailVerified ?? false;
        token.createdAt = su.createdAt ?? new Date().toISOString();
        token.role = su.role ?? "USER";
        return token;
      }

      // 2. Pada request selanjutnya, cek apakah user masih ada di DB
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true, emailVerified: true },
        });

        // Jika user tidak ditemukan di database (sudah dihapus)
        if (!dbUser) {
          token.isDeleted = true;
          return token;
        }

        // Jika masih ada, update role dan status verifikasi (berjaga-jaga jika diubah admin)
        token.role = dbUser.role;
        token.emailVerified = dbUser.emailVerified;
      }

      return token;
    },
    async session({ session, token }) {
      // Jika user sudah ditandai terhapus di JWT, kosongkan session
      if (token.isDeleted) {
        // Return session kosong akan membuat user dianggap tidak login
        return {} as any;
      }

      if (token && session.user) {
        const sessionUser = session.user as unknown as SessionUser;
        sessionUser.id = token.id as string;
        sessionUser.emailVerified = token.emailVerified as boolean;
        sessionUser.createdAt = token.createdAt as string;
        sessionUser.role = (token.role as "USER" | "ADMIN" | "SUPER_ADMIN" | "PRO_USER" | "FREE_USER") ?? "USER";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  // Auth.js v5 handles CSRF automatically via the JWT strategy
  trustHost: true,
});
