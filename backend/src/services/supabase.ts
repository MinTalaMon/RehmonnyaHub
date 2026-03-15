import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

// Public client for non-privileged data access and JWT verification.
export const supabasePublic = createClient(env.supabaseUrl, env.supabasePublishableKey);

// Service role client for seed and privileged operations.
export const supabaseService = env.supabaseServiceRoleKey
  ? createClient(env.supabaseUrl, env.supabaseServiceRoleKey)
  : null;

// Builds a user-scoped client so RLS policies run with that user's JWT.
export const createUserClient = (jwt: string) =>
  createClient(env.supabaseUrl, env.supabasePublishableKey, {
    global: { headers: { Authorization: `Bearer ${jwt}` } }
  });
