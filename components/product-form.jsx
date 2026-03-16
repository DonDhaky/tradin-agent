"use client";

import { useActionState, useEffect, useRef } from "react";

import { submitTradeInRequest } from "@/app/dashboard/actions";

const initialState = {};

export function ProductForm() {
  const formRef = useRef(null);
  const [state, formAction, isPending] = useActionState(submitTradeInRequest, initialState);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <section className="panel" style={{ padding: "28px", display: "grid", gap: "24px" }}>
      <div style={{ display: "grid", gap: "10px" }}>
        <span className="eyebrow">New request</span>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.9rem", letterSpacing: "-0.04em" }}>Tell us about the device.</h2>
          <p style={{ margin: "10px 0 0", color: "var(--muted)", lineHeight: 1.7 }}>
            Capture the essential product details now. Estimation logic and downstream automations remain out of scope
            for V1.
          </p>
        </div>
      </div>

      <form action={formAction} ref={formRef} style={{ display: "grid", gap: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select defaultValue="" id="category" name="category" required>
              <option disabled value="">
                Select a category
              </option>
              <option value="smartphone">Smartphone</option>
              <option value="tablet">Tablet</option>
              <option value="laptop">Laptop</option>
              <option value="smartwatch">Smartwatch</option>
              <option value="console">Console</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="brand">Brand</label>
            <input id="brand" name="brand" placeholder="Apple" required type="text" />
          </div>

          <div className="field">
            <label htmlFor="model">Model</label>
            <input id="model" name="model" placeholder="iPhone 15 Pro" required type="text" />
          </div>

          <div className="field">
            <label htmlFor="storage">Storage</label>
            <input id="storage" name="storage" placeholder="256 GB" type="text" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          <div className="field">
            <label htmlFor="condition">Condition</label>
            <select defaultValue="" id="condition" name="condition" required>
              <option disabled value="">
                Select condition
              </option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="broken">Broken / parts only</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="expectedPrice">Expected price</label>
            <input id="expectedPrice" min="0" name="expectedPrice" placeholder="450" step="0.01" type="number" />
          </div>
        </div>

        <div className="field">
          <label htmlFor="accessories">Accessories included</label>
          <input id="accessories" name="accessories" placeholder="Box, charger, cable" type="text" />
        </div>

        <div className="field">
          <label htmlFor="notes">Additional notes</label>
          <textarea
            id="notes"
            name="notes"
            placeholder="Cosmetic wear, battery health, repair history, or anything else relevant."
          />
        </div>

        {state.error ? <p className="status-text status-error">{state.error}</p> : null}
        {state.success ? <p className="status-text status-success">{state.success}</p> : null}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
          <p className="helper-text" style={{ margin: 0 }}>
            Every submission is saved to Firestore and linked to the authenticated user.
          </p>
          <button className="button button-primary" disabled={isPending} type="submit">
            {isPending ? "Saving..." : "Save request"}
          </button>
        </div>
      </form>
    </section>
  );
}
