"use client";

import Link from "next/link";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import type { Post } from "@/types";

// Reusable feed card with vote controls.
export default function PostCard({ post }: { post: Post }) {
  const [score, setScore] = useState(post.score);
  const [loading, setLoading] = useState(false);

  const vote = async (value: 1 | -1) => {
    setLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Please log in to vote.");

      const payload = await apiFetch<{ score: number }>("/vote", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ post_id: post.id, value })
      });
      setScore(payload.score);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-2 text-xs text-slate-500">
        <Link href={`/c/${post.communities?.slug ?? ""}`} className="font-semibold text-indigo-600">
          c/{post.communities?.slug}
        </Link>{" "}
        • by {post.users?.username ?? "unknown"}
      </div>
      <Link href={`/post/${post.id}`} className="text-lg font-semibold hover:text-indigo-700">{post.title}</Link>
      <p className="mt-2 line-clamp-3 text-sm text-slate-700">{post.content}</p>
      {post.image_url ? <img src={post.image_url} alt={post.title} className="mt-3 max-h-80 w-full rounded object-cover" /> : null}
      <div className="mt-3 flex items-center gap-2 text-sm">
        <button disabled={loading} onClick={() => vote(1)} className="rounded bg-emerald-100 px-2 py-1">⬆</button>
        <span>{score}</span>
        <button disabled={loading} onClick={() => vote(-1)} className="rounded bg-rose-100 px-2 py-1">⬇</button>
      </div>
    </article>
  );
}
