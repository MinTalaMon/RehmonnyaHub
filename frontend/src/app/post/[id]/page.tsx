"use client";

import { useEffect, useState } from "react";
import CommentList from "@/components/CommentList";
import { apiFetch } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import type { Comment, Post } from "@/types";

interface PostDetail extends Post {
  comments: Comment[];
}

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<PostDetail | null>(null);
  const [content, setContent] = useState("");
  const [parentCommentId, setParentCommentId] = useState<string>("");

  const loadPost = async () => {
    const payload = await apiFetch<PostDetail>(`/posts/${params.id}`);
    setPost(payload);
  };

  useEffect(() => {
    loadPost();
  }, [params.id]);

  const addComment = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Please log in first.");

      await apiFetch(`/posts/${params.id}/comments`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          content,
          parent_comment_id: parentCommentId ? Number(parentCommentId) : undefined
        })
      });
      setContent("");
      setParentCommentId("");
      await loadPost();
    } catch (error) {
      alert((error as Error).message);
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <article className="rounded border bg-white p-4">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <p className="mt-2 whitespace-pre-wrap">{post.content}</p>
        {post.image_url ? <img src={post.image_url} alt={post.title} className="mt-3 rounded" /> : null}
      </article>

      <section className="rounded border bg-white p-4">
        <h2 className="mb-2 text-lg font-semibold">Add Comment</h2>
        <textarea className="w-full rounded border p-2" value={content} onChange={(e) => setContent(e.target.value)} rows={3} />
        <input
          className="mt-2 w-full rounded border p-2"
          placeholder="Optional parent comment ID for reply"
          value={parentCommentId}
          onChange={(e) => setParentCommentId(e.target.value)}
        />
        <button onClick={addComment} className="mt-2 rounded bg-indigo-600 px-4 py-2 text-white">Comment</button>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Comments</h2>
        <CommentList comments={post.comments} />
      </section>
    </div>
  );
}
