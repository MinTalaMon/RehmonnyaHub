import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import type { AuthenticatedRequest } from "../types.js";
import { createUserClient, supabasePublic } from "../services/supabase.js";
import { sanitizeInput } from "../utils/sanitize.js";

const router = Router();

const createCommentSchema = z.object({
  content: z.string().min(1).max(4000),
  parent_comment_id: z.number().int().positive().optional()
});

router.get("/posts/:id/comments", async (req, res) => {
  const postId = Number(req.params.id);
  if (Number.isNaN(postId)) return res.status(400).json({ error: "Invalid post id." });

  const { data, error } = await supabasePublic
    .from("comments")
    .select("id, content, parent_comment_id, created_at, user_id, users(username)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

router.post("/posts/:id/comments", requireAuth, async (req: AuthenticatedRequest, res) => {
  const postId = Number(req.params.id);
  if (Number.isNaN(postId)) return res.status(400).json({ error: "Invalid post id." });

  const parsed = createCommentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const client = createUserClient(req.token!);

  // Enforce one-level nesting: parent comments cannot themselves be replies.
  if (parsed.data.parent_comment_id) {
    const { data: parent, error: parentError } = await supabasePublic
      .from("comments")
      .select("id, parent_comment_id")
      .eq("id", parsed.data.parent_comment_id)
      .single();

    if (parentError || !parent || parent.parent_comment_id !== null) {
      return res.status(400).json({ error: "Only one-level comment nesting is allowed." });
    }
  }

  const { data, error } = await client
    .from("comments")
    .insert({
      post_id: postId,
      user_id: req.user!.id,
      content: sanitizeInput(parsed.data.content),
      parent_comment_id: parsed.data.parent_comment_id ?? null
    })
    .select("id, content, parent_comment_id, created_at")
    .single();

  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
});

router.delete("/comments/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid comment id." });

  const client = createUserClient(req.token!);
  const { error } = await client.from("comments").delete().eq("id", id);

  if (error) return res.status(403).json({ error: error.message });
  return res.json({ success: true });
});

export default router;
