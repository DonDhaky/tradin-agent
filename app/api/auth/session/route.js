import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createSessionCookie, verifyIdToken } from "@/lib/firebase/admin";
import { ensureUserProfile } from "@/lib/firestore/users";

const SESSION_COOKIE_NAME = "tradein_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 5;

export async function POST(request) {
  try {
    const body = await request.json();
    const token = body?.token;

    if (!token) {
      return NextResponse.json({ message: "Missing Firebase ID token." }, { status: 400 });
    }

    const decodedToken = await verifyIdToken(token);
    await ensureUserProfile(decodedToken);
    const sessionCookie = await createSessionCookie(token, SESSION_DURATION_MS);

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_DURATION_MS / 1000
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unable to create auth session", error);
    return NextResponse.json({ message: "Unable to create auth session." }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  return NextResponse.json({ ok: true });
}
