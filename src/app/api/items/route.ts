import { pool } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Create item request validation based on YOUR DB schema:
 * items(id uuid, sku text, name text, description text, unit text, cost numeric(12,2), in_stock int, active bool)
 */
const CreateItemSchema = z.object({
    sku: z.string().trim().min(1, "SKU is required").max(60, "SKU is too long"),
    name: z.string().trim().min(1, "Name is required").max(120, "Name is too long"),
    description: z
        .string()
        .trim()
        .max(500, "Description is too long")
        .optional()
        .nullable(),
    unit: z.string().trim().min(1, "Unit is required").max(40, "Unit is too long"),

    // numeric(12,2) -> allow strings or numbers, convert to number, ensure >= 0
    cost: z.coerce.number().min(0, "Cost must be 0 or more"),

    // integer -> allow "10" then coerce to number and force integer >= 0
    in_stock: z.coerce.number().int().min(0, "in_stock must be 0 or more"),

    // default true if not provided
    active: z.boolean().optional().default(true),
});

/**
 * GET /api/items
 * - Any logged-in user can view items
 * - Optional query: ?active=true to only return active items
 */
export async function GET(req: Request) {
    const user = await getSession();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const activeParam = url.searchParams.get("active"); // "true" | "false" | null

    try {
        // If active query param provided, filter by it
        if (activeParam === "true" || activeParam === "false") {
            const active = activeParam === "true";
            const { rows } = await pool.query(
                `
        SELECT id, sku, name, description, unit, cost, in_stock, active
        FROM items
        WHERE active = $1
        ORDER BY name ASC
        `,
                [active]
            );
            return NextResponse.json({ items: rows });
        }

        // Otherwise return all
        const { rows } = await pool.query(
            `
      SELECT id, sku, name, description, unit, cost, in_stock, active
      FROM items
      ORDER BY name ASC
      `
        );

        return NextResponse.json({ items: rows });
    } catch (err) {
        console.error("GET /api/items error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

/**
 * POST /api/items
 * - MANAGER only
 * - Inserts item into your items table
 */
export async function POST(req: Request) {
    const user = await getSession();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "MANAGER") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = CreateItemSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            {
                error: "Validation failed",
                details: parsed.error.flatten(),
            },
            { status: 400 }
        );
    }

    const { sku, name, description, unit, cost, in_stock, active } = parsed.data;

    try {
        // prevent duplicate SKU
        const existing = await pool.query(`SELECT id FROM items WHERE sku = $1 LIMIT 1`, [sku]);
        if (existing.rows.length > 0) {
            return NextResponse.json(
                { error: "An item with this SKU already exists" },
                { status: 409 }
            );
        }

        // IMPORTANT:
        // - cost is numeric(12,2). node-postgres can send a JS number.
        // - If you care about exact money rounding, you can also do: cost.toFixed(2)
        const costFixed = Number.isFinite(cost) ? cost.toFixed(2) : "0.00";

        const { rows } = await pool.query(
            `
      INSERT INTO items (sku, name, description, unit, cost, in_stock, active)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, sku, name, description, unit, cost, in_stock, active
      `,
            [sku, name, description ?? null, unit, costFixed, in_stock, active]
        );

        return NextResponse.json({ item: rows[0] }, { status: 201 });
    } catch (err) {
        console.error("POST /api/items error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
