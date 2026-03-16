import { initializeApp } from "firebase-admin/app";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
const { defineSecret } = require('firebase-functions/params');

initializeApp();

const EVENT_TYPE = "trade_in_request.created";
const EVENT_VERSION = "1.0";
const ESTIMATION_VERSION = "v1.5-demo";
const FALLBACK_WEBHOOK_SIGNAL = "accepted";
const N8N_WEBHOOK_URL = defineSecret("N8N_WEBHOOK_URL");


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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toDisplayValue(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Non renseigne";
  }

  return escapeHtml(trimmed);
}

function formatExpectedPrice(value: unknown): string {
  if (typeof value !== "number") {
    return "Non renseigne";
  }

  return `${value.toFixed(2)} EUR`;
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

function extractWebhookSignal(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    return FALLBACK_WEBHOOK_SIGNAL;
  }

  const candidateKeys = ["signal", "status", "result", "message"] as const;

  for (const key of candidateKeys) {
    const value = (payload as Record<string, unknown>)[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim().slice(0, 120);
    }
  }

  return FALLBACK_WEBHOOK_SIGNAL;
}


////////////////////////////////////////////////////////////
// Trade-in request created
////////////////////////////////////////////////////////////
export const onTradeInRequestCreated = onDocumentCreated("tradeInRequests/{requestId}", async (event) => {
  const snapshot = event.data;
  const requestId = event.params.requestId;

  if (!snapshot) {
    logger.warn("Missing Firestore snapshot for new trade-in request", { requestId });
    return;
  }

  const data = snapshot.data();
  const occurredAt = event.time ?? new Date().toISOString();

  const request = {
    id: requestId,
    userId: asString(data.userId),
    userEmail: asString(data.userEmail),
    category: asString(data.category),
    brand: asString(data.brand),
    model: asString(data.model),
    reference: asString(data.reference),
    storage: asString(data.storage),
    condition: asString(data.condition),
    accessories: asString(data.accessories),
    notes: asString(data.notes),
    status: asString(data.status),
    createdAt: toIsoString(data.createdAt, occurredAt)
  };

  const htmlRecap = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#f5f5f7;padding:24px;color:#1d1d1f;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e6e6eb;border-radius:14px;padding:28px;">
        <h1 style="margin:0 0 8px 0;font-size:22px;font-weight:600;">Recapitulatif de votre demande de reprise</h1>
        <p style="margin:0 0 24px 0;font-size:14px;color:#6e6e73;">Demande #${escapeHtml(requestId)}</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:8px 0;color:#6e6e73;">Categorie</td><td style="padding:8px 0;text-align:right;font-weight:500;">${toDisplayValue(request.category)}</td></tr>
          <tr><td style="padding:8px 0;color:#6e6e73;">Marque</td><td style="padding:8px 0;text-align:right;font-weight:500;">${toDisplayValue(request.brand)}</td></tr>
          <tr><td style="padding:8px 0;color:#6e6e73;">Modele</td><td style="padding:8px 0;text-align:right;font-weight:500;">${toDisplayValue(request.model)}</td></tr>
          <tr><td style="padding:8px 0;color:#6e6e73;">Reference</td><td style="padding:8px 0;text-align:right;font-weight:500;">${toDisplayValue(request.reference)}</td></tr>
          <tr><td style="padding:8px 0;color:#6e6e73;">Stockage</td><td style="padding:8px 0;text-align:right;font-weight:500;">${toDisplayValue(request.storage)}</td></tr>
          <tr><td style="padding:8px 0;color:#6e6e73;">Etat</td><td style="padding:8px 0;text-align:right;font-weight:500;">${toDisplayValue(request.condition)}</td></tr>
          <tr><td style="padding:8px 0;color:#6e6e73;">Accessoires</td><td style="padding:8px 0;text-align:right;font-weight:500;">${toDisplayValue(request.accessories)}</td></tr>
          <tr><td style="padding:8px 0;color:#6e6e73;">Prix souhaite</td><td style="padding:8px 0;text-align:right;font-weight:500;">${formatExpectedPrice(data.expectedPrice)}</td></tr>
          <tr><td style="padding:8px 0;color:#6e6e73;">Date de creation</td><td style="padding:8px 0;text-align:right;font-weight:500;">${toDisplayValue(request.createdAt)}</td></tr>
        </table>
        <div style="margin-top:18px;padding-top:18px;border-top:1px solid #ececf1;">
          <p style="margin:0 0 8px 0;color:#6e6e73;font-size:14px;">Notes</p>
          <p style="margin:0;font-size:14px;white-space:pre-wrap;">${toDisplayValue(request.notes)}</p>
        </div>
      </div>
    </div>
  `.trim();

  const requestPayload: Record<string, unknown> = {
    ...request
  };

  if (typeof data.expectedPrice === "number") {
    requestPayload.expectedPrice = data.expectedPrice;
  }

  const payload: Record<string, unknown> = {
    eventType: EVENT_TYPE,
    eventVersion: EVENT_VERSION,
    eventId: event.id,
    occurredAt,
    request: requestPayload,
    requestId,
    userId: request.userId,
    category: request.category,
    brand: request.brand,
    model: request.model,
    reference: request.reference,
    storage: request.storage,
    condition: request.condition,
    accessories: request.accessories,
    notes: request.notes,
    createdAt: request.createdAt
  };

  const userEmail = request.userEmail;
  if (userEmail) {
    payload.userEmail = userEmail;
    payload.email = {
      locale: "fr-FR",
      to: userEmail,
      subject: "Recapitulatif de votre demande de reprise",
      html: htmlRecap
    };
  }

  if (typeof data.expectedPrice === "number") {
    payload.expectedPrice = data.expectedPrice;
  }

  try {
    const webhookUrl = N8N_WEBHOOK_URL.value();

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

    let webhookResponse: unknown = null;
    const responseText = await response.text();
    if (responseText.trim()) {
      try {
        webhookResponse = JSON.parse(responseText);
      } catch {
        webhookResponse = { raw: responseText.slice(0, 240) };
      }
    }

    const webhookSignal = extractWebhookSignal(webhookResponse);

    await snapshot.ref.update({
      workflowStatus: "processing",
      workflowSignal: webhookSignal,
      workflowSignalAt: FieldValue.serverTimestamp(),
      workflowError: FieldValue.delete(),
      estimationVersion: ESTIMATION_VERSION,
      estimationUpdatedAt: FieldValue.serverTimestamp()
    });

    logger.info("Triggered n8n workflow for trade-in request", { requestId, webhookSignal });
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
