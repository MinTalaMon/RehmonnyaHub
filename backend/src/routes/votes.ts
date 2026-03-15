import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import type { AuthenticatedRequest } from "../types.js";
import { createUserClient, supabasePublic } from "../services/supabase.js";

const router = Router();

const voteSchema = z.object({
  post_id: z.number().int().positive(),
  value: z.union([z.literal(1), z.literal(-1)])
});

// Upserts a vote and returns the recalculated score.
router.post("/vote", requireAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = voteSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const client = createUserClient(req.token!);
  const { post_id, value } = parsed.data;

  const { error: voteError } = await client.from("votes").upsert(
    {
      post_id,
      user_id: req.user!.id,
      value
    },
    { onConflict: "post_id,user_id" }
  );

  if (voteError) return res.status(400).json({ error: voteError.message });

  const { data: voteRows, error: aggregateError } = await supabasePublic
    .from("votes")
    .select("value")
    .eq("post_id", post_id);

  if (aggregateError) return res.status(500).json({ error: aggregateError.message });

  const score = (voteRows ?? []).reduce((sum, row) => sum + row.value, 0);
  const { error: scoreUpdateError } = await client.from("posts").update({ score }).eq("id", post_id);

  if (scoreUpdateError) return res.status(500).json({ error: scoreUpdateError.message });
  return res.json({ post_id, score });
});

export default router;
