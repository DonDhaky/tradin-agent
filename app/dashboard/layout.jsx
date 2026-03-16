import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard-header";
import { getCurrentUser } from "@/lib/auth/session";

export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="section">
      <div className="page-shell" style={{ display: "grid", gap: "24px" }}>
        <DashboardHeader user={user} />
        {children}
      </div>
    </main>
  );
}
