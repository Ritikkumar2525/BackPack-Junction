import NextAuth, { CredentialsSignin } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

class InvalidCredentials extends CredentialsSignin {
  constructor(message) {
    super();
    this.code = message;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new InvalidCredentials("Email and password are required");
        }

        await connectDB();
        const email = credentials.email.trim().toLowerCase();
        const user = await User.findOne({ email });
        if (!user) {
          throw new InvalidCredentials("No account found with this email");
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new InvalidCredentials("Invalid password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone || null,
          role: user.role || "user",
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/signup",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8),
            phone: "0000000000",
            role: user.email === 'junctionbackpack@gmail.com' ? 'admin' : 'user',
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
        token.role = user.email === 'junctionbackpack@gmail.com' ? 'admin' : (user.role || "user");
      }
      
      // Always fetch latest role from DB
      if (token.email) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) {
            token.role = dbUser.email === 'junctionbackpack@gmail.com' ? 'admin' : (dbUser.role || "user");
            token.id = dbUser._id.toString();
          }
        } catch (error) {
          console.error("Error fetching dbUser in jwt callback:", error);
        }
      }
      
      // HARDCODE OVERRIDE JUST IN CASE
      if (token.email === 'junctionbackpack@gmail.com') {
        token.role = 'admin';
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.phone = token.phone;
        session.user.role = token.role;
      }
      
      // HARDCODE OVERRIDE JUST IN CASE
      if (session.user.email === 'junctionbackpack@gmail.com') {
        session.user.role = 'admin';
      }
      
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
});
