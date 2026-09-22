import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { getUserByEmail } from "@/lib/auth-store";
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

        // TODO: replace with real DB lookup
        const user = getUserByEmail(email);
        if (!user) return null;

        const passwordMatch = await compare(password, user.passwordHash);
        if (!passwordMatch) return null;

        // Return the object that will be stored in the JWT
        const sessionUser: SessionUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          image: user.image ?? null,
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
        // user is defined only on initial sign-in
        const su = user as unknown as SessionUser;
        token.id = su.id;
        token.emailVerified = su.emailVerified ?? false;
        token.createdAt = su.createdAt ?? new Date().toISOString();
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as unknown as SessionUser).id = token.id as string;
        (session.user as unknown as SessionUser).emailVerified = token.emailVerified as boolean;
        (session.user as unknown as SessionUser).createdAt = token.createdAt as string;
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
