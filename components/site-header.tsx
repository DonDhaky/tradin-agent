import Link from "next/link";

import { getCurrentUser } from "@/lib/auth/session";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="section" style={{ paddingBottom: 0 }}>
      <div className="page-shell">
        <div
          className="card"
          style={{
            borderRadius: "999px",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px"
          }}
        >
          <Link href="/" style={{ fontWeight: 800, letterSpacing: "-0.04em" }}>
            Tradein Agent
          </Link>
          <nav style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link className="button button-ghost" href="/">
              Home
            </Link>
            {user ? (
              <Link className="button button-primary" href="/dashboard">
                Dashboard
              </Link>
            ) : (
              <>
                <Link className="button button-ghost" href="/login">
                  Login
                </Link>
                <Link className="button button-primary" href="/signup">
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
