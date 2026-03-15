# Technical Brief

## Objective

Scaffold a maintainable V1 MVP using Next.js App Router, TypeScript, Firebase Authentication, and Firestore.

## Architecture

- `app/` contains routes, layouts, and the auth session API route.
- `components/` contains small UI and feature components.
- `lib/firebase/client.ts` contains Firebase browser SDK setup.
- `lib/firebase/admin.ts` contains Firebase Admin SDK setup for token verification and Firestore access.
- `lib/auth/session.ts` reads the auth cookie and resolves the current user on the server.
- `lib/firestore/trade-in-requests.ts` contains Firestore document helpers for V1 submissions.

## Authentication Approach

- Browser auth uses Firebase Authentication email/password.
- After login or signup, the client obtains a Firebase ID token.
- The token is posted to `/api/auth/session`.
- The server verifies the token and stores it in an HTTP-only cookie.
- Protected routes check that cookie server-side before rendering.

## Persistence Approach

- Trade-in requests are saved to Firestore using server-side helpers.
- Each document stores the authenticated user ID and email for ownership.
- The dashboard reads only the current user’s recent submissions.

## Design Approach

- Minimal custom CSS in `app/globals.css`
- Soft surfaces, rounded panels, large typography, and generous spacing
- No additional component library or CSS framework in V1

## Extension Strategy

Future additions should remain modular:

- AI estimation can run after intake creation in a separate service or workflow layer.
- Marketplace or enrichment integrations should be introduced behind isolated modules.
- Admin workflows should be added as separate protected areas, not mixed into customer intake routes.

## Operational Notes

- Requires Firebase project setup by the developer.
- Requires enabling email/password auth and Firestore.
- Requires a Firebase service account for server-side verification and writes.
- The dashboard query may require a Firestore composite index on `userId` ascending and `createdAt` descending.
