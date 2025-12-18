import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function PurchaserPage() {
    // 1) Server-side: read current user session
    const user = await getSession();

    // 2) If not logged in at all → send to login
    if (!user) {
        redirect("/login");
    }

    // 3) If logged in but not a purchaser → deny access by redirecting
    if (user.role !== "PURCHASER") {
        // For now, send them to the generic dashboard (/)
        redirect("/");
    }

    // 4) Manager is allowed → render their dashboard
    return (
        <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black font-sans">
            <div className="w-full max-w-3xl bg-white dark:bg-black rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-8 space-y-6">

                {/* Header */}
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
                            Purchaser Dashboard
                        </h1>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Welcome, {user.name}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                            Signed in as <span className="font-semibold">{user.email}</span>
                        </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200">
                        Role: PURCHASER
                    </span>
                </header>

                {/* Main content */}
                <section className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                        <p className="font-medium mb-1">What you can do here (soon):</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Manage the item catalog (add, edit, deactivate items)</li>
                            <li>Review and create orders requested by employees</li>
                            <li>Monitor items that are pending purchase or delivery</li>
                        </ul>
                    </div>

                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-900/40">
                        <p className="font-medium mb-1">Next development steps for Manager UI:</p>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Show a table of items (from the <code>items</code> table)</li>
                            <li>Add an “Add Item” form for new inventory items</li>
                            <li>Show a list of open orders and their statuses</li>
                        </ol>
                    </div>
                </section>

                <footer className="text-xs text-zinc-500 dark:text-zinc-500 pt-2">
                    Inventory Ordering System • Purchaser View
                </footer>
            </div>
        </main>
    );
}
