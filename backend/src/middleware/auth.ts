import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../types.js";
import { supabasePublic } from "../services/supabase.js";

// Validates Supabase access tokens and attaches user info to req.
export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header." });
  }

  const token = authHeader.slice("Bearer ".length);
  const { data, error } = await supabasePublic.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  req.user = { id: data.user.id, email: data.user.email };
  req.token = token;
  next();
};
