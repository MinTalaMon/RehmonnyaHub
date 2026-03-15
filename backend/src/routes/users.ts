import { Router } from "express";
import { supabasePublic } from "../services/supabase.js";

const router = Router();

// Returns a single user profile by auth user id.
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabasePublic
    .from("users")
    .select("id, username, avatar_url, bio, is_admin, created_at")
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: error.message });
  return res.json(data);
});

export default router;
