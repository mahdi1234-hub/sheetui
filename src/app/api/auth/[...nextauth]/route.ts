import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Ensure NEXTAUTH_URL has no trailing newline
if (process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL.trim();
}
if (process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET.trim();
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
