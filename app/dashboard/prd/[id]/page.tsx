import Login from "@/app/login/page";
import PRDStreamHandler from "@/components/prd/PRDStreamHandler";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FaArrowDown } from "react-icons/fa";

export const dynamic = "force-dynamic";

export default async function PRDGenerator({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <Login />;
  }

  const { data: projectData } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!projectData) {
    redirect("/dashboard");
  }

  const { data: prdVersions } = await supabase
    .from("prd_documents")
    .select("*")
    .eq("project_id", params.id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div id="train-model-container" className="w-full h-full">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Generate PRD</h1>
        {prdVersions && prdVersions.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">PRD Versions</h2>
            {prdVersions.map((prd, index) => (
              <div key={prd.id} className="mb-8">
                <h3 className="text-lg font-medium">
                  Version {prdVersions.length - index}
                  <span className="text-sm font-normal ml-2">
                    ({new Date(prd.created_at).toLocaleString()})
                  </span>
                </h3>
                <pre className="bg-gray-100 p-4 rounded-md mt-2 overflow-x-auto">
                  {prd.content}
                </pre>
                {index < prdVersions.length - 1 && (
                  <div className="flex justify-center my-4">
                    <FaArrowDown className="text-2xl text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <PRDStreamHandler projectId={params.id} />
        )}
      </div>
    </div>
  );
}
