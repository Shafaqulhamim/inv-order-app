"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FormState = {
    sku: string;
    name: string;
    description: string;
    unit: string;
    cost: string; // keep as string in input, convert server-side
    in_stock: string; // keep as string in input, convert server-side
    active: boolean;
};

export default function AddItemForm() {
    const router = useRouter();

    const [open, setOpen] = useState(false);

    const [form, setForm] = useState<FormState>({
        sku: "",
        name: "",
        description: "",
        unit: "",
        cost: "",
        in_stock: "",
        active: true,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function update<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sku: form.sku,
                    name: form.name,
                    description: form.description.trim() ? form.description : null,
                    unit: form.unit,
                    cost: form.cost,
                    in_stock: form.in_stock,
                    active: form.active,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Best effort error message
                const message =
                    data?.error ||
                    (data?.details ? "Validation failed" : "Failed to create item");

                // If Zod details exist, show the first useful message
                if (data?.details?.fieldErrors) {
                    const fe = data.details.fieldErrors;
                    const first =
                        fe.sku?.[0] ||
                        fe.name?.[0] ||
                        fe.unit?.[0] ||
                        fe.cost?.[0] ||
                        fe.in_stock?.[0] ||
                        message;

                    setError(first);
                } else {
                    setError(message);
                }

                setLoading(false);
                return;
            }

            // Success: reset form, close, refresh server page (re-fetch DB)
            setForm({
                sku: "",
                name: "",
                description: "",
                unit: "",
                cost: "",
                in_stock: "",
                active: true,
            });
            setOpen(false);
            router.refresh();
            setLoading(false);
        } catch {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    }

    return (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-5">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                        Add Item
                    </h2>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        Create a new item in your catalog.
                    </p>
                </div>

                <button
                    onClick={() => setOpen((v) => !v)}
                    className="h-10 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold transition"
                >
                    {open ? "Close" : "New Item"}
                </button>
            </div>

            {open && (
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* SKU */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                SKU
                            </label>
                            <input
                                value={form.sku}
                                onChange={(e) => update("sku", e.target.value)}
                                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="XXX-123"
                                required
                            />
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Name
                            </label>
                            <input
                                value={form.name}
                                onChange={(e) => update("name", e.target.value)}
                                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="Name of the item"
                                required
                            />
                        </div>

                        {/* Unit */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Unit
                            </label>
                            <input
                                value={form.unit}
                                onChange={(e) => update("unit", e.target.value)}
                                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="pcs / roll / bag"
                                required
                            />
                        </div>

                        {/* Cost */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Cost
                            </label>
                            <input
                                value={form.cost}
                                onChange={(e) => update("cost", e.target.value)}
                                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="0.00"
                                inputMode="decimal"
                                required
                            />
                        </div>

                        {/* In Stock */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                In Stock
                            </label>
                            <input
                                value={form.in_stock}
                                onChange={(e) => update("in_stock", e.target.value)}
                                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="0"
                                inputMode="numeric"
                                required
                            />
                        </div>

                        {/* Active */}
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                                <input
                                    type="checkbox"
                                    checked={form.active}
                                    onChange={(e) => update("active", e.target.checked)}
                                    className="h-4 w-4"
                                />
                                Active
                            </label>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Description (optional)
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) => update("description", e.target.value)}
                            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Optional notes about the item..."
                            rows={3}
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-semibold
                         text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="h-10 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold transition disabled:opacity-60"
                        >
                            {loading ? "Saving..." : "Create Item"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
