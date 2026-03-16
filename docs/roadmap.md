# Tradein Agent Roadmap (Repository-Based)

## 1) Current State

### Already implemented
- Next.js App Router app with TypeScript and a coherent V1 structure (`app`, `components`, `lib/firebase`, `lib/firestore`).
- Landing page, login/signup pages, protected dashboard route, and authenticated navigation.
- Firebase email/password auth on the client, server session cookie creation/deletion via `/api/auth/session`.
- Firestore persistence for product intake via server action (`submitTradeInRequest`) and admin SDK writes.
- User profile upsert in `users/{uid}` during session creation.
- Dashboard shows recent submissions for the signed-in user.

### Missing but important
- No automated tests (auth/session, server actions, Firestore helpers, and main UI flows are untested).
- No explicit production error handling/observability beyond `console.error`.
- Basic validation only; field constraints/sanitization are minimal.
- Some UI copy has encoding artifacts in submissions list text.

### Optional improvements
- Better empty/loading states and clearer field-level validation messages.
- Pagination/filtering beyond latest 10 submissions.
- Improved metadata/SEO and social preview setup.

### Out of scope for now
- AI valuation/estimation.
- Marketplace search/scraping.
- Telegram, Google Sheets, and admin automation workflows.

## 2) V1 Stabilization

### Already implemented
- Core happy path works end-to-end: auth -> session -> protected dashboard -> Firestore write/read.

### Missing but important
- Add smoke/integration tests for:
  - signup/login/session cookie lifecycle,
  - dashboard access protection,
  - product submission server action validation.
- Harden input validation on server action (length bounds, numeric ranges, normalized strings).
- Define standard error handling (user-safe messages + structured server logs).
- Fix current text encoding artifacts in dashboard submission UI.

### Optional improvements
- Add minimal analytics/events for funnel visibility (landing -> signup/login -> first submission).
- Add health/readiness checks for Firebase env config at startup.

### Out of scope for now
- Any AI- or automation-driven processing after submission creation.

## 3) V1 Polish

### Already implemented
- Premium/minimal baseline UI direction with soft contrast and clear layout.

### Missing but important
- Improve form UX details (inline validation, clearer required/optional hints, stronger accessibility labels/states).
- Improve auth UX copy and error mapping (Firebase errors -> user-readable messages).
- Add a basic request status explanation in dashboard so `submitted` is explicit.

### Optional improvements
- Minor responsive refinements and micro-interactions.
- Better skeleton/loading treatment for dashboard sections.

### Out of scope for now
- New product modules that alter V1 scope.

## 4) V1.5 Estimation Logic

### Already implemented
- Data model and intake flow provide the right foundation (category/brand/model/condition/storage/notes/expectedPrice).

### Missing but important
- Introduce estimation as an isolated module triggered after submission creation (without coupling to intake form logic).
- Extend schema for estimation metadata (estimate value, confidence, source, timestamp, version).
- Add clear auditability and fallback behavior when estimation fails.

### Optional improvements
- Manual override workflow for estimate review.
- Simple estimate history/versioning.

### Out of scope for now
- External marketplace automation and enrichment pipelines.

## 5) V2 Automations

### Already implemented
- None (by design in current scope).

### Missing but important
- Define an automation architecture boundary first (events, queue/jobs, retries, idempotency).
- Add integration modules separately from intake core (Telegram, Sheets, internal ops tools).

### Optional improvements
- Admin review dashboard and lifecycle transitions.
- SLA/alerting for failed automations.

### Out of scope for now
- Shipping all integrations before V1 reliability and V1.5 estimation are stable.

## Highest-Value Next 3 Actions

1. Add a small test baseline for auth/session protection and product submission server action.
2. Harden server-side validation and error handling for intake writes.
3. Fix current dashboard text encoding/UI quality issues, then do a short V1 UX pass on form and auth errors.
