import LogoutButton from "@/components/LogoutButton";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function HomePage() {
  // 1) This runs on the server: read the current user session
  const user = await getSession();

  // 2) If there is no valid session, redirect to /login
  if (!user) {
    redirect("/login");
  }

  // 3) If user exists, render the protected dashboard UI
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-16 px-8 bg-white dark:bg-black sm:items-start">

        {/* Header: user info + logout */}
        <header className="w-full flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
              Welcome, {user.name}
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {user.email}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Role: <span className="font-semibold">{user.role}</span>
            </p>
          </div>

          <LogoutButton />
        </header>

        {/* Main content cards */}
        <section className="w-full flex-1 flex flex-col gap-6 text-sm text-zinc-700 dark:text-zinc-300">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <p className="font-medium mb-1">Protected dashboard</p>
            <p>
              You are seeing this because you are{" "}
              <span className="font-semibold">logged in</span>. If you log out
              or your session expires, you&apos;ll be redirected back to the
              login page.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <p className="font-medium mb-2">Soon this page will show:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Manager: item list & inventory controls</li>
              <li>Employee: create and track orders</li>
              <li>Purchaser: view items to buy & mark them as purchased</li>
            </ul>
          </div>
        </section>

        <footer className="w-full mt-8 text-xs text-zinc-500 dark:text-zinc-500">
          Inventory Ordering System • Authenticated as {user.role}
        </footer>
      </main>
    </div>
  );
}
