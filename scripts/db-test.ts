import { pool } from "../src/lib/db";

(async () => {
  try {
    const { rows } = await pool.query("SELECT 1 as ok");
    console.log("DB OK:", rows[0]);
  } catch (err) {
    console.error("DB ERROR:", err);
  } finally {
    await pool.end();
  }
})();
