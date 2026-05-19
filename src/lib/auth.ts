import { NextAuthOptions } from "next-auth";
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
                const parsed = loginSchema.safeParse(credentials);
                if (!parsed.success) {
                    throw new Error("Invalid credentials format");
                }

                const { email, password } = parsed.data;

                const user = await prisma.user.findUnique({
                    where: { email }
                });

                if (!user) {
                    throw new Error("Invalid email or password");
                }

                const passwordsMatch = await bcrypt.compare(password, user.password);

                if (!passwordsMatch) {
                    throw new Error("Invalid email or password");
                }

                return { id: user.id, email: user.email, name: user.name, emailVerified: user.emailVerified };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.emailVerified = user.emailVerified;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.emailVerified = token.emailVerified as Date | null;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
