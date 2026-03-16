"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

import { auth } from "@/lib/firebase/client";

export function DashboardHeader({ user }) {
  const router = useRouter();

  async function handleLogout() {
    await signOut(auth);
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  return (
    <div
      className="panel"
      style={{
        padding: "24px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        flexWrap: "wrap"
      }}
    >
      <div style={{ display: "grid", gap: "8px" }}>
        <span className="eyebrow">Protected dashboard</span>
        <div>
          <h1 style={{ margin: 0, fontSize: "2.25rem", letterSpacing: "-0.05em" }}>Product intake</h1>
          <p style={{ margin: "8px 0 0", color: "var(--muted)" }}>
            Signed in as {user.name || user.email || "authenticated user"}.
          </p>
        </div>
      </div>
      <button className="button button-secondary" onClick={handleLogout} type="button">
        Log out
      </button>
    </div>
  );
}
