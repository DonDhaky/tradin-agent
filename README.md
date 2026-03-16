# Tradein Agent V1

Tradein Agent is a Next.js TypeScript MVP for collecting second-hand tech trade-in requests. V1 focuses on a clean landing experience, Firebase-backed authentication, a protected dashboard, and Firestore persistence for product intake submissions.

## Scope

Included in V1:

- Landing page
- Login page
- Signup page
- Protected dashboard
- Authenticated product intake form
- Firestore persistence for each submission
- Repository guidance for future agent-assisted development

Explicitly out of scope for V1:

- AI estimation logic
- Marketplace search
- Scraping
- Telegram workflows
- Google Sheets sync
- Admin automation workflows

## Stack

- Next.js 16 App Router
- TypeScript
- React 19
- Firebase Authentication
- Firestore
- Minimal custom CSS without extra UI dependencies

## Project Structure

```text
app/
  api/auth/session/route.ts   Server session cookie endpoints
  dashboard/                  Protected dashboard UI + server action
  login/                      Login route
  signup/                     Signup route
components/                   Reusable UI and feature components
docs/                         Product and technical briefs
lib/
  auth/                       Server-side session access
  firebase/                   Firebase client and admin setup
  firestore/                  Firestore access helpers
types/                        Shared TypeScript types
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your Firebase values.

Required client values:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Required server values:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` from `.env.example`.

3. In Firebase, enable:
   - Email/password authentication
   - Firestore database
   - A composite index for `tradeInRequests` on `userId` ascending and `createdAt` descending if Firestore prompts for it

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000`.

## Firebase Notes

- The client SDK handles login/signup in the browser.
- The server verifies Firebase ID tokens using `firebase-admin`.
- Product submissions are written through server-side Firestore helpers.
- A `users/{uid}` profile document is ensured during auth session creation on both signup and login.
- Existing user profiles keep their original `createdAt`; only `email`, `displayName`, and `updatedAt` are refreshed.
- Never commit live Firebase credentials.

## Suggested Firestore Shape

Collection: `tradeInRequests`

Example document fields:

- `userId`
- `userEmail`
- `category`
- `brand`
- `model`
- `storage`
- `condition`
- `accessories`
- `notes`
- `expectedPrice`
- `status`
- `createdAt`
- `updatedAt`

## Future Extension Paths

- Add AI valuation after a submission is created
- Add internal review workflows
- Add integrations for CRM or messaging tools
- Add richer request status tracking

Keep those additions behind new modules instead of overloading the V1 intake flow.

## V1.5 Automation Trigger (Firestore -> n8n)

This repository now includes a minimal Firebase Cloud Function trigger under `functions/`.

Flow:

- A document is created in `tradeInRequests/{requestId}`.
- Cloud Function `onTradeInRequestCreated` sends a POST webhook to n8n.
- On success, request document is updated with:
  - `workflowStatus = "processing"`
  - `estimationVersion = "v1.5-demo"`
  - `estimationUpdatedAt`
- On failure, request document is updated with:
  - `workflowStatus = "failed"`
  - `workflowError` (short sanitized message)
  - `estimationVersion = "v1.5-demo"`
  - `estimationUpdatedAt`

### Functions Environment Variables

Set in the Functions runtime environment (for emulator and deploy):

- `N8N_WEBHOOK_URL`

For local emulation, create `functions/.env.local`:

```bash
N8N_WEBHOOK_URL=https://your-n8n-instance/webhook/tradein-created
```

### Local Setup for Functions

1. Install Firebase CLI (if needed):

   ```bash
   npm install -g firebase-tools
   ```

2. Install functions dependencies:

   ```bash
   cd functions
   npm install
   cd ..
   ```

3. Log in and select project:

   ```bash
   firebase login
   firebase use <your-project-id>
   ```

4. Run emulator:

   ```bash
   firebase emulators:start --only functions,firestore
   ```

### Deploy Functions

```bash
firebase deploy --only functions
```

