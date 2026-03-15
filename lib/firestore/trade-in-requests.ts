import "server-only";

import { QuerySnapshot, Timestamp } from "firebase-admin/firestore";

import { getAdminDb } from "@/lib/firebase/admin";
import type { TradeInRequest } from "@/types/trade-in-request";

const COLLECTION_NAME = "tradeInRequests";

type CreateTradeInRequestInput = {
  userId: string;
  userEmail: string;
  category: string;
  brand: string;
  model: string;
  storage: string;
  condition: string;
  accessories: string;
  notes: string;
  expectedPrice?: number;
};

export async function createTradeInRequest(input: CreateTradeInRequestInput) {
  const reference = await getAdminDb().collection(COLLECTION_NAME).add({
    ...input,
    status: "submitted",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });

  return reference.id;
}

function mapSnapshot(snapshot: QuerySnapshot): TradeInRequest[] {
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

export async function getTradeInRequestsForUser(userId: string): Promise<TradeInRequest[]> {
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
