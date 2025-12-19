import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function EmployeePage() {
    // 1) Server-side: read current user session
    const user = await getSession();

    // 2) If not logged in at all → send to login
    if (!user) {
        redirect("/login");
    }

    // 3) If logged in but not an EMPLOYEE → deny access by redirecting
    if (user.role !== "EMPLOYEE") {
        // For now, send them to the generic dashboard (/)
        redirect("/");
    }

    // 4) Employee is allowed → render their dashboard
    return (
        <div className="space-y-6">
            {/* Page title */}
            <div>
                <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                    Employee Dashboard
                </h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Create order requests and confirm received quantities.
                </p>
            </div>

            {/* Cards */}
            <section className="grid gap-4">
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-5">
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                        What you will do (soon)
                    </h2>
                    <ul className="list-disc list-inside text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                        <li>Create an order by selecting items + required quantities</li>
                        <li>Track order status (pending purchase / purchased / received)</li>
                        <li>Confirm received quantities after delivery</li>
                        <li>Create “quantity received” entries even if an item was not marked purchased</li>
                    </ul>
                </div>

                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-5">
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                        Next step we’ll build
                    </h2>
                    <ol className="list-decimal list-inside text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                        <li>Show the item list from PostgreSQL</li>
                        <li>Create an “Order Draft” UI (like a cart)</li>
                        <li>Submit an order to the purchaser workflow</li>
                    </ol>
                </div>
            </section>
        </div>
    );
}
