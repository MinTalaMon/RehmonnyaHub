"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useSidebarDrawer } from "@/components/SidebarDrawerContext";

// Top-level navigation with auth-aware actions.
export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string | null>(null);
  const [query, setQuery] = useState<string>(searchParams.get("q") ?? "");

  const communityFromPath = pathname?.startsWith("/c/") ? pathname.split("/c/")[1] : null;

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const { open: drawerOpen, setOpen: setDrawerOpen } = useSidebarDrawer();

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }

    // If user is browsing a community, keep the scope.
    if (communityFromPath) {
      params.set("community", communityFromPath);
    }

    router.push(`/?${params.toString()}`);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-mon-red/20 bg-white shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 p-4">
        <button
          type="button"
          className="mr-2 inline-flex items-center justify-center rounded p-2 text-mon-text transition hover:bg-mon-red/10 lg:hidden"
          onClick={() => setDrawerOpen(!drawerOpen)}
          aria-label="Toggle sidebar"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link href="/" className="text-xl font-bold text-mon-red">
          <span className="text-mon-gold">Reh</span>monnyaHub
        </Link>

        <form onSubmit={onSearch} className="hidden flex-1 items-center justify-center md:flex">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts..."
            className="w-full max-w-md rounded border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-mon-red focus:outline-none"
          />
          <button
            type="submit"
            className="ml-2 rounded bg-mon-red px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-mon-red-dark"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/create-post"
            className="rounded border border-mon-red/30 bg-white px-3 py-1 text-mon-red shadow-sm transition hover:bg-mon-red/5"
          >
            Create Post
          </Link>
          {email ? (
            <>
              <Link href="/profile" className="text-mon-text hover:text-mon-red">
                {email}
              </Link>
              <button
                onClick={logout}
                className="rounded bg-mon-red px-3 py-1 text-white shadow-sm transition hover:bg-mon-red-dark"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-mon-red hover:text-mon-red-dark">
                Login
              </Link>
              <Link href="/register" className="text-mon-red hover:text-mon-red-dark">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
