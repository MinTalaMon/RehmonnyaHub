import Link from "next/link";
import PostCard from "@/components/PostCard";
import { apiFetch } from "@/lib/api";
import type { Post } from "@/types";

// Home feed with latest and top filters.
export default async function Home({ searchParams }: { searchParams: { sort?: string } }) {
  const sort = searchParams.sort === "top" ? "top" : "latest";
  const posts = await apiFetch<Post[]>(`/posts?sort=${sort}`);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Home Feed</h1>
        <div className="flex gap-2 text-sm">
          <Link className={`rounded px-3 py-1 ${sort === "latest" ? "bg-indigo-600 text-white" : "bg-white"}`} href="/?sort=latest">Latest</Link>
          <Link className={`rounded px-3 py-1 ${sort === "top" ? "bg-indigo-600 text-white" : "bg-white"}`} href="/?sort=top">Top</Link>
        </div>
      </div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
