import { initializeApp } from "firebase-admin/app";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

initializeApp();

const EVENT_TYPE = "trade_in_request.created";
const EVENT_VERSION = "1.0";
const ESTIMATION_VERSION = "v1.5-demo";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toIsoString(value: unknown, fallback: string): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (typeof value === "object" && value !== null && "toDate" in value) {
    const maybeTimestamp = value as { toDate?: () => Date };
    const date = maybeTimestamp.toDate?.();
    if (date instanceof Date) {
      return date.toISOString();
    }
  }

  if (typeof value === "string") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString();
    }
  }

  return fallback;
}

function sanitizeErrorMessage(error: unknown): string {
  const baseMessage = error instanceof Error ? error.message : "Webhook request failed.";
  const compact = baseMessage.replace(/\s+/g, " ").trim();

  if (!compact) {
    return "Webhook request failed.";
  }

  return compact.slice(0, 180);
}

export const onTradeInRequestCreated = onDocumentCreated("tradeInRequests/{requestId}", async (event) => {
  const snapshot = event.data;
  const requestId = event.params.requestId;

  if (!snapshot) {
    logger.warn("Missing Firestore snapshot for new trade-in request", { requestId });
    return;
  }

  const data = snapshot.data();
  const occurredAt = new Date().toISOString();

  const payload: Record<string, unknown> = {
    eventType: EVENT_TYPE,
    eventVersion: EVENT_VERSION,
    occurredAt,
    requestId,
    userId: asString(data.userId),
    category: asString(data.category),
    brand: asString(data.brand),
    model: asString(data.model),
    reference: asString(data.reference),
    storage: asString(data.storage),
    condition: asString(data.condition),
    accessories: asString(data.accessories),
    notes: asString(data.notes),
    createdAt: toIsoString(data.createdAt, occurredAt)
  };

  const userEmail = asString(data.userEmail);
  if (userEmail) {
    payload.userEmail = userEmail;
  }

  if (typeof data.expectedPrice === "number") {
    payload.expectedPrice = data.expectedPrice;
  }

  try {
    const webhookUrl = getRequiredEnv("N8N_WEBHOOK_URL");

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`n8n webhook returned status ${response.status}`);
    }

    await snapshot.ref.update({
      workflowStatus: "processing",
      workflowError: FieldValue.delete(),
      estimationVersion: ESTIMATION_VERSION,
      estimationUpdatedAt: FieldValue.serverTimestamp()
    });

    logger.info("Triggered n8n workflow for trade-in request", { requestId });
  } catch (error) {
    const message = sanitizeErrorMessage(error);

    await snapshot.ref.update({
      workflowStatus: "failed",
      workflowError: message,
      estimationVersion: ESTIMATION_VERSION,
      estimationUpdatedAt: FieldValue.serverTimestamp()
    });

    logger.error("Failed to trigger n8n workflow", { requestId, error: message });
  }
});
