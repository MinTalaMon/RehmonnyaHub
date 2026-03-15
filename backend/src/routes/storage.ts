import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import type { AuthenticatedRequest } from "../types.js";
import { createUserClient } from "../services/supabase.js";

const router = Router();

const createUploadUrlSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1)
});

// Creates a signed upload URL so frontend can upload post images directly to Supabase Storage.
router.post("/storage/upload-url", requireAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = createUploadUrlSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const client = createUserClient(req.token!);
  const safeName = parsed.data.filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const path = `${req.user!.id}/${Date.now()}-${safeName}`;

  const { data, error } = await client.storage.from("post-images").createSignedUploadUrl(path);
  if (error) return res.status(400).json({ error: error.message });

  return res.json({ ...data, path });
});

export default router;
