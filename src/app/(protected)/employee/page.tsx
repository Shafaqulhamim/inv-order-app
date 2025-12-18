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
        <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black font-sans">
            <div className="w-full max-w-3xl bg-white dark:bg-black rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-8 space-y-6">

                {/* Header */}
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
                            Employee Dashboard
                        </h1>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Welcome, {user.name}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                            Signed in as <span className="font-semibold">{user.email}</span>
                        </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                        Role: EMPLOYEE
                    </span>
                </header>

                {/* Main content */}
                <section className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                        <p className="font-medium mb-1">What you will do here:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Create new order requests by selecting items and quantities</li>
                            <li>View the status of your existing orders</li>
                            <li>See which items have been purchased vs still pending</li>
                        </ul>
                    </div>

                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-900/40">
                        <p className="font-medium mb-1">Next development steps for Employee UI:</p>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Show a list of available items that can be ordered</li>
                            <li>Add a simple “Create Order” form (item + quantity)</li>
                            <li>Display a table of the employee&apos;s own orders with statuses</li>
                        </ol>
                    </div>
                </section>

                <footer className="text-xs text-zinc-500 dark:text-zinc-500 pt-2">
                    Inventory Ordering System • Employee View
                </footer>
            </div>
        </main>
    );
}
