import LogoutButton from "@/components/LogoutButton";
import { getSession } from "@/lib/session";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1) One place to enforce authentication for ALL protected routes
    const user = await getSession();

    // 2) Not logged in → go to login
    if (!user) {
        redirect("/login");
    }

    // 3) Decide which dashboard link is "home" for this user
    const homeHref =
        user.role === "MANAGER"
            ? "/manager"
            : user.role === "EMPLOYEE"
                ? "/employee"
                : "/purchaser";

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
            {/* Shared top bar for all protected pages */}
            <header className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur">
                <div className="mx-auto w-full max-w-5xl px-4 py-3 flex items-center justify-between">
                    {/* Left: Brand + role */}
                    <div className="flex items-center gap-3">
                        <Link
                            href={homeHref}
                            className="text-sm font-semibold text-zinc-900 dark:text-zinc-50"
                        >
                            Inv-Order
                        </Link>

                        <span className="text-xs px-2 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200">
                            {user.role}
                        </span>
                    </div>

                    {/* Middle: simple nav based on role */}
                    <nav className="hidden sm:flex items-center gap-3 text-sm">
                        <Link
                            href={homeHref}
                            className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                        >
                            Dashboard
                        </Link>

                        {user.role === "MANAGER" && (
                            <>
                                <Link
                                    href="/manager"
                                    className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                                >
                                    Manager
                                </Link>
                            </>
                        )}

                        {user.role === "EMPLOYEE" && (
                            <>
                                <Link
                                    href="/employee"
                                    className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                                >
                                    Employee
                                </Link>
                            </>
                        )}

                        {user.role === "PURCHASER" && (
                            <>
                                <Link
                                    href="/purchaser"
                                    className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                                >
                                    Purchaser
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Right: user info + logout */}
                    <div className="flex items-center gap-3">
                        <div className="hidden md:block text-right">
                            <div className="text-xs font-medium text-zinc-900 dark:text-zinc-50">
                                {user.name}
                            </div>
                            <div className="text-[11px] text-zinc-600 dark:text-zinc-400">
                                {user.email}
                            </div>
                        </div>

                        <LogoutButton />
                    </div>
                </div>
            </header>

            {/* Page content */}
            <main className="mx-auto w-full max-w-5xl px-4 py-6">{children}</main>
        </div>
    );
}
