"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return alert(error.message);
    alert("Account created. If email confirmation is enabled, verify your inbox.");
    window.location.href = "/login";
  };

  return (
    <div className="mx-auto max-w-md rounded border bg-white p-6">
      <h1 className="mb-4 text-xl font-bold">Register</h1>
      <input className="mb-3 w-full rounded border p-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input className="mb-3 w-full rounded border p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={register} className="w-full rounded bg-indigo-600 px-4 py-2 text-white">Create account</button>
      <p className="mt-3 text-sm">Already registered? <Link href="/login" className="text-indigo-600">Login</Link></p>
    </div>
  );
}
