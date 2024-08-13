import { Database } from "./supabase";

export type creditsRow = Database["public"]["Tables"]["credits"]["Row"];
export type prdDocumentsRow =
  Database["public"]["Tables"]["prd_documents"]["Row"];
export type projectsRow = Database["public"]["Tables"]["projects"]["Row"];
export type tasksRow = Database["public"]["Tables"]["tasks"]["Row"];
