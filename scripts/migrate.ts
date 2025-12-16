import "dotenv/config"; // loads .env / .env.local
import { readFileSync } from "fs";
import { resolve } from "path";
import { Pool } from "pg";

(async () => {
    // 1) read the SQL file as a string
    const sqlPath = resolve("sql/001_init.sql");
    const sql = readFileSync(sqlPath, "utf8");

    // 2) connect to PostgreSQL using DATABASE_URL
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        // 3) run the SQL (create tables, types, indexes)
        await pool.query(sql);
        console.log("Migration complete (tables created)");
    } catch (e) {
        console.error("Migration failed:", e);
        process.exitCode = 1;
    } finally {
        // 4) close database connection
        await pool.end();
    }
})();
