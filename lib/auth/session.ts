import "server-only";

import { cookies } from "next/headers";

import { verifySessionCookie } from "@/lib/firebase/admin";

const SESSION_COOKIE_NAME = "tradein_session";

export type AuthenticatedUser = {
  uid: string;
  email: string | null;
  name: string | null;
};

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = await verifySessionCookie(token);

    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      name: typeof decoded.name === "string" ? decoded.name : null
    };
  } catch (error) {
    console.error("Unable to verify auth session", error);
    return null;
  }
}
