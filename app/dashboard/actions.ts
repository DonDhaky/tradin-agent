"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/session";
import { createTradeInRequest } from "@/lib/firestore/trade-in-requests";

export type ProductFormState = {
  error?: string;
  success?: string;
};

const requiredFields = ["category", "brand", "model", "condition"] as const;

export async function submitTradeInRequest(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "You must be signed in to submit a product." };
  }

  for (const field of requiredFields) {
    const value = formData.get(field);

    if (typeof value !== "string" || !value.trim()) {
      return { error: `Missing required field: ${field}.` };
    }
  }

  const expectedPriceRaw = formData.get("expectedPrice");
  const expectedPrice = typeof expectedPriceRaw === "string" && expectedPriceRaw.trim()
    ? Number(expectedPriceRaw)
    : undefined;

  if (expectedPriceRaw && Number.isNaN(expectedPrice)) {
    return { error: "Expected price must be a valid number." };
  }

  await createTradeInRequest({
    userId: user.uid,
    userEmail: user.email ?? "",
    category: String(formData.get("category")),
    brand: String(formData.get("brand")),
    model: String(formData.get("model")),
    storage: String(formData.get("storage") ?? ""),
    condition: String(formData.get("condition")),
    accessories: String(formData.get("accessories") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    expectedPrice
  });

  revalidatePath("/dashboard");

  return { success: "Product request saved." };
}
