import "server-only";

import { Timestamp } from "firebase-admin/firestore";

import { getAdminDb } from "@/lib/firebase/admin";

const COLLECTION_NAME = "tradeInRequests";

export async function createTradeInRequest(input) {
  const reference = await getAdminDb().collection(COLLECTION_NAME).add({
    ...input,
    status: "submitted",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });

  return reference.id;
}

function mapSnapshot(snapshot) {
  return snapshot.docs
    .map((document) => {
      const data = document.data();
      const createdAt = data.createdAt?.toDate?.();

      return {
        id: document.id,
        userId: data.userId,
        userEmail: data.userEmail,
        category: data.category,
        brand: data.brand,
        model: data.model,
        storage: data.storage,
        condition: data.condition,
        accessories: data.accessories,
        notes: data.notes,
        expectedPrice: typeof data.expectedPrice === "number" ? data.expectedPrice : undefined,
        status: data.status,
        createdAt: createdAt instanceof Date ? createdAt.toISOString() : new Date(0).toISOString()
      };
    })
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, 10);
}

export async function getTradeInRequestsForUser(userId) {
  try {
    const snapshot = await getAdminDb()
      .collection(COLLECTION_NAME)
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(10)
      .get();

    return mapSnapshot(snapshot);
  } catch (error) {
    console.error("Falling back to non-indexed trade-in request query", error);

    const fallbackSnapshot = await getAdminDb()
      .collection(COLLECTION_NAME)
      .where("userId", "==", userId)
      .get();

    return mapSnapshot(fallbackSnapshot);
  }
}
