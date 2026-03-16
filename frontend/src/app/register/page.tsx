"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { hashPassword, escapeHtml, isValidEmail, isValidPassword } from "@/lib/security";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const register = async () => {
    // Validate email format
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      setPasswordError("Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number");
      return;
    }

    // Hash password for additional client-side security
    const hashedPassword = hashPassword(password);

    // Note: Supabase will hash the password again on their servers
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password: hashedPassword
    });

    if (error) {
      const message = escapeHtml(error.message); // Escape HTML in error messages
      const lower = message.toLowerCase();

      if (lower.includes("email") || lower.includes("user")) {
        setEmailError(message);
        setEmail("");
      } else if (lower.includes("password")) {
        setPasswordError(message);
        setPassword("");
      } else {
        setEmailError(message);
        setPasswordError(message);
        setEmail("");
        setPassword("");
      }
      return;
    }

    alert("Account created. If email confirmation is enabled, verify your inbox.");
    window.location.href = "/login";
  };

  return (
    <div className="mx-auto max-w-md rounded-lg border border-mon-red/20 bg-white p-6 shadow-mon-card">
      <h1 className="mb-4 text-2xl font-bold text-mon-red">Register</h1>
      <div className="relative mb-3">
        <input
          className={`w-full rounded border p-2 ${emailError ? "border-mon-red" : "border-slate-200"}`}
          value={email}
          onChange={(e) => {
            setEmailError(null);
            setEmail(e.target.value);
          }}
          placeholder="Email"
          type="email"
        />
        {emailError && <p className="mt-1 text-sm text-mon-red" dangerouslySetInnerHTML={{ __html: emailError }} />}
      </div>
      <div className="relative mb-3">
        <input
          className={`w-full rounded border p-2 ${passwordError ? "border-mon-red" : "border-slate-200"}`}
          type="password"
          value={password}
          onChange={(e) => {
            setPasswordError(null);
            setPassword(e.target.value);
          }}
          placeholder="Password (min 8 chars, 1 uppercase, 1 lowercase, 1 number)"
        />
        {passwordError && <p className="mt-1 text-sm text-mon-red" dangerouslySetInnerHTML={{ __html: passwordError }} />}
      </div>
      <button
        onClick={register}
        className="w-full rounded bg-mon-red px-4 py-2 text-white shadow-sm transition hover:bg-mon-red-dark"
      >
        Create account
      </button>
      <p className="mt-3 text-sm text-slate-600">
        Already registered? <Link href="/login" className="font-medium text-mon-red hover:text-mon-red-dark">Login</Link>
      </p>
    </div>
  );
}
