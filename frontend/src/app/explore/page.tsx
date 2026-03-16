"use client";

import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import { apiFetch } from "@/lib/api";
import type { Post } from "@/types";

export default function ExplorePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Post[]>("/posts").then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-mon-red/20 bg-white p-6 shadow-mon-card">
          <h1 className="text-2xl font-bold text-mon-red">🔍 Explore Communities</h1>
          <p className="mt-2 text-slate-600">Discover new communities and trending posts.</p>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-lg border border-mon-red/20 bg-white p-4 shadow-mon-card">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-mon-red/20 bg-white p-6 shadow-mon-card">
        <h1 className="text-2xl font-bold text-mon-red">🔍 Explore Communities</h1>
        <p className="mt-2 text-slate-600">Discover new communities and trending posts across RehmonnyaHub.</p>
      </div>

      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="rounded-lg border border-mon-red/20 bg-white p-6 shadow-mon-card text-center">
            <p className="text-slate-600">No posts found. Be the first to create one!</p>
          </div>
        )}
      </div>
    </div>
  );
}