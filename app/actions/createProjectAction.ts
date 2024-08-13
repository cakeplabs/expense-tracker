"use server";

import { Database } from "@/types/supabase";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import OpenAI from "openai";
import { revalidatePath } from "next/cache";

const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  throw new Error("MISSING OPENAI_API_KEY!");
}

const openai = new OpenAI({ apiKey: openaiApiKey });

export async function createProjectAction(formData: FormData) {
  console.log("Starting PRD generation process...");

  // Extract form data
  const productName = formData.get("productName") as string;
  const featureName = formData.get("featureName") as string;
  const overview = formData.get("overview") as string;
  const featureList = formData.get("featureList") as string;
  const userFeedback = formData.get("userFeedback") as string;
  const additionalDetails = formData.get("additionalDetails") as string;

  console.log("Received form data:", {
    productName,
    featureName,
    overview,
    featureList,
    userFeedback,
    additionalDetails,
  });

  // Validate required fields
  if (!productName || !featureName || !overview) {
    console.error("Missing required fields");
    return { success: false, error: "Missing required fields" };
  }

  const supabase = createServerActionClient<Database>({ cookies });

  // Authenticate user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error fetching user:", userError);
    return {
      success: false,
      error: `Authentication error: ${userError.message}`,
    };
  }

  if (!user) {
    console.error("No authenticated user found");
    return { success: false, error: "Unauthorized. Please log in." };
  }

  try {
    const { data: projectsData, error: projectsDataError } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        product_name: productName,
        feature_name: featureName,
        overview: overview,
        feature_list: featureList,
        user_feedback: userFeedback,
        additional_details: additionalDetails,
      })
      .select()
      .single();

    if (projectsDataError) {
      console.error(
        "Error storing product requirement:",
        projectsDataError.message
      );
      return {
        success: false,
        error: `Database error: ${projectsDataError.message}`,
      };
    }

    if (!projectsData) {
      console.error("Failed to create product requirement entry");
      return {
        success: false,
        error: "Failed to create product requirement entry",
      };
    }

    // Revalidate the path to update the UI
    revalidatePath("/dashboard");

    return { success: true, prdId: projectsData.id };
  } catch (e) {
    console.error("Unexpected error:", e);
    return {
      success: false,
      error: `Unexpected error: ${(e as Error).message}`,
      details: JSON.stringify(e),
    };
  }
}
