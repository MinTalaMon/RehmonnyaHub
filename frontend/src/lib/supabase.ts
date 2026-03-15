import { createClient } from "@supabase/supabase-js";

// Browser Supabase client shared across pages and components.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
