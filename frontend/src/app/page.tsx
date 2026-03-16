import Link from "next/link";
import PostCard from "@/components/PostCard";
import { apiFetch } from "@/lib/api";
import type { Post } from "@/types";

// Home feed with Reddit-like hot/new/top sorting.
export default async function Home({
  searchParams
}: {
  searchParams: Promise<{ sort?: string; q?: string; community?: string }>;
}) {
  const params = await searchParams;
  const sort = params.sort === "top" ? "top" : params.sort === "new" ? "new" : "hot";
  const q = params.q?.trim() ?? "";
  const community = params.community?.trim() ?? "";

  const buildQuery = (overrides: Record<string, string | undefined>) => {
    const queryParams = new URLSearchParams();
    queryParams.set("sort", overrides.sort ?? sort);
    if (q) queryParams.set("q", q);
    if (community) queryParams.set("community", community);
    if (overrides.q !== undefined) {
      if (overrides.q) queryParams.set("q", overrides.q);
      else queryParams.delete("q");
    }
    if (overrides.community !== undefined) {
      if (overrides.community) queryParams.set("community", overrides.community);
      else queryParams.delete("community");
    }
    return queryParams.toString();
  };

  const posts = await apiFetch<Post[]>(`/posts?${buildQuery({})}`);

  const sortOptions = [
    { key: "hot", label: "Hot" },
    { key: "new", label: "New" },
    { key: "top", label: "Top" }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-mon-red">Home Feed</h1>
          {community ? (
            <p className="mt-1 text-sm text-slate-600">
              Showing posts from <span className="font-semibold text-mon-red">c/{community}</span>
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-600">Showing posts from all communities.</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <Link
              key={option.key}
              href={`/?${buildQuery({ sort: option.key })}`}
              className={`rounded px-3 py-1 font-medium transition ${
                sort === option.key
                  ? "bg-mon-red text-white"
                  : "bg-white text-mon-text hover:bg-mon-red/10"
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
