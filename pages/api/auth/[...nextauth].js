import axios from "axios";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      await axios
        .post("  https://paraglive-backend.vercel.app/api/users/save", profile)

        .then((response) => {
          user.id = response.data.isExist._id;
          user.credit = response.data.isExist.credit;
          user.referralCode = response.data.isExist.referralCode;
          // The backend JWT. Google sign-in previously produced no backend
          // credential at all, which is why write endpoints had to be left
          // unauthenticated. components/utils/api.js reads this.
          user.accessToken = response.data.token;
        });
      return true;
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

export default NextAuth(authOptions);
