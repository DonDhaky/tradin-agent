# AGENTS.md

## Product Guardrails

- Build only the V1 scope unless explicitly asked otherwise.
- V1 scope is limited to landing, authentication, protected dashboard, product intake form, and Firestore persistence.
- Do not implement AI estimation logic yet.
- Do not implement marketplace search, scraping, Telegram, Google Sheets, or admin workflows yet.

## Technical Guardrails

- This repository uses Next.js App Router with TypeScript.
- Keep Firebase setup isolated under `lib/firebase`.
- Prefer simple server-side writes for Firestore persistence.
- Use environment variables only. Never hardcode credentials or secrets.
- Avoid unnecessary dependencies and avoid premature abstractions.
- Keep changes consistent with the current folder structure and naming.

## UX Direction

- UI should feel premium, modern, minimal, and Apple-inspired.
- Favor soft contrast, generous spacing, and restrained use of color.
- Prefer clear forms and simple layouts over dense dashboards.

## Collaboration Notes

- Before major refactors, explain the plan first.
- Preserve agent-friendly structure and readable naming.
- When adding features later, isolate new capabilities in dedicated modules rather than mixing concerns into the intake flow.
