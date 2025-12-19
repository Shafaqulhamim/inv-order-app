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
        <div className="space-y-6">
            {/* Page title */}
            <div>
                <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                    Purchaser Dashboard
                </h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Review order requests and mark items as purchased.
                </p>
            </div>

            {/* Cards */}
            <section className="grid gap-4">
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-5">
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                        What you will do (soon)
                    </h2>
                    <ul className="list-disc list-inside text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                        <li>See the list of items requested for purchase</li>
                        <li>Mark items as purchased with purchased quantity</li>
                        <li>Leave remaining quantities in “yet-to-be-purchased”</li>
                        <li>Handle partial purchases (buy some now, remaining later)</li>
                    </ul>
                </div>

                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-5">
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                        Next step we’ll build
                    </h2>
                    <ol className="list-decimal list-inside text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                        <li>Show “pending purchase” items from PostgreSQL</li>
                        <li>Add “Mark Purchased” action (full/partial)</li>
                        <li>Automatically keep remaining qty in the pending list</li>
                    </ol>
                </div>
            </section>
        </div>
    );
}
