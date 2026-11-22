import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const API = process.env.NEXT_PUBLIC_API_URL || "https://paraglive-backend.vercel.app";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Sign in with an email address and password, for people without a Google
    // account. Accounts are created on /signup.
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(`${API}/api/users/login`, {
            email: credentials?.email,
            password: credentials?.password,
          });
          const { token, user } = response.data || {};
          if (!token || !user) return null;
          return {
            id: user._id,
            name: [user.firstName, user.lastName].filter(Boolean).join(" "),
            email: user.email,
            image: user.avater,
            credit: user.credit,
            referralCode: user.referralCode,
            accessToken: token,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // `ref` is the referral code from the visitor's ?ref= link (see the
    // wrapper at the bottom of this file).
    async signIn({ user, account, profile, ref }) {
      // Email sign-in already produced the backend token in authorize().
      if (account?.provider === "credentials") return true;

      try {
        // The backend verifies this Google ID token itself. It no longer trusts
        // the email in the body, so the token has to be sent along.
        const response = await axios.post(`${API}/api/users/save`, {
          ...profile,
          id_token: account?.id_token,
          ref,
        });
        user.id = response.data.isExist._id;
        user.credit = response.data.isExist.credit;
        user.referralCode = response.data.isExist.referralCode;
        // The backend JWT. components/utils/api.js reads this.
        user.accessToken = response.data.token;
        return true;
      } catch (error) {
        console.error("Backend sign-in failed:", error?.response?.status);
        return false;
      }
    },
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/",
  },
};

// Hands the referral cookie to the signIn callback above.
export default function auth(req, res) {
  const ref = req.cookies?.ref;
  return NextAuth(req, res, {
    ...authOptions,
    callbacks: {
      ...authOptions.callbacks,
      signIn: (args) => authOptions.callbacks.signIn({ ...args, ref }),
    },
  });
}
