import CreateExpense from "@/components/create-expense/CreateExpense";
import ExpenseTrackerDashboard from "@/components/dashboard/ExpenseTrackerDashboard";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CreateExpensePage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-0">
      <CreateExpense />
    </div>
  );
}
