import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validations/auth";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Zod Validation (Murphy's Law: Don't trust input)
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new Error("Invalid credentials format");
        }

        const { email, password } = parsed.data;

        // 2. Query Neon via Prisma
        const user = await prisma.user.findUnique({
          where: { email }
        });

        // 3. Postel's Law: Do not leak whether the email exists.
        if (!user) {
          throw new Error("Invalid email or password");
        }

        // 4. Safely check password using bcryptjs.compare()
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          // Postel's Law: Same generic error for wrong password
          throw new Error("Invalid email or password");
        }

        return { id: user.id, email: user.email, name: user.name };
      }
    })
  ],
  session: {
    // Engineering Justification: For a standalone authentication layer and a Credentials provider, 
    // JWT is stateless and requires fewer DB queries per request compared to database sessions,
    // reducing load on Neon Postgres while maintaining strong security.
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
