"use server";

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createStreamableValue } from "ai/rsc";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/types/supabase";
import { revalidatePath } from "next/cache";

export async function generatePRD(projectsId: string) {
  console.log("Starting PRD generation for project:", projectsId);
  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("User not authenticated");
    throw new Error("Unauthorized. Please log in.");
  }

  console.log("Authenticated user:", user.id);

  // Check if PRD already exists and get the latest version
  const { data: existingPRD, error: prdError } = await supabase
    .from("prd_documents")
    .select("content, version")
    .eq("project_id", projectsId)
    .eq("user_id", user.id)
    .order("version", { ascending: false })
    .limit(1)
    .single();

  if (prdError) {
    console.error("Error fetching existing PRD:", prdError);
  } else {
    console.log("Existing PRD:", existingPRD);
  }

  const newVersion = existingPRD?.version ? existingPRD.version + 1 : 1;
  console.log("New PRD version will be:", newVersion);

  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectsId)
    .eq("user_id", user.id)
    .single();

  if (projectError) {
    console.error("Error fetching project data:", projectError);
    throw new Error("Project not found");
  }

  console.log("Project data fetched successfully");

  const prompt = `Create a Product Requirements Document (PRD) for the following product:

Product Name: ${projectData.product_name || ""}
Feature Name: ${projectData.feature_name || ""}
Overview: ${projectData.overview || ""}
Feature List: ${projectData.feature_list || ""}
User Feedback: ${projectData.user_feedback || ""}
Additional Details: ${projectData.additional_details || ""}

Please format the PRD in Markdown and include the following sections:
1. Introduction
2. Product Overview
3. Features and Requirements
4. User Stories
5. Non-Functional Requirements
6. Constraints and Assumptions
7. Milestones and Timeline`;

  const stream = createStreamableValue("");

  (async () => {
    console.log("Starting OpenAI stream");
    const { textStream } = await streamText({
      model: openai("gpt-3.5-turbo"),
      messages: [{ role: "user", content: prompt }],
    });

    let fullContent = "";
    for await (const delta of textStream) {
      fullContent += delta;
      stream.update(delta);
    }
    console.log("OpenAI stream completed");

    console.log("Saving PRD to Supabase");
    const { error: upsertError } = await supabase
      .from("prd_documents")
      .upsert({
        project_id: projectsId,
        user_id: user.id,
        content: fullContent,
        version: newVersion,
      })
      .eq("project_id", projectsId)
      .eq("version", newVersion);

    if (upsertError) {
      console.error("Error saving PRD to Supabase:", upsertError);
    } else {
      console.log("PRD saved successfully");
    }

    revalidatePath("/dashboard");

    stream.done();
  })();

  return { output: stream.value, version: newVersion };
}
