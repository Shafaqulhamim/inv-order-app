import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ManagerPage() {
    // Because this page is inside (protected), login is already enforced by the layout.
    // But we still need to enforce the ROLE (authorization).
    const user = await getSession();

    // Safety: layout should already prevent this, but keeping it avoids edge cases.
    if (!user) {
        redirect("/login");
    }

    // Role check: only MANAGER can access /manager
    if (user.role !== "MANAGER") {
        redirect("/");
    }

    return (
        <div className="space-y-6">
            {/* Page title (the global header is already in layout) */}
            <div>
                <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                    Manager Dashboard
                </h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Manage items, orders, and the purchase workflow.
                </p>
            </div>
            {/* Cards */}
            <section className="grid gap-4">
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-5">
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                        What you can do (soon)
                    </h2>
                    <ul className="list-disc list-inside text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                        <li>Add / edit / delete items in the catalog</li>
                        <li>Create orders by selecting items + quantities</li>
                        <li>Edit “yet-to-be-purchased” list and mark items as purchased</li>
                        <li>Confirm received quantities after delivery</li>
                    </ul>
                </div>
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-5">
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                        Next step we’ll build
                    </h2>
                    <ol className="list-decimal list-inside text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                        <li>Read items from PostgreSQL and show them in a table</li>
                        <li>Add “Add Item” dialog (Manager-only)</li>
                        <li>Add “Create Order” page that builds an order draft</li>
                    </ol>
                </div>
            </section>
        </div>
    );
}
