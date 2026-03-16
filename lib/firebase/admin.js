import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getFirebaseAdminApp() {
  if (getApps().length) {
    return getApp();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase admin environment variables.");
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey
    })
  });
}

export function getAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export async function verifyIdToken(token) {
  return getAdminAuth().verifyIdToken(token);
}

export async function createSessionCookie(token, expiresIn) {
  return getAdminAuth().createSessionCookie(token, { expiresIn });
}

export async function verifySessionCookie(sessionCookie) {
  return getAdminAuth().verifySessionCookie(sessionCookie, true);
}

export function getAdminDb() {
  return getFirestore(getFirebaseAdminApp());
}
