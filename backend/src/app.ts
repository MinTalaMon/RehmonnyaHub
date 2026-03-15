import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import usersRoutes from "./routes/users.js";
import communitiesRoutes from "./routes/communities.js";
import postsRoutes from "./routes/posts.js";
import commentsRoutes from "./routes/comments.js";
import votesRoutes from "./routes/votes.js";
import storageRoutes from "./routes/storage.js";

const app = express();

app.use(cors({ origin: env.frontendOrigin, credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/users", usersRoutes);
app.use("/communities", communitiesRoutes);
app.use("/posts", postsRoutes);
app.use(commentsRoutes);
app.use(votesRoutes);
app.use(storageRoutes);

export default app;
