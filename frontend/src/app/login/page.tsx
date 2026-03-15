"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    window.location.href = "/";
  };

  return (
    <div className="mx-auto max-w-md rounded border bg-white p-6">
      <h1 className="mb-4 text-xl font-bold">Login</h1>
      <input className="mb-3 w-full rounded border p-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input className="mb-3 w-full rounded border p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={login} className="w-full rounded bg-indigo-600 px-4 py-2 text-white">Login</button>
      <p className="mt-3 text-sm">No account? <Link href="/register" className="text-indigo-600">Register</Link></p>
    </div>
  );
}
