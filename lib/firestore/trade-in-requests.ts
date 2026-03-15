import "server-only";

import { Timestamp } from "firebase-admin/firestore";

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

export async function getTradeInRequestsForUser(userId: string): Promise<TradeInRequest[]> {
  const snapshot = await getAdminDb()
    .collection(COLLECTION_NAME)
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .limit(10)
    .get();

  return snapshot.docs.map((document) => {
    const data = document.data();

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
      createdAt: data.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString()
    };
  });
}
