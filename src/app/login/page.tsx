"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();

    //Empty by default now
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Login failed");
                setLoading(false);
                return;
            }

            const data = await res.json();
            const role = data.user?.role as "MANAGER" | "EMPLOYEE" | "PURCHASER" | undefined;

            let target = "/";
            if (role === "MANAGER") target = "/manager";
            else if (role === "EMPLOYEE") target = "/employee";
            else if (role === "PURCHASER") target = "/purchaser";

            // Successful login to dashboard
            router.push(target);
            router.refresh();

        } catch {
            setError("Something went wrong");
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-cyan-100">
            <div className="w-full max-w-md bg-white/90 backdrop-blur-xl shadow-xl rounded-2xl p-10 space-y-8 border border-cyan-200">

                {/* Title */}
                <div className="text-center space-y-1">
                    <h1 className="text-3xl font-bold text-cyan-700 tracking-tight">
                        Inventory Login
                    </h1>
                    <p className="text-sm text-cyan-600">
                        Sign in to continue to your dashboard
                    </p>
                </div>

                {/* Error Box */}
                {error && (
                    <div className="bg-red-100 border border-red-300 text-red-700 text-sm px-4 py-2 rounded-md">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-cyan-800 mb-1">
                            Email
                        </label>
                        <input
                            className="w-full border border-cyan-300 rounded-lg px-3 py-2.5 text-sm
                     focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500
                     transition-all bg-white"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-cyan-800 mb-1">
                            Password
                        </label>
                        <input
                            className="w-full border border-cyan-300 rounded-lg px-3 py-2.5 text-sm
                     focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500
                     transition-all bg-white"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 
                       text-white text-sm font-semibold transition disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                </form>

                {/* Test Accounts */}
                <div className="text-xs text-gray-600 space-y-1 text-center pt-2">
                    <p className="font-medium text-cyan-700">Test accounts:</p>
                    <div>manager@example.com / Passw0rd!</div>
                    <div>employee@example.com / Passw0rd!</div>
                    <div>purchaser@example.com / Passw0rd!</div>
                </div>
            </div>
        </div>
    );
}
