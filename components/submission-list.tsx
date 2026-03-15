import { formatCurrency, formatDate } from "@/lib/utils";
import type { TradeInRequest } from "@/types/trade-in-request";

type SubmissionListProps = {
  submissions: TradeInRequest[];
};

export function SubmissionList({ submissions }: SubmissionListProps) {
  return (
    <aside className="panel" style={{ padding: "28px", display: "grid", gap: "20px", align-content: "start" }}>
      <div style={{ display: "grid", gap: "10px" }}>
        <span className="eyebrow">Recent submissions</span>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.9rem", letterSpacing: "-0.04em" }}>Saved requests</h2>
          <p style={{ margin: "10px 0 0", color: "var(--muted)", lineHeight: 1.7 }}>
            A lightweight Firestore view of the customer’s most recent product intake submissions.
          </p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="card" style={{ borderRadius: "24px", padding: "22px" }}>
          <p style={{ margin: 0, lineHeight: 1.7, color: "var(--muted)" }}>
            No requests yet. The first saved product will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "14px" }}>
          {submissions.map((submission) => (
            <article className="card" key={submission.id} style={{ borderRadius: "24px", padding: "20px", display: "grid", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "start" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1rem" }}>
                    {submission.brand} {submission.model}
                  </h3>
                  <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>
                    {submission.category} · {submission.condition}
                  </p>
                </div>
                {typeof submission.expectedPrice === "number" ? (
                  <strong>{formatCurrency(submission.expectedPrice)}</strong>
                ) : null}
              </div>
              {submission.storage ? <p style={{ margin: 0 }}>Storage: {submission.storage}</p> : null}
              {submission.accessories ? <p style={{ margin: 0 }}>Accessories: {submission.accessories}</p> : null}
              {submission.notes ? <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>{submission.notes}</p> : null}
              <span className="helper-text">{formatDate(submission.createdAt)}</span>
            </article>
          ))}
        </div>
      )}
    </aside>
  );
}
