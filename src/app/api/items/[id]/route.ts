import { pool } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { z } from "zod";

const IdSchema = z.string().uuid("Invalid item id");

type Params = { params: { id: string } };

export async function DELETE(_req: Request, { params }: Params) {
    // 1) Authentication
    const user = await getSession();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (user.role !== "MANAGER") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const parsedId = IdSchema.safeParse(params.id);
    if (!parsedId.success) {
        return NextResponse.json(
            { error: parsedId.error.issues[0]?.message ?? "Invalid id" },
            { status: 400 }
        );
    }

    const id = parsedId.data;
    try {
        // 4) Delete and return the deleted row (helps UI confirm)
        const { rows } = await pool.query(
            `
      DELETE FROM items
      WHERE id = $1
      RETURNING id, sku, name
      `,
            [id]
        );

        if (rows.length === 0) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        return NextResponse.json({ deleted: rows[0] });
    } catch (err) {
        console.error("DELETE /api/items/:id error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}