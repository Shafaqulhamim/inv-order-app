"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteItemButton({
    id,
    label = "Delete",
}: {
    id: string;
    label?: string;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        const ok = window.confirm(
            "Are you sure you want to delete this item? This cannot be undone."
        );
        if (!ok) return;

        try {
            setLoading(true);

            const res = await fetch(`/api/items/${id}`, {
                method: "DELETE",
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                alert(data?.error || "Failed to delete item");
                setLoading(false);
                return;
            }

            // ✅ Success: refresh server page (re-run DB query)
            router.refresh();
            setLoading(false);
        } catch {
            alert("Something went wrong. Please try again.");
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="h-9 px-3 rounded-xl text-xs font-semibold
                 border border-zinc-200 dark:border-zinc-800
                 text-zinc-700 dark:text-zinc-200
                 hover:bg-zinc-50 dark:hover:bg-zinc-900
                 transition disabled:opacity-60"
            title="Delete item"
        >
            {loading ? "Deleting..." : label}
        </button>
    );
}
