import bcrypt from "bcrypt";
import { pool } from "./db";

export type Role = "MANAGER" | "EMPLOYEE" | "PURCHASER";

export type Session = {
    id: string;
    email: string;
    role: Role;
    name: string;
};

// verifies user credentials and returns a session object or null
export async function verifyUser(
    email: string,
    password: string
): Promise<Session | null> {
    const { rows } = await pool.query(
        "SELECT id, email, name, role, password_hash FROM users WHERE email = $1 LIMIT 1",
        [email]
    );

    const user = rows[0];
    if (!user) return null;

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return null;

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    };
}
