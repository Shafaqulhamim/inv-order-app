import type { Session } from "@/lib/auth";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getSession(): Promise<Session | null> {
  // in your Next.js version, cookies() is typed as async
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET) as Session;
  } catch {
    return null;
  }
}

// export async function signOut(): Promise<void> {
//   const cookieStore = await cookies();
//   cookieStore.set("session", "", {
//     httpOnly: true,
//     path: "/",
//     maxAge: 0, // expire immediately
//   });
// }