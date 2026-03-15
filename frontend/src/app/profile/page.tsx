"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { supabase } from "@/lib/supabase";

interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  is_admin: boolean;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      const payload = await apiFetch<UserProfile>(`/users/${data.user.id}`);
      setProfile(payload);
    };
    loadProfile();
  }, []);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="rounded border bg-white p-4">
      <h1 className="text-2xl font-bold">{profile.username}</h1>
      {profile.avatar_url ? <img src={profile.avatar_url} alt={profile.username} className="mt-2 h-24 w-24 rounded-full object-cover" /> : null}
      <p className="mt-2 text-slate-700">{profile.bio ?? "No bio yet."}</p>
      <p className="mt-2 text-xs text-slate-500">Role: {profile.is_admin ? "Admin" : "Member"}</p>
    </div>
  );
}
