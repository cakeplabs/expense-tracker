// "use server";

// import { Database } from "@/types/supabase";
// import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import OpenAI from "openai";
// import { revalidatePath } from "next/cache";

// const openaiApiKey = process.env.OPENAI_API_KEY;

// if (!openaiApiKey) {
//   throw new Error("MISSING OPENAI_API_KEY!");
// }

// const openai = new OpenAI({ apiKey: openaiApiKey });

// export async function generatePRD(formData: FormData) {
//   console.log("Starting PRD generation process...");

//   // Extract form data
//   const productName = formData.get("productName") as string;
//   const featureName = formData.get("featureName") as string;
//   const overview = formData.get("overview") as string;
//   const featureList = formData.get("featureList") as string;
//   const userFeedback = formData.get("userFeedback") as string;
//   const additionalDetails = formData.get("additionalDetails") as string;

//   console.log("Received form data:", {
//     productName,
//     featureName,
//     overview,
//     featureList,
//     userFeedback,
//     additionalDetails,
//   });

//   // Validate required fields
//   if (!productName || !featureName || !overview) {
//     console.error("Missing required fields");
//     return { success: false, error: "Missing required fields" };
//   }

//   const supabase = createServerActionClient<Database>({ cookies });

//   // Authenticate user
//   const {
//     data: { user },
//     error: userError,
//   } = await supabase.auth.getUser();

//   if (userError) {
//     console.error("Error fetching user:", userError);
//     return {
//       success: false,
//       error: `Authentication error: ${userError.message}`,
//     };
//   }

//   if (!user) {
//     console.error("No authenticated user found");
//     return { success: false, error: "Unauthorized. Please log in." };
//   }

//   try {
//     console.log("Generating PRD content using OpenAI...");
//     const prompt = `Create a Product Requirements Document (PRD) for the following product:

// Product Name: ${productName}
// Feature Name: ${featureName}
// Overview: ${overview}
// Feature List: ${featureList || "N/A"}
// User Feedback: ${userFeedback || "N/A"}
// Additional Details: ${additionalDetails || "N/A"}

// Please format the PRD in Markdown and include the following sections:
// 1. Introduction
// 2. Product Overview
// 3. Features and Requirements
// 4. User Stories
// 5. Non-Functional Requirements
// 6. Constraints and Assumptions
// 7. Milestones and Timeline`;

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [{ role: "user", content: prompt }],
//     });

//     const prdContent = completion.choices[0].message.content;
//     if (!prdContent) {
//       console.error("Failed to generate PRD content");
//       return { success: false, error: "Failed to generate PRD content" };
//     }

//     console.log("PRD content generated successfully");

//     // Store the PRD document
//     console.log("Storing product requirement in the database...");
//     const { data: productRequirement, error: productRequirementError } =
//       await supabase
//         .from("prd_documents")
//         .insert({
//           user_id: user.id,
//           product_name: productName,
//           feature_name: featureName,
//           overview: overview,
//           feature_list: featureList,
//           user_feedback: userFeedback,
//           additional_details: additionalDetails,
//           content: prdContent,
//         })
//         .select()
//         .single();

//     //     if (productRequirementError) {
//     //       console.error(
//     //         "Error storing product requirement:",
//     //         productRequirementError
//     //       );
//     //       return {
//     //         success: false,
//     //         error: `Database error: ${productRequirementError.message}`,
//     //       };
//     //     }

//     //     if (!productRequirement) {
//     //       console.error("Failed to create product requirement entry");
//     //       return {
//     //         success: false,
//     //         error: "Failed to create product requirement entry",
//     //       };
//     //     }

//     //     console.log("Product requirement stored successfully");

//     //     console.log("Storing PRD document in the database...");
//     //     const { data: prdDocument, error: prdError } = await supabase
//     //       .from("prd_documents")
//     //       .insert({
//     //         product_requirement_id: productRequirement.id,
//     //         content: prdContent,
//     //       })
//     //       .select()
//     //       .single();

//     //     if (prdError) {
//     //       console.error("Error storing PRD document:", prdError);
//     //       return { success: false, error: `Database error: ${prdError.message}` };
//     //     }

//     //     if (!prdDocument) {
//     //       console.error("Failed to create PRD document entry");
//     //       return { success: false, error: "Failed to create PRD document entry" };
//     //     }

//     //     console.log("PRD document stored successfully");

//     //     // Generate tasks based on the PRD
//     //     console.log("Generating tasks...");
//     //     const taskPrompt = `Based on the following PRD, generate a list of tasks that need to be completed to implement this product. Format each task as a JSON object with 'title', 'description', and 'priority' fields. The 'priority' field should be one of 'High', 'Medium', or 'Low'. Return the list as a JSON array.

//     // ${prdContent}`;

//     //     const taskCompletion = await openai.chat.completions.create({
//     //       model: "gpt-4",
//     //       messages: [{ role: "user", content: taskPrompt }],
//     //     });

//     //     const taskContent = taskCompletion.choices[0].message.content;
//     //     if (!taskContent) {
//     //       console.error("Failed to generate tasks");
//     //       return { success: false, error: "Failed to generate tasks" };
//     //     }

//     //     let tasks;
//     //     try {
//     //       tasks = JSON.parse(taskContent);
//     //     } catch (error) {
//     //       console.error("Error parsing tasks JSON:", error);
//     //       return { success: false, error: "Failed to parse generated tasks" };
//     //     }

//     //     if (!Array.isArray(tasks)) {
//     //       console.error("Generated tasks are not in the expected format");
//     //       return {
//     //         success: false,
//     //         error: "Generated tasks are not in the expected format",
//     //       };
//     //     }

//     //     console.log("Tasks generated successfully");

//     //     // Store the generated tasks
//     //     console.log("Storing tasks in the database...");
//     //     const { error: tasksError } = await supabase.from("tasks").insert(
//     //       tasks.map((task: any, index: number) => ({
//     //         prd_document_id: prdDocument.id,
//     //         title: task.title || "Untitled Task",
//     //         description: task.description || "",
//     //         priority: task.priority || "Medium",
//     //         status: "To Do",
//     //         order: index + 1,
//     //         due_date: null, // You might want to generate this based on some logic or leave it for user input
//     //       }))
//     //     );

//     //     if (tasksError) {
//     //       console.error("Error storing tasks:", tasksError);
//     //       return { success: false, error: `Database error: ${tasksError.message}` };
//     //     }

//     //     console.log("Tasks stored successfully");

//     // Revalidate the path to update the UI
//     revalidatePath("/dashboard");

//     return { success: true, prdId: productRequirement.id };
//   } catch (e) {
//     console.error("Unexpected error:", e);
//     return {
//       success: false,
//       error: `Unexpected error: ${(e as Error).message}`,
//       details: JSON.stringify(e),
//     };
//   }
// }
