import ExpenseTrackerDashboard from "@/components/dashboard/ExpenseTrackerDashboard";
import ClientSidePrdList from "@/components/prd/ClientSidePrdList";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id);

  return (
    <div className="container mx-auto px-0 py-16">
      {/* <ClientSidePrdList projectModels={projects ?? []} /> */}
      <ExpenseTrackerDashboard />
    </div>
  );
}
