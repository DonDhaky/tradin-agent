"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";

import { auth } from "@/lib/firebase/client";

export function AuthForm({ mode }) {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const isSignup = mode === "signup";

  async function handleSubmit(formData) {
    setError(null);
    setIsPending(true);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      const credential = isSignup
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);

      if (isSignup && name) {
        await updateProfile(credential.user, { displayName: name });
      }

      const token = await credential.user.getIdToken();
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error("Could not create a server session.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : "Authentication failed.";
      setError(message);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div
      className="panel"
      style={{
        padding: "32px",
        maxWidth: "560px",
        margin: "0 auto",
        display: "grid",
        gap: "24px"
      }}
    >
      <div style={{ display: "grid", gap: "12px" }}>
        <span className="eyebrow">{isSignup ? "Create account" : "Welcome back"}</span>
        <h1 style={{ margin: 0, fontSize: "clamp(2.5rem, 6vw, 3.5rem)", letterSpacing: "-0.06em" }}>
          {isSignup ? "Start collecting trade-ins." : "Sign in to your workspace."}
        </h1>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
          {isSignup
            ? "Create a customer account to submit your device details and manage requests."
            : "Use your Firebase-authenticated account to access the protected dashboard."}
        </p>
      </div>

      <form action={handleSubmit} style={{ display: "grid", gap: "16px" }}>
        {isSignup ? (
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" placeholder="Taylor Smith" type="text" />
          </div>
        ) : null}

        <div className="field">
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" placeholder="name@example.com" required type="email" />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" minLength={6} name="password" placeholder="At least 6 characters" required type="password" />
        </div>

        {error ? <p className="status-text status-error">{error}</p> : null}

        <button className="button button-primary" disabled={isPending} type="submit">
          {isPending ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
        </button>
      </form>

      <p style={{ margin: 0, color: "var(--muted)" }}>
        {isSignup ? "Already have an account?" : "Need an account?"}{" "}
        <Link href={isSignup ? "/login" : "/signup"} style={{ fontWeight: 700 }}>
          {isSignup ? "Sign in" : "Create one"}
        </Link>
      </p>
    </div>
  );
}
