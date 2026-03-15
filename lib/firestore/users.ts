import "server-only";

import type { DecodedIdToken } from "firebase-admin/auth";
import { Timestamp } from "firebase-admin/firestore";

import { getAdminDb } from "@/lib/firebase/admin";

const COLLECTION_NAME = "users";

export async function ensureUserProfile(decodedToken: DecodedIdToken) {
  const userReference = getAdminDb().collection(COLLECTION_NAME).doc(decodedToken.uid);
  const email = decodedToken.email ?? "";
  const displayName = typeof decodedToken.name === "string" ? decodedToken.name : "";
  const now = Timestamp.now();

  await getAdminDb().runTransaction(async (transaction) => {
    const snapshot = await transaction.get(userReference);

    if (!snapshot.exists) {
      transaction.set(userReference, {
        uid: decodedToken.uid,
        email,
        displayName,
        createdAt: now,
        updatedAt: now
      });
      return;
    }

    transaction.update(userReference, {
      email,
      displayName,
      updatedAt: now
    });
  });
}
