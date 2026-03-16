import { ProductForm } from "@/components/product-form";
import { SubmissionList } from "@/components/submission-list";
import { getCurrentUser } from "@/lib/auth/session";
import { getTradeInRequestsForUser } from "@/lib/firestore/trade-in-requests";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const submissions = user ? await getTradeInRequestsForUser(user.uid) : [];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "24px"
      }}
    >
      <ProductForm />
      <SubmissionList submissions={submissions} />
    </div>
  );
}
