"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return (
    !!supabaseUrl &&
    !!supabaseAnonKey &&
    supabaseUrl !== "your-supabase-project-url" &&
    supabaseUrl !== "your_supabase_project_url" &&
    supabaseAnonKey !== "your-supabase-anon-key" &&
    supabaseAnonKey !== "your_supabase_anon_key"
  );
};

export const supabase = isSupabaseConfigured()
  ? createBrowserClient<Database>(supabaseUrl!, supabaseAnonKey!)
  : null;
