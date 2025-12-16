import bcrypt from "bcrypt";
import "dotenv/config"; // load .env / .env.local
import { Pool } from "pg";

// 1) connect to the same DB as the app
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    // helper to hash a password
    const hash = (password: string) => bcrypt.hash(password, 10);

    // helper to create/update a user
    async function upsertUser(
        email: string,
        name: string,
        role: "MANAGER" | "EMPLOYEE" | "PURCHASER",
        password: string
    ) {
        const passwordHash = await hash(password);

        await pool.query(
            `
      INSERT INTO users (email, name, role, password_hash)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email)
      DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role
      `,
            [email, name, role, passwordHash]
        );
    }

    console.log("Seeding users...");

    // 2) create three demo users
    await upsertUser("manager@example.com", "Manager One", "MANAGER", "Passw0rd!");
    await upsertUser("employee@example.com", "Employee One", "EMPLOYEE", "Passw0rd!");
    await upsertUser("purchaser@example.com", "Purchaser One", "PURCHASER", "Passw0rd!");

    console.log("Seeding items...");

    // 3) create some sample items
    await pool.query(
        `
    INSERT INTO items (sku, name, unit, cost, in_stock)
    VALUES
      ('SKU-001', 'Blue Pen', 'pcs', 0.50, 100),
      ('SKU-002', 'Notebook A5', 'pcs', 2.10, 50),
      ('SKU-003', 'Packing Tape', 'roll', 1.30, 20)
    ON CONFLICT (sku) DO NOTHING;
    `
    );

    console.log("Seed complete");
}

main()
    .catch((err) => {
        console.error("Seed error:", err);
    })
    .finally(async () => {
        await pool.end();
    });
