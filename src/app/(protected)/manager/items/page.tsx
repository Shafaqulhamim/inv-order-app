import { pool } from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import AddItemForm from "./AddItemForm";

export default async function ManagerItemsPage() {
    // 1) Auth check (layout already checks login, but we need role)
    const user = await getSession();
    if (!user) redirect("/login");

    if (user.role !== "MANAGER") {
        redirect("/");
    }

    // 2) Fetch items directly from Postgres (server-side)
    const { rows: items } = await pool.query(`
    SELECT
      id,
      sku,
      name,
      description,
      unit,
      cost,
      in_stock,
      active
    FROM items
    ORDER BY name ASC
  `);

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                    Items
                </h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Manage item catalog and stock levels.
                </p>
            </div>
            <AddItemForm />
            {/* Items table */}
            <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
                <table className="w-full text-sm">
                    <thead className="bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium">SKU</th>
                            <th className="px-4 py-3 text-left font-medium">Name</th>
                            <th className="px-4 py-3 text-left font-medium">Unit</th>
                            <th className="px-4 py-3 text-right font-medium">Cost</th>
                            <th className="px-4 py-3 text-right font-medium">In Stock</th>
                            <th className="px-4 py-3 text-center font-medium">Active</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-6 text-center text-zinc-500"
                                >
                                    No items found.
                                </td>
                            </tr>
                        )}

                        {items.map((item) => (
                            <tr
                                key={item.id}
                                className="border-t border-zinc-200 dark:border-zinc-800"
                            >
                                <td className="px-4 py-3 font-mono text-xs">
                                    {item.sku}
                                </td>

                                <td className="px-4 py-3">
                                    <div className="font-medium">{item.name}</div>
                                    {item.description && (
                                        <div className="text-xs text-zinc-500">
                                            {item.description}
                                        </div>
                                    )}
                                </td>

                                <td className="px-4 py-3">{item.unit}</td>

                                <td className="px-4 py-3 text-right">
                                    ${Number(item.cost).toFixed(2)}
                                </td>

                                <td className="px-4 py-3 text-right">
                                    {item.in_stock}
                                </td>

                                <td className="px-4 py-3 text-center">
                                    {item.active ? (
                                        <span className="inline-flex px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200">
                                            Inactive
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
