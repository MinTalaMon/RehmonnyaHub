"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useSidebarDrawer } from "@/components/SidebarDrawerContext";
import type { Community } from "@/types";

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [communities, setCommunities] = useState<Community[]>([]);
  const { open: drawerOpen, setOpen: setDrawerOpen } = useSidebarDrawer();

  useEffect(() => {
    apiFetch<Community[]>("/communities").then(setCommunities);
  }, []);

  const activeSlug = pathname?.startsWith("/c/")
    ? pathname.split("/c/")[1]
    : searchParams.get("community") ?? "";

  const activeSort = searchParams.get("sort") ?? "";
  const isHomeActive = pathname === "/" && !activeSlug && !activeSort;
  const isPopularActive = pathname === "/" && activeSort === "popular";
  const isNewActive = pathname === "/" && activeSort === "new";
  const isExploreActive = pathname === "/explore";

  const linkClass = (type: string, slug?: string) => {
    let isActive = false;

    if (type === "home") isActive = isHomeActive;
    else if (type === "popular") isActive = isPopularActive;
    else if (type === "new") isActive = isNewActive;
    else if (type === "explore") isActive = isExploreActive;
    else if (type === "community") isActive = slug === activeSlug;

    return `block rounded border px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "border-mon-red/50 bg-mon-red/10 text-mon-red"
        : "border-transparent text-mon-text hover:border-mon-red/30 hover:bg-mon-red/10"
    }`;
  };

  const sidebarContent = (
    <div className="flex h-full flex-col gap-4 pb-4">
      {/* Main Navigation */}
      <div className="rounded-lg border border-mon-red/20 bg-white p-4 shadow-mon-card">
        <h2 className="mb-3 text-lg font-semibold text-mon-red">Navigation</h2>
        <div className="space-y-1">
          <Link href="/" className={linkClass("home")}>
            🏠 Home
          </Link>
          <Link href="/?sort=popular" className={linkClass("popular")}>
            🔥 Popular
          </Link>
          <Link href="/?sort=new" className={linkClass("new")}>
            🆕 News
          </Link>
          <Link href="/explore" className={linkClass("explore")}>
            🔍 Explore
          </Link>
        </div>
      </div>

      {/* Communities Section */}
      <div className="rounded-lg border border-mon-red/20 bg-white p-4 shadow-mon-card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-mon-red">Communities</h2>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded bg-mon-red/10 text-mon-red transition hover:bg-mon-red/20 lg:hidden"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>
        <p className="mb-3 text-sm text-slate-600">Browse or jump to a community.</p>
        <div className="space-y-1">
          <Link href="/" className={linkClass("home")}>
            📄 All Communities
          </Link>
          {communities.slice(0, 5).map((community) => (
            <Link
              key={community.id}
              href={`/c/${community.slug}`}
              className={linkClass("community", community.slug)}
            >
              {community.name}
            </Link>
          ))}
          {communities.length > 5 && (
            <Link href="/explore" className="block rounded border border-transparent px-3 py-2 text-sm font-medium text-mon-text hover:border-mon-red/30 hover:bg-mon-red/10">
              View All Communities →
            </Link>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-mon-red/20 bg-white p-4 shadow-mon-card">
        <h2 className="mb-3 text-lg font-semibold text-mon-red">Actions</h2>
        <div className="space-y-2">
          <Link
            href="/create-post"
            className="block rounded border border-mon-red/20 bg-mon-red/10 px-3 py-2 text-sm font-medium text-mon-red transition hover:bg-mon-red/20"
          >
            ✏️ Create Post
          </Link>
        </div>
      </div>

      {/* Footer Links */}
      <div className="rounded-lg border border-mon-red/20 bg-white p-4 shadow-mon-card mt-auto">
        <h2 className="mb-3 text-lg font-semibold text-mon-red">About</h2>
        <div className="space-y-1">
          <Link href="/about" className="block text-sm text-slate-600 hover:text-mon-red transition">
            ℹ️ About Us
          </Link>
          <Link href="/privacy" className="block text-sm text-slate-600 hover:text-mon-red transition">
            🔒 Privacy Policy
          </Link>
          <Link href="/terms" className="block text-sm text-slate-600 hover:text-mon-red transition">
            📋 Terms of Service
          </Link>
          <Link href="/contact" className="block text-sm text-slate-600 hover:text-mon-red transition">
            📧 Contact
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col gap-4 overflow-y-auto lg:flex">{sidebarContent}</aside>

      {/* Mobile drawer overlay */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="sticky top-16 relative z-50 flex h-[calc(100vh-4rem)] w-72 flex-col border-r border-mon-red/20 bg-mon-surface p-4 overflow-y-auto">
            {sidebarContent}
          </div>
        </div>
      ) : null}
    </>
  );
}

