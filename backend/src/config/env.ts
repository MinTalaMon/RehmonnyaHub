import dotenv from "dotenv";

dotenv.config();

// Centralized environment variable parsing to keep the app boot predictable.
export const env = {
  port: Number(process.env.PORT ?? 4000),
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000"
};

if (!env.supabaseUrl || !env.supabasePublishableKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY in environment variables.");
}
