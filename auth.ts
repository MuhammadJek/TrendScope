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
    async jwt({ token, user }) {
      if (user) {
        const su = user as unknown as SessionUser;
        token.id = su.id;
        token.emailVerified = su.emailVerified ?? false;
        token.createdAt = su.createdAt ?? new Date().toISOString();
        token.role = su.role ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
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
  trustHost: true,
});
