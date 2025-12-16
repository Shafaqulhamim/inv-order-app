import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });

  // overwrite the cookie with an empty one that expires immediately
  res.cookies.set("session", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return res;
}