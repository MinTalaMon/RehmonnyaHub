import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import type { AuthenticatedRequest } from "../types.js";
import { createUserClient, supabasePublic } from "../services/supabase.js";
import { sanitizeInput } from "../utils/sanitize.js";

const router = Router();

const createPostSchema = z.object({
  community_id: z.string().uuid(),
  title: z.string().min(3).max(200),
  content: z.string().min(1).max(10000),
  image_url: z.string().url().optional().or(z.literal(""))
});

// Feed endpoint supporting latest or top sorting.
router.get("/", async (req, res) => {
  const sort = req.query.sort === "top" ? "top" : req.query.sort === "new" ? "new" : "hot";
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const community = typeof req.query.community === "string" ? req.query.community.trim() : "";

  let query = supabasePublic
    .from("posts")
    .select(
      "id, title, content, image_url, score, created_at, community_id, communities(name, slug), user_id, users(username)"
    );

  if (community) {
    query = query.eq("communities.slug", community);
  }

  if (q) {
    const like = `%${q.replace(/%/g, "\\%")}%`;
    query = query.or(`title.ilike.${like},content.ilike.${like}`);
  }

  query = sort === "top" ? query.order("score", { ascending: false }) : query.order("created_at", { ascending: false });

  const { data, error } = await query.limit(50);
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// Returns a single post and related comments.
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid post id." });

  const { data: post, error: postError } = await supabasePublic
    .from("posts")
    .select(
      "id, title, content, image_url, score, created_at, community_id, communities(name, slug), user_id, users(username)"
    )
    .eq("id", id)
    .single();

  if (postError || !post) return res.status(404).json({ error: "Post not found." });

  const { data: comments, error: commentsError } = await supabasePublic
    .from("comments")
    .select("id, content, parent_comment_id, created_at, user_id, users(username)")
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  if (commentsError) return res.status(500).json({ error: commentsError.message });

  return res.json({ ...post, comments });
});

// Creates a post as the logged-in user.
router.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = createPostSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const client = createUserClient(req.token!);
  const { community_id, title, content, image_url } = parsed.data;

  // Sanitize user input to prevent XSS
  const sanitizedTitle = sanitizeInput(title);
  const sanitizedContent = sanitizeInput(content);

  const { data, error } = await client
    .from("posts")
    .insert({
      community_id,
      title: sanitizedTitle,
      content: sanitizedContent,
      image_url: image_url || null,
      user_id: req.user!.id
    })
    .select("id, title, content, image_url, score, created_at")
    .single();

  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
});

// Deletes post if user owns it or is admin via RLS policy.
router.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid post id." });

  const client = createUserClient(req.token!);
  const { error } = await client.from("posts").delete().eq("id", id);

  if (error) return res.status(403).json({ error: error.message });
  return res.json({ success: true });
});

export default router;
