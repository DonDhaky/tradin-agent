import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth-form";
import { SiteHeader } from "@/components/site-header";
import { getCurrentUser } from "@/lib/auth/session";

export default async function SignupPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <>
      <SiteHeader />
      <main className="section">
        <div className="page-shell">
          <AuthForm mode="signup" />
        </div>
      </main>
    </>
  );
}
