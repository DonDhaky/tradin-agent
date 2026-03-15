import Link from "next/link";

import { SiteHeader } from "@/components/site-header";

const highlights = [
  "Focused V1 intake flow for second-hand tech products",
  "Firebase Authentication for customer access",
  "Firestore-backed submissions with clear ownership",
  "Prepared for future AI valuation features without implementing them yet"
];

const stats = [
  { label: "Flow", value: "Landing to submission in minutes" },
  { label: "Backend", value: "Firebase Auth + Firestore" },
  { label: "Scope", value: "Strictly V1, no estimation engine yet" }
];

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="section">
          <div className="page-shell">
            <div
              className="panel"
              style={{
                padding: "32px",
                display: "grid",
                gap: "32px",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  display: "grid",
                  gap: "20px",
                  maxWidth: "720px"
                }}
              >
                <span className="eyebrow">Trade-in intake MVP</span>
                <h1
                  style={{
                    margin: 0,
                    fontSize: "clamp(3rem, 7vw, 5.75rem)",
                    lineHeight: 0.95,
                    letterSpacing: "-0.06em"
                  }}
                >
                  Collect premium trade-in requests with a clean, agent-ready foundation.
                </h1>
                <p
                  style={{
                    margin: 0,
                    maxWidth: "640px",
                    fontSize: "1.125rem",
                    lineHeight: 1.7,
                    color: "var(--muted)"
                  }}
                >
                  Tradein Agent V1 gives customers a polished way to submit second-hand tech products, while
                  keeping the repository simple enough to extend later with AI-assisted estimation and
                  automation.
                </p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <Link className="button button-primary" href="/signup">
                    Create account
                  </Link>
                  <Link className="button button-secondary" href="/login">
                    Sign in
                  </Link>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px"
                }}
              >
                {stats.map((item) => (
                  <div
                    className="card"
                    key={item.label}
                    style={{ borderRadius: "24px", padding: "22px", display: "grid", gap: "8px" }}
                  >
                    <span style={{ color: "var(--muted)", fontSize: "13px", fontWeight: 700 }}>{item.label}</span>
                    <strong style={{ fontSize: "1rem", lineHeight: 1.5 }}>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="page-shell">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "16px"
              }}
            >
              {highlights.map((highlight) => (
                <div
                  className="card"
                  key={highlight}
                  style={{ borderRadius: "26px", padding: "24px", minHeight: "160px", display: "flex", alignItems: "end" }}
                >
                  <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: 1.6 }}>{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
