import { NextResponse } from "next/server";
// import { cookies, type MutableRequestCookies } from "next/headers";
import { verifyUser } from "@/lib/auth";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json(
            { error: "Email and password required" },
            { status: 400 }
        );
    }

    const session = await verifyUser(email, password);

    if (!session) {
        return NextResponse.json(
            { error: "Invalid credentials" },
            { status: 401 }
        );
    }

    // 1) create the JWT
    const token = jwt.sign(session, JWT_SECRET, { expiresIn: "7d" });

    // 2) build the JSON response
    const res = NextResponse.json({ user: session });

    // 3) attach the cookie to the response
    res.cookies.set("session", token, {
        httpOnly: true,
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // 4) send it back to the browser
    return res;
}