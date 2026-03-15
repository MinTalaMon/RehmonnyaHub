import { Router } from "express";
import { supabasePublic } from "../services/supabase.js";

const router = Router();

// Lists all communities for navigation and discovery.
router.get("/", async (_req, res) => {
  const { data, error } = await supabasePublic
    .from("communities")
    .select("id, slug, name, description, created_at")
    .order("created_at", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// Returns community detail by slug with latest posts.
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  const { data: community, error: communityError } = await supabasePublic
    .from("communities")
    .select("id, slug, name, description, created_at")
    .eq("slug", slug)
    .single();

  if (communityError || !community) return res.status(404).json({ error: "Community not found." });

  const { data: posts, error: postsError } = await supabasePublic
    .from("posts")
    .select(
      "id, title, content, image_url, score, created_at, user_id, users(username), community_id"
    )
    .eq("community_id", community.id)
    .order("created_at", { ascending: false });

  if (postsError) return res.status(500).json({ error: postsError.message });
  return res.json({ ...community, posts });
});

export default router;
