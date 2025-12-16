"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        try {
            setLoading(true);

            // 1) Ask the server to clear the session cookie
            await fetch("/api/auth/logout", {
                method: "POST",
            });

            // 2) Redirect to login page
            router.push("/login");

            // 3) Refresh so server components re-check session
            router.refresh();
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="px-3 py-2 rounded-full border border-black/[.08] dark:border-white/[.145]
                 text-xs font-semibold text-zinc-800 dark:text-zinc-100
                 bg-white dark:bg-black hover:bg-black/[.04] dark:hover:bg-[#1a1a1a]
                 transition disabled:opacity-60"
        >
            {loading ? "Logging out..." : "Log out"}
        </button>
    );
}
