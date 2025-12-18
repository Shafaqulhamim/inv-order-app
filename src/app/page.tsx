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
  if (user.role === "MANAGER") {
    redirect("/manager");
  }

  if (user.role === "EMPLOYEE") {
    redirect("/employee");
  }

  if (user.role === "PURCHASER") {
    redirect("/purchaser");
  }

  // 4) Safety fallback (should not happen if your roles are correct)
  redirect("/login");
}