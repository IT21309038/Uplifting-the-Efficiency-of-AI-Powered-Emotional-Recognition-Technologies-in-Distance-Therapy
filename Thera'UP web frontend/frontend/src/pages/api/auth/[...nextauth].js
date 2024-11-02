import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { randomUUID, randomBytes } from "crypto";

import apiDefinitions from "@/api/apiDefinitions";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { username, password } = credentials;

        const payload = {
          email: username,
          password: password,
        };

        try {
          const res = await apiDefinitions.loginAuth(payload);
          console.log("Response from loginAuth:", res);
          if (res.status === 200) {
            const user = res.data.data;
            return user;
          } else {
            throw new Error(res.data.message || "Login failed");
          }
        } catch (error) {
          console.error("Error during authorization:", error);
          throw new Error(error.response?.data?.message || error.message);
        }
      },
    }),
  ],

  pages: {
    signIn: "/auth/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
    generateSessionToken: () => {
      return randomUUID?.() ?? randomBytes(32).toString("hex");
    },
  },

  jwt: {
    secret: process.env.JWT_SECRET,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.full_name = user.full_name;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        full_name: token.full_name,
        first_name: token.first_name,
        last_name: token.last_name,
        email: token.email,
        role: token.role,
      };
      return session;
    },
  },
};

export default NextAuth(authOptions);
