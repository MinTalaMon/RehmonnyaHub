import PostCard from "@/components/PostCard";
import { apiFetch } from "@/lib/api";
import type { Post } from "@/types";

interface CommunityResponse {
  id: string;
  slug: string;
  name: string;
  description: string;
  posts: Post[];
}

export default async function CommunityPage({ params }: { params: { slug: string } }) {
  const community = await apiFetch<CommunityResponse>(`/communities/${params.slug}`);

  return (
    <div className="space-y-4">
      <header className="rounded-lg border border-mon-red/20 bg-white p-4 shadow-mon-card">
        <h1 className="text-2xl font-bold text-mon-red">c/{community.slug}</h1>
        <p className="text-slate-600">{community.description}</p>
      </header>
      {community.posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
