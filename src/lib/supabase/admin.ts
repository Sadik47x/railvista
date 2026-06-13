import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseAdminConfigured = (): boolean => {
  return (
    !!supabaseUrl &&
    !!supabaseServiceKey &&
    supabaseUrl !== "your-supabase-project-url" &&
    supabaseUrl !== "your_supabase_project_url" &&
    supabaseServiceKey !== "your-supabase-service-role-key" &&
    supabaseServiceKey !== "your_supabase_service_role_key"
  );
};

export const supabaseAdmin = isSupabaseAdminConfigured()
  ? createClient<Database>(supabaseUrl!, supabaseServiceKey!)
  : null;
