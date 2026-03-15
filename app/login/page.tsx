import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth-form";
import { SiteHeader } from "@/components/site-header";
import { getCurrentUser } from "@/lib/auth/session";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <>
      <SiteHeader />
      <main className="section">
        <div className="page-shell">
          <AuthForm mode="login" />
        </div>
      </main>
    </>
  );
}
