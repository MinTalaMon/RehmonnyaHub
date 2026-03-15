"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Top-level navigation with auth-aware actions.
export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold text-indigo-700">RehmonnyaHub</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/create-post" className="font-medium text-indigo-600">Create Post</Link>
          {email ? (
            <>
              <Link href="/profile" className="text-slate-700">{email}</Link>
              <button onClick={logout} className="rounded bg-slate-200 px-3 py-1">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-indigo-600">Login</Link>
              <Link href="/register" className="text-indigo-600">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
